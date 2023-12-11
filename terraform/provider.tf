variable "project" {
  type = string
  default = "beta-dodolandia"
}

variable "region" {
  type = string
  default = "europe-west3"
}

variable "service_name" {
  type = string
  default = "photos-backup-sveltekit"
}

variable "cloud_project_number" {
  type = string
  default = "265210792609"
}

provider "google" {
  project = "beta-dodolandia"
  region  = "europe-west3"
}
