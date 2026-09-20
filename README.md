# OVERLUKING

Life Outside.

A plain HTML, CSS and JavaScript website. No WordPress, no build tools.

## What is in the folder

- `index.html` is the homepage.
- `css/styles.css` holds all the colors, fonts and layout.
- `js/main.js` makes the menu, the Dawn/Day/Dusk buttons and the checklist work.
- `assets/img/` holds the placeholder pictures (drawn shapes, not photos).

## See it on your computer

1. Unzip the folder.
2. Double-click `index.html`.

It opens in your browser. You need internet for the fonts to show correctly.

## Put it on GitHub

1. Open github.com/Abdex-King/Overluking.
2. Click **Add file**, then **Upload files**.
3. Drag in everything from inside the unzipped folder (`index.html`, `css`, `js`, `assets`, `README.md`).
4. Click **Commit changes**.

## Replace a placeholder picture with a real photo

1. Save your photo as a `.jpg` in `assets/img/`, for example `hiking-lead.jpg`.
2. In `index.html`, find `hiking-lead.svg` and change it to `hiking-lead.jpg`.

Tip: keep photos under 300 KB so the site stays fast.

## Add an affiliate link

Every "Check price" and "Options" button has `href="#"` and a `data-slot` name.
Replace the `#` with your affiliate link. Keep `rel="sponsored noopener"` on it.

## Not finished yet

- Most links point to `#`. They show a "coming soon" note until you add real pages.
- The newsletter form is not connected to an email service. Put your form URL in `ENDPOINT` at the bottom of `js/main.js`.
- Add a Privacy page before you go live, especially once the newsletter works.
