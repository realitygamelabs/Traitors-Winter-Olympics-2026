# The Traitors: Winter Olympics | Season Archive

A self-contained static website for the 2026 game. Built with plain HTML, CSS, and JavaScript. No installation, server-side code, build tools, or dependencies are required.

## What's included

- Six selectable chapters spanning Opening through Finale + Reunion.
- All 10 official game-event recording links from the supplied workbook. Recordings are embedded using the Google Drive preview player, with an "Open in Drive" fallback.
- All 191 named confessional entries with player filters, search by player/date, sort order, and Google Drive playback links.
- 967 chronological chat screenshots, converted to optimized WebP images, with a selected set of conversation highlights, full-screen zoom, and chapter-specific galleries.
- Curated chapter summaries based on selected excerpts from the supplied chat screenshots. These are interpretive synopses, not definitive transcripts or confirmation of the players' secret roles.

## Repository setup

1. Extract the ZIP. Its `index.html`, `styles.css`, `app.js`, `data.js`, and `assets/` directory must retain the same relative arrangement.
2. Add the extracted contents to the root of a GitHub repository, then commit and push. Because there are 967 assets, uploading with Git or GitHub Desktop is easier than uploading individual files in the web interface.
3. To host on GitHub Pages, go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, select the main branch and `/ (root)`, then save. GitHub Pages should find `index.html` automatically. (These options are subject to GitHub account/repository policies.)

The website is static, so it can also be hosted on Netlify, Cloudflare Pages, or an ordinary web server. Opening `index.html` locally may work, but a hosted preview is best for testing all embeds.

## Important notes

**Google Drive permissions:** Only links to recordings are included. The audio and video files themselves are **not** stored in the package. The owner of each Drive file must grant the intended viewers access for playback to work; embedding a file does not change permissions.

**Privacy:** The 967 original screenshots include private WhatsApp conversations and may contain participant names, phone numbers, or other personal information. Publishing this repository or deploying it via a publicly accessible GitHub Pages URL will expose those images to anyone who can access the site. Check with participants and remove/redact anything you don't want published before hosting publicly. A private repository does not automatically guarantee that a Pages site is private.

**Dates:** The source spreadsheet identifies event dates but not precise event start times. For boundary days, the archive assigns official recordings by their event name and groups screengrabs/confessionals using calendar dates and practical phase boundaries. A screenshot's filename timestamp records when it was captured, not necessarily when each message was posted.

**Editing:** The narrative, chapter video links, confessional entries, and image index live in `data.js`. The layout is in `index.html`, styling is in `styles.css`, and interactions are in `app.js`. The logo is `assets/logo.png`; all captured images are in `assets/photos/`.
