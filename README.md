# The Traitors: Winter Olympics — Update without audience chat

This is a **small update** for the existing GitHub Pages repository. It does **not** contain or replace any photos.

## Install

1. In GitHub Desktop, choose your `Traitors-Winter-Olympics-2026` repository and **Repository → Show in Finder** (Mac) or **Show in Explorer** (Windows).
2. Unzip the update package. Copy `index.html`, `app.js`, `styles.css`, and `data.js` into the **repository root**, replacing the old copies.
3. **Delete these two old files from the repository if present:** `sentiment-data.js` and `audience_daily_support.csv`. They are not used and must not remain in the public repo if you want all audience-derived data gone.
4. Leave the `assets/` directory and all existing media unchanged. No need to upload any screenshots again.
5. Commit in GitHub Desktop, then click **Push origin**. GitHub Pages will republish. Refresh after a few minutes (hard-refresh if necessary).

Your page: https://realitygamelabs.github.io/Traitors-Winter-Olympics-2026/

## What changed

- Removed the audience sentiment section and all dependence on the spectator-chat data.
- Rewrote the six chapter narratives with the correct role reveal: Thomas and Beverage discover each other as the Traitors at Tower 1, and Beverage wins alone in the finale. Narratives refer to in-game records and user-provided facts only.
- Mobile: recordings now show a clean, full-width **Play Video in Drive** control by default, avoiding Google Drive’s cropped embedded player. The visitor can choose **Try embedded player** instead. Confessionals likewise default to a direct Drive playback link with an optional embedded player. Playback depends on the source files’ Google Drive permissions.
- Missing screenshot handling: deleting any image under `assets/photos/` no longer leaves a broken thumbnail. A failed load automatically hides the image in both the featured highlights and gallery. Galleries, filters, totals, and lightbox navigation adjust as images are detected missing. Since GitHub Pages is static, there is no live directory listing; the missing file is removed from the interface *when its image is first requested by a visitor's browser*.

## Site structure

- `index.html` — static page and media dialogs
- `app.js` — chapters, videos, confessionals, screenshot gallery and missing-file handling
- `styles.css` — visuals and responsive behavior
- `data.js` — event links, confessional links, story narratives, photo metadata
- `assets/logo.png`, `assets/photos/` — **existing** media in your repository, unchanged by this update

The original event and confessional recordings are still hosted on Google Drive; viewers must have permission to open them. Please review conversation screenshots for privacy before sharing the page publicly.
