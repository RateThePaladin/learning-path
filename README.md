# learning-path

> **AI-GENERATED CODE DISCLAIMER**
> Portions of this repository, including this documentation, were generated with the assistance of an AI.
> Please review and test all code thoroughly before using it in a production environment.

Forever a student. Repo for documenting public learnings and certifications

## Recent Updates

Here's a summary of the most recent developments in the repository:

*   **2026-10-27**: Reorganized repository architecture into domain-driven hierarchy and established permanent `assets/icons/` hosting. ([#14](https://github.com/RateThePaladin/learning-path/pull/14))
*   **2026-02-22**: Added new application icon for Docker socat proxy. ([`43d97da`](https://github.com/RateThePaladin/learning-path/commit/43d97da))
*   **2026-02-22**: Merged pull request related to Fail2Ban updates and Cloudflare IP unbanning. ([#11](https://github.com/RateThePaladin/learning-path/pull/11))
*   **2026-02-22**: Automated README updates and repository maintenance workflows. ([#10](https://github.com/RateThePaladin/learning-path/pull/10))
*   **2026-02-22**: Added Fail2Ban configuration with Telegram alert scaffolding. ([`48a1df2`](https://github.com/RateThePaladin/learning-path/commit/48a1df2))

## Repository Structure

This repository is organized into several key directories, each serving a distinct purpose in documenting various technical learnings, homelab configurations, and projects:

*   **[.github](./.github)**: Contains GitHub Actions CI/CD workflows (such as AI README generation) and repository maintenance scripts.
*   **[assets](./assets)**: Centralized static assets repository, including permanent [app icons](./assets/icons) for homelab dashboards (with CDN links), avatars, and Obsidian note attachments.
*   **[docs](./docs)**: Obsidian knowledge base containing guides and cheatsheets for SSH key management, Doppler secrets, GitHub Actions, and certifications.
*   **[homelab](./homelab)**: Infrastructure configurations and host scripts, featuring [Unraid user scripts](./homelab/unraid/user-scripts), Fail2Ban security with Cloudflare/Telegram integration, and proxy configurations.
*   **[projects](./projects)**: Standalone runnable project templates and codebases, including a containerized Python FastAPI + Terraform stack.