#!/bin/bash

# Function to display help message
show_help() {
    echo "Usage: ./localDeploy.sh"
    echo ""
    echo "This script builds a Docker container with a unique tag and applies the new configuration with Terraform."
    echo ""
    echo "Options:"
    echo "  -h, --help    Show this help message and exit"
}

# Check for help flag
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    show_help
    exit 0
fi

# Generate a unique tag using the current timestamp
TAG=$(date +%Y%m%d%H%M%S)

# Build the Docker container with the unique tag
docker build -t fastapi:$TAG -f .dockerfile .
if [ $? -ne 0 ]; then
    echo "Error: Docker build failed."
    exit 1
fi

# Apply the new configuration with Terraform using the latest flag
terraform apply -var="image_tag=$TAG" -auto-approve
if [ $? -ne 0 ]; then
    echo "Error: Terraform apply failed."
    exit 1
fi

echo "Deployment successful with tag $TAG."