#!/bin/bash

# Generate a unique tag using the current timestamp
TAG=$(date +%Y%m%d%H%M%S)

# Build the Docker container with the unique tag
docker build -t fastapi:$TAG -f .dockerfile .

# Apply the new configuration with Terraform using the latest flag
terraform apply -var="image_tag=$TAG" -auto-approve