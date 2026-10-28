# learning-path

> **AI-GENERATED CODE DISCLAIMER**
> Portions of this repository, including this documentation, were generated with the assistance of an AI.
> Please review and test all code thoroughly before using it in a production environment.

Forever a student. Repo for documenting public learnings and certifications

## Recent Updates

Here's a summary of the most recent developments in the repository:

*   Merged pull request #14, introducing a refactored repository structure and assets management. ([`c34be17`](https://github.com/RateThePaladin/learning-path/commit/c34be17))
*   Refactored repository into a domain-driven hierarchy, established assets hosting, and optimized CI/CD workflows. ([`171c865`](https://github.com/RateThePaladin/learning-path/commit/171c865))
*   Added a new application icon (courtesy of Gemini). ([`43d97da`](https://github.com/RateThePaladin/learning-path/commit/43d97da))
*   Merged pull request #12, automating README updates. ([`08fed6a`](https://github.com/RateThePaladin/learning-path/commit/08fed6a))
*   Implemented automated README updates based on recent changes. ([`fd719e7`](https://github.com/RateThePaladin/learning-path/commit/fd719e7))

## Repository Structure

This repository is organized into several key directories, each serving a distinct purpose in documenting various technical learnings, homelab configurations, and projects:

*   **[.github](./.github)**: Contains GitHub Actions CI/CD workflows (such as AI README generation) and repository maintenance scripts.
*   **[assets](./assets)**: Centralized static assets repository, including permanent [app icons](./assets/icons) for homelab dashboards, avatars, and Obsidian note attachments.
*   **[docs](./docs)**: Obsidian knowledge base containing guides and cheatsheets for SSH key management, Doppler secrets, GitHub Actions, and certifications.
*   **[homelab](./homelab)**: Infrastructure configurations and host scripts, featuring [Unraid user scripts](./homelab/unraid/user-scripts), Fail2Ban security with Cloudflare/Telegram integration, and proxy configurations.
*   **[projects](./projects)**: Standalone runnable project templates and codebases, including a containerized Python FastAPI + Terraform stack.