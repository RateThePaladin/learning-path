# learning-path

> **AI-GENERATED CODE DISCLAIMER**
> Portions of this repository, including this documentation, were generated with the assistance of an AI.
> Please review and test all code thoroughly before using it in a production environment.

Forever a student. Repo for documenting public learnings and certifications

## Recent Updates

Here's a summary of the most recent developments in the repository:

*   [`5ef8d3d`](https://github.com/RateThePaladin/learning-path/commit/5ef8d3d) - Added antigravity and Windscribe application icons to assets.
*   [`3484be5`](https://github.com/RateThePaladin/learning-path/commit/3484be5) - Merged pull request #13, introducing automated README updates.
*   [`d02fc1a`](https://github.com/RateThePaladin/learning-path/commit/d02fc1a) - Implemented automatic README updates based on recent changes.
*   [`c34be17`](https://github.com/RateThePaladin/learning-path/commit/c34be17) - Merged pull request #14, refactoring the repository structure and assets management.
*   [`171c865`](https://github.com/RateThePaladin/learning-path/commit/171c865) - Restructured the repository into a domain hierarchy, added assets hosting, and optimized CI/CD.

## Repository Structure

This repository is organized into several key directories, each serving a distinct purpose in documenting various technical learnings, homelab configurations, and projects:

*   **[.github](./.github)**: This directory contains configuration files for GitHub-specific features, primarily GitHub Actions workflows. It manages automated tasks such as CI/CD pipelines and repository maintenance, including the AI-assisted README updates. (See `scripts` and `workflows` subfolders).
*   **[assets](./assets)**: Serves as a centralized location for static assets used across the repository. This includes images, diagrams, and various media files that support documentation and project visuals. Key subfolders include `icons` for immutable homelab application icons, `avatars`, and `docs`.
*   **[docs](./docs)**: Houses an Obsidian-based knowledge base. This section contains various guides, cheatsheets, and certification materials covering topics like SSH key management, Doppler secrets, and GitHub Actions. (Subfolders include `certifications`, `doppler`, `github-actions`, and `ssh`).
*   **[homelab](./homelab)**: Dedicated to infrastructure configurations and host scripts for personal homelab setups. It includes settings for security, proxy services, and user scripts for platforms like Unraid. (Check `proxy`, `security`, and `unraid/user-scripts`).
*   **[projects](./projects)**: Contains standalone runnable project templates and codebases. Each subfolder represents a distinct project, often with its own documentation and environment setup, such as the `pythonBackendStack`.