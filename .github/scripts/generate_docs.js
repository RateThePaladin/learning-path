// ==============================================================================
// Automated Documentation & Asset Index Generator
// Generates catalog READMEs deterministically for assets/icons, homelab scripts, and docs.
// ==============================================================================

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

const IMAGE_EXTENSIONS = new Set([".png", ".svg", ".webp", ".jpg", ".jpeg"]);

/**
 * 1. Automatically generate assets/icons/README.md
 */
function generateIconGallery() {
    const iconsDir = path.join(REPO_ROOT, "assets/icons");
    const iconsReadmePath = path.join(iconsDir, "README.md");

    if (!fs.existsSync(iconsDir)) return;

    const files = fs.readdirSync(iconsDir)
        .filter(file => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
        .sort((a, b) => a.localeCompare(b));

    const rows = files.map(file => {
        const name = path.basename(file, path.extname(file));
        const cdnUrl = `https://cdn.jsdelivr.net/gh/RateThePaladin/learning-path@main/assets/icons/${file}`;
        const rawUrl = `https://raw.githubusercontent.com/RateThePaladin/learning-path/main/assets/icons/${file}`;
        return `| <img src="${file}" width="48" height="48" alt="${name}" /> | \`${file}\` | \`${cdnUrl}\` | \`${rawUrl}\` |`;
    }).join("\n");

    const content = `# App Icons Gallery & URL Cheatsheet

This directory hosts permanent, immutable icons for homelab dashboards (Homepage, Homarr, Heimdall, Dashy, Organizr), Unraid Docker templates, and application banners.

> **Auto-Generated**: This catalog is automatically updated by GitHub Actions whenever icons are added or modified.

---

## 🚀 Fast CDN & Permanent URLs

Because icons here are tracked in Git, the URLs will never change. You can use either direct GitHub raw links or the **jsDelivr CDN** (recommended for production dashboards as it provides global edge caching, proper MIME headers, and avoids GitHub rate limits).

### URL Patterns:

- **jsDelivr CDN (Recommended)**:
  \`https://cdn.jsdelivr.net/gh/RateThePaladin/learning-path@main/assets/icons/<icon-filename>\`
- **GitHub Raw**:
  \`https://raw.githubusercontent.com/RateThePaladin/learning-path/main/assets/icons/<icon-filename>\`

---

## 📦 Hosted Icons (${files.length})

| Icon | Filename | jsDelivr CDN URL | GitHub Raw URL |
| :---: | :--- | :--- | :--- |
${rows || "| (No icons yet) | - | - | - |"}

---

## 📌 Contribution Guidelines

When adding new icons:
1. Use transparent PNGs or SVGs where possible.
2. Target square dimensions (e.g. 256x256 or 512x512).
3. Use lowercase, kebab-case filenames (e.g. \`my-app.png\`).
4. Commit the new file—the catalog table above will automatically rebuild!
`;

    fs.writeFileSync(iconsReadmePath, content);
    console.log(`✅ Generated assets/icons/README.md with ${files.length} icon(s).`);
}

/**
 * 2. Automatically generate homelab/unraid/user-scripts/Common user scripts for unraid.md
 */
function generateUnraidScriptIndex() {
    const scriptsDir = path.join(REPO_ROOT, "homelab/unraid/user-scripts");
    const readmePath = path.join(scriptsDir, "Common user scripts for unraid.md");

    if (!fs.existsSync(scriptsDir)) return;

    // Known script descriptions with fallback to comment extraction
    const descriptions = {
        "autofanAutostart.sh": "Ensures the Dynamix System Autofan plugin service starts automatically on system boot.",
        "HBAFanControl.sh": "Monitors LSI/Broadcom HBA chip temperature via storcli and adjusts PWM fan speed dynamically with hysteresis and Unraid alert notifications.",
        "nvidiaDriverUnlock.sh": "Downloads and applies the keylase patch to remove artificial NVENC encoding session limits on consumer NVIDIA GPUs.",
        "nvidiaPowerState.sh": "Enables NVIDIA driver persistence daemon (nvidia-persistenced) to manage power states efficiently.",
        "nvidiaSpaceInvaderPowerState.sh": "Advanced script (SpaceInvaderOne pattern) to cycle NVIDIA GPU power states and optimize idle power draw.",
        "tdarrRollingQueue.sh": "Queries the Tdarr database for media files older than 30 days previously marked as 'Not required' and re-queues them for health check / transcoding."
    };

    const files = fs.readdirSync(scriptsDir)
        .filter(file => file.endsWith(".sh"))
        .sort((a, b) => a.localeCompare(b));

    const rows = files.map(file => {
        let desc = descriptions[file];
        if (!desc) {
            // Extract first comment block from file
            const content = fs.readFileSync(path.join(scriptsDir, file), "utf-8");
            const match = content.match(/#\s*(?:Description:\s*)?([^\n#]+)/i);
            desc = match ? match[1].trim() : "Custom operational user script.";
        }
        return `| [\`${file}\`](${encodeURI(file)}) | ${desc} |`;
    }).join("\n");

    const content = `# Common User Scripts for Unraid

This folder contains common operational and maintenance user scripts tailored for Unraid systems.

> **Disclaimer**: These scripts are provided for documentation and knowledge base purposes. Always test on your own hardware and configuration before running them in a production array.

---

## 📜 Script Index (${files.length} scripts)

| Script | Purpose |
| :--- | :--- |
${rows || "| (No scripts found) | - |"}
`;

    fs.writeFileSync(readmePath, content);
    console.log(`✅ Generated Unraid script index with ${files.length} script(s).`);
}

/**
 * 3. Automatically generate docs/README.md (Obsidian & GitHub Knowledge Base Index)
 */
function generateDocsIndex() {
    const docsDir = path.join(REPO_ROOT, "docs");
    const docsReadmePath = path.join(docsDir, "README.md");

    if (!fs.existsSync(docsDir)) return;

    const categories = [
        { name: "SSH & Key Management", dir: "ssh" },
        { name: "Secrets & Doppler", dir: "doppler" },
        { name: "CI/CD & GitHub Actions", dir: "github-actions" },
        { name: "Certifications & Cloud", dir: "certifications" }
    ];

    let body = "";

    for (const cat of categories) {
        const catDir = path.join(docsDir, cat.dir);
        if (!fs.existsSync(catDir)) continue;

        const files = fs.readdirSync(catDir)
            .filter(file => file.endsWith(".md") || file.endsWith(".pdf") || file.endsWith(".sh"))
            .filter(file => file.toLowerCase() !== "readme.md")
            .sort((a, b) => a.localeCompare(b));

        if (files.length === 0) continue;

        body += `### ${cat.name}\n\n`;
        body += `| Document / Resource | Type | Link |\n| :--- | :--- | :--- |\n`;
        for (const file of files) {
            const ext = path.extname(file).replace(".", "").toUpperCase();
            const displayName = path.basename(file, path.extname(file));
            const relPath = `${cat.dir}/${encodeURI(file)}`;
            body += `| **${displayName}** | \`${ext}\` | [Open](${relPath}) |\n`;
        }
        body += "\n";
    }

    const content = `# Knowledge Base & Documentation Index

This directory serves as the structured knowledge base for notes, guides, cheatsheets, and certifications. It is designed to work seamlessly both inside **Obsidian** and on GitHub.

> **Auto-Generated**: This index automatically maps all guides and resources across \`docs/\`.

---

## 📚 Topics & Guides

${body}
`;

    fs.writeFileSync(docsReadmePath, content);
    console.log(`✅ Generated docs/README.md table of contents.`);
}

function main() {
    console.log("Generating subfolder documentation catalogs...");
    generateIconGallery();
    generateUnraidScriptIndex();
    generateDocsIndex();
    console.log("All subfolder documentation catalogs up to date!");
}

main();
