# ---------------------------------------------------------------------------------------------------------------------
# TERRAFORM CONFIGURATION FOR MOUSE RUNNER CLOUD RUN DEPLOYMENT
# ---------------------------------------------------------------------------------------------------------------------
# This script deploys the "Mouse Adventure" game to Google Cloud Run in a highly cost-efficient manner.
# It ensures:
# 1. The service is deployed to the 'us-central1' region.
# 2. Resources are minimized (256MB RAM, 1 CPU) to stay within free tier or low cost limits.
# 3. Scaling is restricted (Max 1 instance) to prevent cost overruns.
# 4. Public access is enabled so anyone on the internet can play.

terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

# ---------------------------------------------------------------------------------------------------------------------
# PROVIDER SETUP
# ---------------------------------------------------------------------------------------------------------------------
# Configures the Google Cloud Provider.
# Usage: terraform init && terraform apply
# Note: Ensure you are authenticated via `gcloud auth application-default login` before running this.

provider "google" {
  project = "mouse-runner-481722" # The project ID retrieved from previous deployment Context
  region  = "us-central1"         # Region chosen to match the requested URL structure (us-central1 -> uc)
}

# ---------------------------------------------------------------------------------------------------------------------
# CLOUD RUN SERVICE RESOURCE
# ---------------------------------------------------------------------------------------------------------------------
# Defines the actual Cloud Run service. 
# This is where we configure the container image, resources, and scaling limits.

resource "google_cloud_run_service" "mouse_runner" {
  name     = "mouse-runner" # The service name. Contributes to the URL hash.
  location = "us-central1"  # Location. Contributes to the URL (uc).

  template {
    spec {
      containers {
        # IMAGE SPECIFICATION
        # We are using the image built from the local Dockerfile. 
        # Ideally, this should point to a specific digest or tag in Google Artifact Registry (gcr.io/...).
        # For this script to work immediately after a `gcloud run deploy`, we can point to the 'latest' tag 
        # implied by the service's current running revision or explicitly build/push an image.
        # However, Terraform requires an image URL. 
        # We will assume the image exists at the default GCR location for this project/service 
        # or use a placeholder that the user must update if they want TF to manage the image lifecycle purely.
        # BUT, since we just deployed via `gcloud run deploy --source .`, Google Cloud Build created an image.
        # A common pattern for "just infra" is to ignore the image-name changes so the CI/CD pipeline (gcloud) controls deployment,
        # and Terraform controls the *settings* (RAM, CPU, IAM).
        # We will use the generic image path pattern for Cloud Build deploys or a dummy value that is ignored by lifecycle.
        image = "gcr.io/mouse-runner-481722/mouse-runner:latest" 

        # RESOURCE OPTIMIZATION (COST SAVING)
        # We explicitly set limits to the lowest viable values for a Node/Nginx app.
        resources {
          limits = {
            cpu    = "1000m"  # 1 vCPU (Cloud Run defaults to this or higher)
            memory = "256Mi"  # 256 Megabytes. Sufficient for this simple static game. 
                               # Reduces cost per second of execution time.
          }
        }
        
        # PORT CONFIGURATION
        # The Dockerfile exposes port 8080. Cloud Run listens on $PORT (default 8080).
        ports {
          container_port = 8080
        }
      }
    }

    # SCALING CONFIGURATION (COST SAVING)
    metadata {
      annotations = {
        # Scale to Zero: When no one is playing, 0 instances run. Cost = $0.
        "autoscaling.knative.dev/minScale" = "0"
        
        # Max Instances: Cap at 1 to strictly limit potential costs.
        # This means only one container serves all traffic. 
        # For a simple game, this can handle many concurrent requests (Nginx is efficient),
        # but prevents a DDOS or viral spike from spinning up 1000 instances and charging the credit card.
        "autoscaling.knative.dev/maxScale" = "1"
        
        # Execution Environment: Default (gvisor) is fine.
      }
    }
  }

  # TRAFFIC MANAGEMENT
  # Route 100% of traffic to the latest revision created by this configuration.
  traffic {
    percent         = 100
    latest_revision = true
  }

  # LIFECYCLE MANAGEMENT
  # If we deploy new code via `gcloud run deploy` (which updates the image),
  # we don't want Terraform to revert the image back to "latest" if "latest" hasn't been updated in the TF state.
  # So we ignore changes to the image field.
  lifecycle {
    ignore_changes = [
      template[0].spec[0].containers[0].image,
    ]
  }
}

# ---------------------------------------------------------------------------------------------------------------------
# IAM POLICY (PUBLIC ACCESS)
# ---------------------------------------------------------------------------------------------------------------------
# By default, Cloud Run services are private.
# This resource creates a policy binding that allows "allUsers" (everyone on the internet)
# to invoke (access) the service.

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location    = google_cloud_run_service.mouse_runner.location
  project     = google_cloud_run_service.mouse_runner.project
  service     = google_cloud_run_service.mouse_runner.name

  policy_data = data.google_iam_policy.noauth.policy_data
}

# ---------------------------------------------------------------------------------------------------------------------
# OUTPUTS
# ---------------------------------------------------------------------------------------------------------------------
# Print the URL after deployment.

output "url" {
  description = "The URL of the deployed Cloud Run service"
  value       = google_cloud_run_service.mouse_runner.status[0].url
}
