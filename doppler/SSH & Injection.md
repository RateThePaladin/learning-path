```markdown
# Doppler VS Code Remote-SSH Wrapper

> **AI-GENERATED CODE DISCLAIMER**
> This documentation and the associated code were generated with the assistance of an AI. 
> Please review and test thoroughly before using in a production environment.

I have a love-hate relationship with my homelab. I love building things and setting up new environments, but honestly, once I build something I forget about it a few weeks later - including how to access it. Not a problem when you have a webpage and can recover a password; more of a problem when you lose the ssh key in your forest of `.ssh` keys.

![[ssh_key_example.png]]

Enter [Doppler](https://www.doppler.com/) - a secret management platform that is primarily used for teams sharing access to common resources. I'll be using it to keep track of my ssh keys and their hosts, with the added security benefit of clearing out my `.ssh` folder.

Normally, you can use Doppler to spin up a secure, ephemeral SSH connection directly from your terminal like this:

```bash
doppler run --project ssh-tokens --config dev --mount ssh.key --mount-template ~/.ssh/NODE.key.tmpl --mount-max-reads 3 --command 'ssh $NODE_USER@$NODE_HOST -i ssh.key'

```

And here's the `NODE.key.tmpl` file it references:

```text
{{ .NODE_KEY }}

```

This works well for standard terminal access, but integrating it into VS Code's Remote-SSH extension requires a bit more effort, as VS Code manages its own background SSH process.

## The VS Code Wrapper

This repository contains a secure, ephemeral SSH wrapper script that intercepts VS Code's standard SSH connection attempts. It dynamically fetches the target host, user, and private key from Doppler, and mounts the key to a temporary file (`/tmp/`) with a strict read limit (`--mount-max-reads 3`). Once the IDE connects, the key automatically vanishes from your local disk.

It explicitly bypasses macOS Keychain UI prompts to prevent background daemon hangs, ensuring a seamless one-click connection from VS Code.

## Prerequisites

* [Doppler CLI](https://docs.doppler.com/docs/install-cli) installed.
* VS Code with the [Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh) extension.

## 1. Doppler Setup

In your Doppler project (e.g., `ssh-tokens`, config `dev`), create your secrets using a consistent uppercase prefix for each host. For an example host named `NODE`, you need:

* `NODE_HOST`: The IP address or domain.
* `NODE_USER`: The SSH username.
* `NODE_KEY`: The private SSH key.

Because VS Code runs its SSH helper as a background process, it cannot trigger the macOS Keychain to authenticate Doppler. You must generate a read-only Service Token:

```bash
doppler configs tokens create vscode-ssh --project ssh-tokens --config dev --plain > ~/.ssh/doppler_token
chmod 600 ~/.ssh/doppler_token

```

## 2. The SSH Key Template

Create a Doppler template file for your host. The filename must match your target host's name (case-insensitive).

```bash
nano ~/.ssh/node.key.tmpl

```

Add the following content to inject the key from Doppler:

```text
{{ .NODE_KEY }}

```

## 3. The Wrapper Script

Create the wrapper script on your local machine:

```bash
nano ~/.ssh/doppler-vscode-ssh.sh

```

Copy the contents of the `doppler-vscode-ssh.sh` script **included in this repository** into that file.

Make the script executable:

```bash
chmod +x ~/.ssh/doppler-vscode-ssh.sh

```

## 4. VS Code Configuration

Tell VS Code to use this script instead of the default SSH binary.

1. Open VS Code Settings (`Cmd/Ctrl` + `,`).
2. Search for `remote.SSH.path`.
3. Enter the **absolute path** to your script (e.g., `/Users/yourusername/.ssh/doppler-vscode-ssh.sh`).

### Enable UI Auto-fill

To make your Doppler hosts appear in VS Code's Remote Explorer sidebar, add dummy entries to your standard `~/.ssh/config` file:

```text
Host NODE
    HostName managed-by-doppler

```

*Note: The wrapper script intercepts the connection before standard SSH resolves `managed-by-doppler`, making it perfectly safe.*

## 5. Usage

* **Via VS Code UI:** Open the Remote Explorer sidebar, click the arrow next to your host, and select a folder to connect.
* **Via Local Terminal:** Launch VS Code directly into a specific remote directory using the command line:

```bash
code --remote ssh-remote+NODE /home/ubuntu/

```