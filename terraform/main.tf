resource "google_secret_manager_secret" "github-token-secret" {
  secret_id = "github-token-secret"

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}

resource "google_secret_manager_secret_version" "github-token-secret-version" {
  secret      = google_secret_manager_secret.github-token-secret.id
  secret_data = file("../.ssh/gh-token-clasic")
}

resource "google_secret_manager_secret" "mongodb-uri" {
  secret_id = "mongodb-uri"

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}

resource "google_secret_manager_secret_version" "mongodb-uri-version" {
  secret      = google_secret_manager_secret.mongodb-uri.id
  secret_data = file("../.ssh/mongodb-uri")
}

data "google_iam_policy" "p4sa-secretAccessor" {
  binding {
    role = "roles/secretmanager.secretAccessor"
    // Here, service-265210792609 is the Google Cloud project number for my-project-name.
    //       service-265210792609@gcp-sa-cloudbuild.iam.gserviceaccount.com
    members = ["serviceAccount:service-${var.cloud_project_number}@gcp-sa-cloudbuild.iam.gserviceaccount.com"]
  }
}

resource "google_secret_manager_secret_iam_policy" "policy" {
  secret_id   = google_secret_manager_secret.github-token-secret.secret_id
  policy_data = data.google_iam_policy.p4sa-secretAccessor.policy_data 
}

resource "google_cloudbuildv2_connection" "photos-backup-connection" {
  location = var.region
  name     = "${var.service_name}-connection"

  github_config {
    app_installation_id = 9038219

    authorizer_credential {
      oauth_token_secret_version = google_secret_manager_secret_version.github-token-secret-version.id
    }
  }
}

resource "google_cloudbuildv2_repository" "photos-backup-repository" {
  location          = var.region
  name              = var.service_name
  parent_connection = google_cloudbuildv2_connection.photos-backup-connection.name
  remote_uri        = "https://github.com/ionutale/photos-backup-sveltekit.git"


}

data "google_service_account" "terraform-service-account" {
  account_id = "tf-test-account"
}

resource "google_cloudbuild_trigger" "photos-backup-sveltekit-trigger" {
  name = "${var.service_name}-trigger"
  github {
    owner = "ionutale"
    name  = "photos-backup-sveltekit"
    push {
      branch = "main"
    }
  }
  ignored_files = [".gitignore"]
  filename      = "cloudbuild.yaml"
  #  service_account = "tf-test-account@beta-dodolandia.iam.gserviceaccount.com"
  #  build {
  #     step {
  #     name       = "node" 
  #     entrypoint = "npm"
  #     args       = ["install"]
  #     }
  #   }

  substitutions = {
    _MONGO_URI     = google_secret_manager_secret_version.mongodb-uri-version.secret_data
    _AR_HOSTNAME   = "${var.region}-docker.pkg.dev"
    _DEPLOY_REGION = var.region
    _PLATFORM      = "managed"
    _SERVICE_NAME  = var.service_name
    _TRIGGER_ID    = "cloud-build-photos-backup-trigger"
  }
}

resource "google_cloud_run_v2_service" "default" {
  name     = var.service_name
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      # image = "eu.gcr.io/europe-west8/photos-backup-sveltekit"
      image = "gcr.io/cloudrun/placeholder@sha256:b3aeb23f49574ccba2cf6688ee36a9496e8b07d3abcbafcd9b6333165b5ef1b1"
      ports {
        container_port = 4173
      }
    }

    service_account = "tf-test-account@beta-dodolandia.iam.gserviceaccount.com"
  }
}

resource "google_cloud_run_service_iam_binding" "default" {
  location = google_cloud_run_v2_service.default.location
  service  = google_cloud_run_v2_service.default.name
  role     = "roles/run.invoker"
  members = [
    "allUsers"
  ]
}

resource "google_storage_bucket" "photos-backup-sveltekit-bucket" {
  name          = var.service_name
  location      = "EU"
  force_destroy = true

  uniform_bucket_level_access = true
}

resource "google_storage_bucket" "photos-backup-sveltekit-cache-bucket" {
  name          = "${var.service_name}-cache"
  location      = "EU"
  force_destroy = true

  uniform_bucket_level_access = true
}
