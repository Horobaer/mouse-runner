terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.1"
    }
  }
}

provider "docker" {
  host = "npipe:////./pipe/docker_engine"
}

resource "null_resource" "docker_build" {
  triggers = {
    always_run = "${timestamp()}"
  }

  provisioner "local-exec" {
    # Build context is two levels up
    command = "docker build -t mouse-runner-local ../../"
    working_dir = "." 
  }
}

resource "docker_container" "mouse_runner" {
  # Wait for build to complete
  depends_on = [null_resource.docker_build]
  
  image = "mouse-runner-local"
  name  = "mouse-runner-local"
  ports {
    internal = 8080
    external = 8091
  }
  restart = "no"
  
  # Ensure we replace the container if image changes (trigger re-creation)
  lifecycle {
    replace_triggered_by = [null_resource.docker_build]
  }
}
