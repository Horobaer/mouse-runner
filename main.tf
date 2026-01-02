terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.1"
    }
  }
}

provider "docker" {
  host = "npipe:////./pipe/dockerDesktopLinuxEngine"
}

resource "null_resource" "docker_build" {
  triggers = {
    always_run = "${timestamp()}"
  }

  provisioner "local-exec" {
    command = "docker build -t mouse-runner-local ."
  }
}

resource "docker_container" "mouse_runner" {
  # Wait for build to complete
  depends_on = [null_resource.docker_build]
  
  image = "mouse-runner-local"
  name  = "mouse-runner-local"
  ports {
    internal = 80
    external = 8091
  }
  restart = "no"
}
