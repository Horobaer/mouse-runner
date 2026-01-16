terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = "mouse-runner-481722"
  region  = "us-central1"
}

variable "image_url" {
  description = "The container image URL to deploy"
  type        = string
  default     = "us.gcr.io/mouse-runner-481722/mouse-adventure:latest"
}

resource "google_cloud_run_v2_service" "default" {
  name     = "mouse-runner"
  location = "us-central1"
  ingress = "INGRESS_TRAFFIC_ALL"

  template {
    # Using specific service account as per security best practice (Least Privilege)
    service_account = "gamer-des-nordens@mouse-runner-481722.iam.gserviceaccount.com"
    
    scaling {
      max_instance_count = 1
    }

    containers {
      image = var.image_url
      
      resources {
        limits = {
          cpu    = "1000m"
          memory = "512Mi"
        }
      }
      
      ports {
        container_port = 8080
      }
    }
  }
}

# Explicitly defining public access policy
resource "google_cloud_run_service_iam_member" "public_access" {
  service  = google_cloud_run_v2_service.default.name
  location = google_cloud_run_v2_service.default.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "service_url" {
  value = google_cloud_run_v2_service.default.uri
}
