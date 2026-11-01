# Math Videos

An independent, free math video library by **Benjamin Yazdi**. This site brings the 350 math videos from the YouTube channel, expanding the 343 entries in the [personal website repository](https://github.com/BenjaminYazdi/BenjaminYazdi.github.io) into a dedicated home, with an introduction, subject browsing, topic filters, search, and embedded YouTube playback.

**Static HTML, CSS, and JavaScript. No dependencies, account system, paid APIs, or server needed.** It works at a domain root or a repository subpath, including GitHub Pages.

## Run locally

Requires Node.js 22 or newer. No installation step is needed.

```sh
npm run dev
```

Open `http://127.0.0.1:4173`. Use a local web server rather than double-clicking the HTML files; the library loads JSON with `fetch`.

```sh
npm test       # catalog search, series order, filtering, and format priority
npm run check # catalog consistency, thumbnails, page assets, and static counts
npm run build # deployable site in dist/
```

To preview the production output: `SERVE_DIR=dist npm run dev`.

## Hosting status: prepared for mathematics-videos.com

The public GitHub repository is ready. **GitHub Pages is currently unpublished**, and automatic publishing is disabled until the planned domain is purchased and configured. The root `CNAME` file records **mathematics-videos.com** as the intended address; it does not claim or activate the domain. Validation still runs on every push and pull request.

GitHub Pages hosting for a public repository is available on GitHub Free. You can give this project its own custom domain without changing the personal site's domain or buying another GitHub plan. Buying and renewing a domain from a registrar is separate. See [GitHub's hosting explanation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) and [custom-domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

### Publish at the chosen domain

1. Purchase **mathematics-videos.com** from the chosen registrar. A domain-only purchase is enough; a Squarespace website subscription is not needed for GitHub Pages hosting.
2. Verify domain ownership in GitHub profile Settings → Pages using GitHub’s supplied TXT record. The root `CNAME` file is already prepared with the intended domain.
3. Enable Pages **for this repository** at **Settings → Pages → Source → GitHub Actions**, and set the matching custom domain. Leave the personal-site repository and its domain settings unchanged.
4. Configure the new domain's DNS using GitHub's custom-domain guide, and enable HTTPS when available.
5. Set the repository Actions variable **PUBLISH_SITE** to `true` only after the domain and DNS are ready. Push to `main` or manually run **Check and deploy Math Videos**. Publishing requires this explicit switch, and the deployment job verifies that this repository’s Pages custom domain is exactly `mathematics-videos.com`.

Without its own custom domain, a project site on this GitHub account inherits the personal site's domain and appears under a path. **That is not the intended address for this project.** The workflow deliberately skips publication until the domain is configured and the publishing switch is enabled. For GitHub Actions publishing, the custom domain must be set in repository Pages settings; the `CNAME` file alone does not configure it.

The deployable site is in `dist/`. It also works with another static hosting provider if desired. Video files remain on YouTube, so the site itself is small. GitHub Pages has [usage limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

See [docs/DOMAIN_SETUP.md](docs/DOMAIN_SETUP.md) for the exact DNS records to use after purchase.

## Content and organization

- `data/videos.json` — the single editable lesson catalog.
- `data/categories.json` — subject names, descriptions, symbols, and color choices.
- `assets/thumbnails/` — local copies of the original YouTube thumbnails.
- `assets/catalog.mjs` — shared filtering, URL state, and ordering logic.
- `assets/app.mjs` — library controls and accessible lesson dialog.
- `assets/styles.css` — responsive styles and design tokens.
- `assets/logo.svg` — editable vector logo and favicon.
- `assets/social.svg` — editable social graphic for future export to PNG.
- `index.html` — introduction, about copy, subject cards, and lesson counts.
- `library.html` — searchable library.
- `docs/catalog-audit.json` — per-video review evidence and corrections.
- `docs/CONTENT_REVIEW.md` — review scope and remaining uncertainty.

The 81 whiteboard recordings appear before the 269 pencil-and-paper recordings **inside each subject**. Topics with clear prerequisites use a subject-specific progression; recordings within each topic are ordered naturally by title (part 2 before part 10). Search and filters preserve this priority. The library progressively reveals results without hiding the remaining count. Specific lessons and filtered views have shareable URLs.

### Add or edit a lesson

Each video has this shape:

```json
{
  "id": "LZ5p7HOCQMg",
  "title": "The Cross Product part 1",
  "originalTitle": "The Cross Product part 1",
  "category": "vectors",
  "topic": "Cross Product",
  "format": "whiteboard",
  "sourceOrder": 1,
  "tags": [],
  "reviewStatus": "reviewed"
}
```

Use a valid category ID from `data/categories.json`. Use `whiteboard` or `paper` for the recording format. Keep the original YouTube title for provenance and search. Add its thumbnail as `assets/thumbnails/VIDEO_ID.jpg`, and record the review in `docs/catalog-audit.json`. Update static homepage counts and run the checks. Do not guess an unclear subject: mark `reviewStatus` as `subject-uncertain` and temporarily place it in an appropriately named review category until it can be resolved.

### Rename the site

Change the name and metadata in `index.html`, `library.html`, and `404.html`, along with the document titles in `assets/app.mjs`. The colors live at the top of `assets/styles.css`. Logo artwork is plain SVG.

## Privacy, accessibility, and playback

Browsing the catalog loads local images, with no analytics or third-party fonts. YouTube is contacted when a visitor opens a lesson; the player uses `youtube-nocookie.com`. Playback remains subject to YouTube's availability, embedding settings, and policies. A direct YouTube link is always available in the lesson dialog.

The site includes semantic navigation, a skip link, labeled filters, keyboard focus styles, live result counts, reduced-motion support, and a native modal dialog. Escape closes playback and removes the iframe. Captions, if available, are provided by the original YouTube player; this project does not add captions or claim every recording is captioned.

## Source and ownership

The imported catalog comes from the public personal-site repository at commit `f80548a53895450e6fecbf61b468ced236fad5ac`. All 350 math videos returned public embed metadata identifying the channel as **Math Videos** (`@mathvideos6394`) on November 1, 2026. Four pages of uploads metadata were read in full. An additional old offline stream placeholder was excluded after Benjamin confirmed there is no livestream. The sanitized full channel snapshot is in `docs/channel-uploads.json`. See the audit for the exact review scope. The site retains Benjamin's videos and original thumbnail imagery; it does not download or redistribute the video files.
