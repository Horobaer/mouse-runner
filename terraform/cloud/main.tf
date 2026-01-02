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

# Build image using gcloud builds submit (offloading to cloud as per rules)
resource "null_resource" "image_build" {
  triggers = {
    always_run = "${timestamp()}"
  }

  provisioner "local-exec" {
    # Build context is two levels up
    command = "gcloud builds submit --tag gcr.io/mouse-runner-481722/mouse-runner ../../"
  }
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
      image = "gcr.io/mouse-runner-481722/mouse-runner"
      
      resources {
        limits = {
          cpu    = "1000m"
          memory = "256Mi"
        }
      }
      
      ports {
        container_port = 80
      }
    }
  }
  
  depends_on = [null_resource.image_build]
  
  # Force new deployment when build triggers
  lifecycle {
    replace_triggered_by = [null_resource.image_build]
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
