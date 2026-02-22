# learning-path
Forever a student. Repo for documenting public learnings and certifications

## Doppler SSH Wrapper Tutorial

This section details how to set up and use Doppler with VSCode for SSH connections, enabling secret injection into your remote environment. This guide assumes the content of `doppler/SSH & Injection.md` and provides a general method.

### Prerequisites
*   Doppler CLI installed and configured on your local machine.
*   VSCode with the [Remote - SSH extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh) installed.
*   An existing SSH connection configured in your `~/.ssh/config` or equivalent, pointing to your remote host.

### Step 1: Create the VSCode SSH Wrapper Script
Create a new script, for example `doppler-vscode-ssh.sh`, in a known location within your repository (e.g., `doppler/doppler-vscode-ssh.sh` as seen in this repository). This script will wrap your `ssh` command with `doppler run`.

```bash
#!/bin/bash

# This script wraps your SSH command to inject Doppler secrets
# It assumes you are using the `doppler run` command.

# Pass all arguments directly to the SSH command
doppler run -- ssh "$@"
```

Make sure the script is executable: `chmod +x doppler/doppler-vscode-ssh.sh`

### Step 2: Configure VSCode Remote - SSH to use the Wrapper
Modify your SSH configuration file (typically `~/.ssh/config`). For the specific host you want to connect to, add or modify the `ProxyCommand` directive to use your new wrapper script. This ensures that the `doppler run` command is executed *before* the actual SSH connection is established, allowing secrets to be injected into the SSH process itself.

```
Host your-remote-host-alias
    HostName your-remote-host.com
    User your-user
    IdentityFile ~/.ssh/your_ssh_key_name
    ProxyCommand /path/to/your/doppler-vscode-ssh.sh -W %h:%p
    # Example: ProxyCommand ~/path/to/learning-path/doppler/doppler-vscode-ssh.sh -W %h:%p
```
**Important:**
*   Replace `/path/to/your/doppler-vscode-ssh.sh` with the absolute path to the script you created.
*   The `-W %h:%p` is crucial for `ProxyCommand` as it instructs `ssh` to use the wrapped command for forwarding the connection.
*   You can also specify a Doppler project and config if needed: `doppler run --project your-project --config your-config -- ssh "$@"` in your script.

### Step 3: Connect and Verify
Now, when you attempt to connect to `your-remote-host-alias` using VSCode's Remote - SSH extension (or from your terminal), Doppler will automatically inject the configured secrets into the environment of the SSH session.

To verify, once connected to the remote server via VSCode or SSH, you can run commands like `env` or `printenv` and look for your Doppler-managed secrets.

---

## Repository Structure

This repository is organized to house various learning materials, personal projects, and configurations, reflecting my journey as a perpetual student.

*   **`.github/`**: GitHub Actions workflows for repository automation.
    *   `workflows/`: Contains `ai-readme.yml` for automated README updates.
*   **`databricks/`**: Documentation related to Databricks, including certifications.
    *   `1321_3_547573_1699919875_Databricks - Generic.pdf`: A Databricks certification document.
*   **`designs/`**: Design assets for various purposes.
    *   `pfp_icon/`: Profile picture icons, e.g., `DigDug.png`.
*   **`doppler/`**: Doppler configurations, scripts, and documentation for secret management.
    *   `SSH & Injection.md`: Detailed documentation on using Doppler with SSH.
    *   `doppler-vscode-ssh.sh`: A wrapper script for integrating Doppler with VSCode's Remote - SSH.
    *   `doppler_dash_example.png`, `ssh_key_example.png`: Illustrative images.
*   **`github/`**: GitHub-specific learning notes and action configurations.
    *   `actions/`: Examples and documentation for GitHub Actions.
        *   `Require a PR.md`: Notes on enforcing pull request requirements.
        *   `Swift Lint.md`: Guide for Swift linting with GitHub Actions.
        *   `Xcode build pipeline using CircleCI.md`: Documentation on setting up Xcode builds with CircleCI.
*   **`projects/`**: Dedicated directory for personal projects.
    *   `pythonBackendStack/`: A project demonstrating a Python backend stack with Terraform and Docker.
        *   `.README`: Project-specific README.
        *   `app/`: Application source code, including `main.py`.
        *   `.dockerfile`, `.dockerignore`, `.gitignore`, `.terraform.lock.hcl`, `requirements.txt`: Configuration and dependency files.
        *   `localDeploy.sh`: Script for local deployment.
        *   `main.tf`: Terraform configuration file.
*   **`proxy/`**: Proxy configurations.
    *   `cloud_proxy.conf`: Cloud proxy settings.
    *   `socat.conf`, `socat_compose.yaml`: Configuration and Docker Compose for Socat.
*   **`scripts/`**: General utility scripts for repository maintenance or specific tasks.
    *   `package.json`, `update_readme.js`: Node.js scripts.
*   **`ssh/`**: SSH key management documentation.
    *   `SSH Key Setup & Transfer to Linux Host.md`: Guide for setting up and transferring SSH keys.
*   **`unraid/`**: Unraid server configurations and custom user scripts.
    *   `user_scripts/`: Collection of scripts for Unraid OS.
        *   `Common user scripts for unraid.md`: Overview of common scripts.
        *   `HBAFanControl`: (Likely a script or directory for HBA fan control).
        *   `autofanAutostart.sh`, `nvidiaDriverUnlock.sh`, `nvidiaPowerState.sh`, `nvidiaSpaceInvaderPowerState.sh`, `tdarrRollingQueue.sh`: Various automation scripts for Unraid.

## Recent Updates

*   **3b68289** - Update ai-readme.yml
*   **4e53fb3** - Merge pull request #4 from RateThePaladin/gemini_readme
*   **5314fbd** - Initial workflow code
*   **fe8f8b0** - Update SSH & Injection.md
*   **a39e66a** - Merge pull request #3 from RateThePaladin/doppler-vscode