# App Icons Gallery & URL Cheatsheet

This directory hosts permanent, immutable icons for homelab dashboards (Homepage, Homarr, Heimdall, Dashy, Organizr), Unraid Docker templates, and application banners.

---

## 🚀 Fast CDN & Permanent URLs

Because icons here are tracked in Git, the URLs will never change. You can use either direct GitHub raw links or the **jsDelivr CDN** (recommended for production dashboards as it provides global edge caching, proper MIME headers, and avoids GitHub rate limits).

### URL Patterns:

- **jsDelivr CDN (Recommended)**:
  `https://cdn.jsdelivr.net/gh/RateThePaladin/learning-path@main/assets/icons/<icon-filename>`
- **GitHub Raw**:
  `https://raw.githubusercontent.com/RateThePaladin/learning-path/main/assets/icons/<icon-filename>`

---

## 📦 Hosted Icons

| Icon | Filename | jsDelivr CDN URL | GitHub Raw URL |
| :---: | :--- | :--- | :--- |
| <img src="socex.png" width="48" height="48" alt="socex" /> | `socex.png` | `https://cdn.jsdelivr.net/gh/RateThePaladin/learning-path@main/assets/icons/socex.png` | `https://raw.githubusercontent.com/RateThePaladin/learning-path/main/assets/icons/socex.png` |

---

## 📌 Contribution Guidelines

When adding new icons:
1. Use transparent PNGs or SVGs where possible.
2. Target square dimensions (e.g. 256x256 or 512x512).
3. Use lowercase, kebab-case filenames (e.g. `my-app.png`).
4. Update the table above so URLs are readily accessible.
