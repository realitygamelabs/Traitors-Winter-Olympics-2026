# The Traitors: Winter Olympics — Narrative Visibility Fix

This update fixes a likely stale chapter-data problem and makes the Thomas/Beverage narrative clearly visible in **all six chapter intros**. It changes five small site files; your existing screenshot assets and Google Drive links are preserved.

## Install with GitHub Desktop

1. Download and unzip this package.
2. Open **GitHub Desktop**, select your `Traitors-Winter-Olympics-2026` repository and choose **Repository → Show in Finder** (Mac) or **Show in Explorer** (Windows).
3. Copy `index.html`, `app.js`, `styles.css`, and `data.js` from this update into the **root** of your repository, overwriting the existing versions. The README is optional.
4. Do not delete or replace `assets/` or its screenshots.
5. Go back to GitHub Desktop, commit the changes and click **Push origin**.
6. Check the **Actions** tab for a successful Pages deployment. Refresh the published site after completion.

## Verify

Select **Chapter 02 / The First Tower**. Immediately under the chapter introduction, you should see **BEHIND THE DECEPTION** and the sentence beginning **“Thomas + Beverage are the two Traitors.”** The chapter's main description should also begin **“At Tower 1, Thomas and Beverage...”** If you don't see that exact text, the latest `data.js` and/or `index.html` hasn't been published yet.

This update adds version query strings to all three local JS/CSS requests so browsers fetch the revised data rather than a previously cached version. It also repeats the correct roles in the prominent chapter summary, so the key information is immediately visible without scrolling down to the long-form chronicle.

The archive contains no audience sentiment analysis or spectator-chat material. Mobile Google Drive direct-play links and the missing-screenshot behavior are unchanged.
