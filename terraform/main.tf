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

resource "google_cloudbuildv2_connection" "my-connection" {
  location = "us-west1"
  name     = "my-connection"

  github_config {
    app_installation_id = 40683138
    
    authorizer_credential {
      oauth_token_secret_version = google_secret_manager_secret_version.github-token-secret-version.id
    }
  }
}

resource "google_cloudbuildv2_repository" "my-repository" {
  location          = "us-west1"
  name              = "photos-backup-sveltekit"
  parent_connection = google_cloudbuildv2_connection.my-connection.name
  remote_uri        = "git@github.com:ionutale/photos-backup-sveltekit.git"
}
