resource "google_secret_manager_secret" "github-token-secret" {
  secret_id = "github-token-secret"

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "github-token-secret-version" {
  secret      = google_secret_manager_secret.github-token-secret.id
  secret_data = file("../.ssh/gh-token-clasic")
}

resource "google_secret_manager_secret" "mongodb-uri" {
  secret_id = "mongodb-uri"

  replication {
    automatic = true
  } 
}

resource "google_secret_manager_secret_version" "mongodb-uri-version" {
  secret = google_secret_manager_secret.mongodb-uri.id
  secret_data = file("../.ssh/mongodb-uri")
}

data "google_iam_policy" "p4sa-secretAccessor" {
  binding {
    role = "roles/secretmanager.secretAccessor"
    // Here, service-265210792609 is the Google Cloud project number for my-project-name.
    //       service-265210792609@gcp-sa-cloudbuild.iam.gserviceaccount.com
    members = ["serviceAccount:service-265210792609@gcp-sa-cloudbuild.iam.gserviceaccount.com"]
  }
}

resource "google_secret_manager_secret_iam_policy" "policy" {
  secret_id   = google_secret_manager_secret.github-token-secret.secret_id
  policy_data = data.google_iam_policy.p4sa-secretAccessor.policy_data
}

resource "google_cloudbuildv2_connection" "photos-backup-connection" {
  location = "us-west1"
  name     = "photos-backup-connection"

  github_config {
    app_installation_id = 9038219

    authorizer_credential {
      oauth_token_secret_version = google_secret_manager_secret_version.github-token-secret-version.id
    }
  }
}

resource "google_cloudbuildv2_repository" "photos-backup-repository" {
  location          = "us-west1"
  name              = "photos-backup-sveltekit"
  parent_connection = google_cloudbuildv2_connection.photos-backup-connection.name
  remote_uri        = "https://github.com/ionutale/photos-backup-sveltekit.git"
}

resource "google_cloudbuild_trigger" "photos-backup-sveltekit-trigger" {
  name = "photos-backup-sveltekit-trigger"
  github {
    owner = "ionutale"
    name  = "photos-backup-sveltekit"
    push {
      branch = "main"
      //tag    = "production"
    }
  }
  ignored_files = [".gitignore"]
  filename      = "cloudbuild.yaml"
  #  build {
  #     step {
  #     name       = "node" 
  #     entrypoint = "npm"
  #     args       = ["install"]
  #     }
  #   }

  substitutions = {
    _MONGO_URI     = google_secret_manager_secret_version.mongodb-uri-version.secret_data
    _AR_HOSTNAME   = "europe-west8-docker.pkg.dev"
    _DEPLOY_REGION = "europe-west8"
    _PLATFORM      = "managed"
    _SERVICE_NAME  = "photos-backup-sveltekit"
    _TRIGGER_ID    = "cloud-build-photos-backup-trigger"
  }
}
