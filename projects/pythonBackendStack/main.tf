terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.1"
    }
  }
}

provider "docker" {
  host    = "unix:///var/run/docker.sock"
}

# resource "docker_image" "fastapi" {
#   name         = "fastapi"
#   keep_locally = false
# }
variable "image_tag" {
  description = "The tag of the Docker image"
  type        = string
  default     = "latest"
}

resource "docker_image" "fastapi" {
  name         = "fastapi:${var.image_tag}"
  keep_locally = false
}
resource "docker_container" "fastapi" {
  image = docker_image.fastapi.image_id
  name  = "tutorial"

  ports {
    internal = 80
    external = 80
  }
}
