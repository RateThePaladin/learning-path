# Project Overview

This project is a Python backend application deployed using Docker and managed with Terraform.

## Project Structure

### Key Files and Directories

- **app/main.py**: The main entry point for the Python application.
- **requirements.txt**: Lists the Python dependencies for the project.
- **Dockerfile**: Dockerfile for building the Docker image.
- **main.tf**: Terraform configuration file for managing infrastructure.
- **localDeploy.sh**: Shell script for building and deploying the application.

## Getting Started

### Prerequisites

- Python 3.x
- Docker
- Terraform

### Installation

1. **Clone the repository**:
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Install Python dependencies**:
    ```sh
    pip install -r requirements.txt
    ```

3. **Build the Docker image**:
    ```sh
    docker build -t your-image-name .
    ```

4. **Deploy using Terraform**:
    ```sh
    terraform init
    terraform apply
    ```

### Running the Application

To run the application locally:
```sh
python app/main.py
```

### Deployment

To deploy the application with Docker and Terraform, run:
```sh
./localDeploy.sh
```