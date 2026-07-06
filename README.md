# For Ruma 💌

A little scrolling "love letter" website: an envelope you tap to open, a
letter, a photo timeline of your story, a song, a video message, a
photo gallery, and a final question with a wax-seal "Yes" button.

It's built with plain HTML, CSS and JavaScript — no build tools, no
frameworks, nothing to install. Every piece of **text**, every
**photo**, the **song**, and the **video** are things you're meant to
replace with your own.

---

## 1. What's in this folder

```
proposal-website/
├── index.html              ← page structure (you shouldn't need to touch this)
├── manifest.json            ← optional: lets the page be "installed" like an app
├── service-worker.js        ← optional: lets it load offline after first visit
├── css/
│   └── style.css            ← all visual styling
├── js/
│   ├── config.js            ← ⭐ ALL YOUR TEXT AND CONTENT LIVES HERE
│   └── main.js               ← interactivity (envelope, player, confetti, etc.)
└── assets/
    ├── images/               ← placeholder photos — replace these
    ├── audio/                ← placeholder song — replace this
    ├── video/                ← placeholder video — replace this
    └── icons/                ← small app icons used by manifest.json
```

**You only need to edit `js/config.js` and swap files inside `assets/`.**
You do not need to touch `index.html`, `style.css`, or `main.js` unless
you want to change how something *behaves*, not just what it *says*.

---

## 2. Replacing the text

Open `js/config.js` in any text editor (Notepad, VS Code, even a phone
text-editor app). It's one big object with clearly labeled sections:

| Section | What it controls |
|---|---|
| `names` | Your name and Ruma's name |
| `envelope` | The "To / From" lines on the envelope, and the tap hint |
| `letter` | The greeting ("Dear Ruma,") and each paragraph of your letter |
| `sectionTitles` | The heading above each section |
| `memories` | Your "our story" timeline — one entry per photo + caption |
| `audio` | Title/subtitle shown next to the song player |
| `video` | Caption shown under your recorded video |
| `gallery` | Captions for the extra photo grid |
| `question` | The proposal question, button labels, and the teasing lines the "Not yet" button cycles through as it dodges |
| `celebration` | What shows up after she presses "Yes" |

Every value is plain text in quotes — change the words between the
quotes, save the file, and refresh the page. Don't remove the commas
between lines or the quote marks themselves.

To add or remove a memory/gallery photo, copy or delete one whole
`{ ... }` block inside the `memories` or `gallery` list.

---

## 3. Replacing the photos

Placeholder images live in `assets/images/` as simple colored `.svg`
placeholders so you can see where each photo goes before you add real
ones.

**To replace a photo:**
1. Put your photo file into `assets/images/` (JPG or PNG both work).
2. In `js/config.js`, update the matching `image:` path to your new
   filename — e.g. `"assets/images/memory-1.svg"` → `"assets/images/us-2022.jpg"`.

**Recommended sizes** (bigger is fine, the page scales them down):
- Timeline / gallery photos: roughly **1000×1200px** (portrait works best), under 1–2MB each.
- The video poster (`assets/images/video-poster.jpg`): should roughly match your video's aspect ratio — **1280×720px** for standard widescreen video.

Tip: if your phone photos are huge (4000px+ and several MB), resize
them first so the page loads quickly — any free image resizer or your
phone's "share → reduce size" option works fine.

---

## 4. Replacing the song

The placeholder at `assets/audio/our-song.mp3` is a short spoken clip
that just tells you it's a placeholder — swap it out.

1. Add your song file to `assets/audio/`, e.g. `assets/audio/our-song.mp3`
   (keep the `.mp3` format for the widest browser support).
2. In `js/config.js`, update `audio.src` to point to your file.
3. Update `audio.title` / `audio.subtitle` if you want.

Keep the file reasonably small (an MP3 at 128–192kbps is plenty) so
the page loads quickly, especially on mobile data.

> **Note on copyrighted music:** if you use a commercial song, keep the
> page private (send the link only to Ruma, don't post it publicly) —
> publicly hosting copyrighted music can run into licensing issues.

---

## 5. Replacing the video

The placeholder at `assets/video/message.mp4` is a 6-second clip that
just displays "replace me" text.

1. Add your video to `assets/video/`, e.g. `assets/video/message.mp4`
   (`.mp4` with H.264 encoding plays everywhere).
2. In `js/config.js`, update `video.src` to your filename.
3. Optionally replace `assets/images/video-poster.jpg` with a still
   frame from your video (this is the thumbnail shown before pressing play).

Keep videos under ~30–60 seconds and compress them if the file is very
large (100MB+) — most phones can trim/compress video before exporting,
or you can use a free tool like HandBrake.

---

## 6. Previewing it on your computer

You can just **double-click `index.html`** to open it in your browser —
everything (photos, audio, video) is designed to work this way.

If you notice the video or audio don't load when opened directly (some
browsers are stricter about local files), run a tiny local server
instead:

```bash
# from inside the proposal-website folder
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

or, if you have Node.js installed:

```bash
npx serve .
```

---

## 7. Sending it to Ruma / publishing it

**Easiest — send the folder directly:**
Zip the whole `proposal-website` folder and send it to her; she can
unzip it and double-click `index.html`.

**Nicer — host it online so she can just click a link:**

- **Netlify Drop** — go to [app.netlify.com/drop](https://app.netlify.com/drop),
  drag the whole `proposal-website` folder in, and you'll get a shareable link instantly. No account needed.
- **GitHub Pages** — push the folder to a GitHub repo, then enable
  Pages in the repo's Settings → Pages. Free, but a couple more steps.
- **Vercel** — similar to Netlify, works well if you already have an account.

If you host it publicly, keep in mind anyone with the link can view it
— there's no password protection built in.

---

## 8. Customizing the look (optional)

All colors, fonts, and spacing are defined as CSS variables at the top
of `css/style.css`:

```css
:root {
  --paper:        #f3e9d4;  /* background */
  --ink:          #2b241d;  /* main text color */
  --maroon:       #8b2635;  /* wax seal / accent color */
  --gold:         #b08d57;  /* small divider lines */
  --blush:        #c97b84;  /* washi tape accent */
}
```

Changing these values updates the whole site's palette consistently.
Fonts (Fraunces, Lora, Caveat) are loaded from Google Fonts in
`index.html`'s `<head>` — swap the `<link>` there and the `--font-*`
variables in `style.css` if you'd like different ones.

---

## 9. About the "Not yet" button

The `question.noTeasingLines` array in `config.js` controls what the
button says as it playfully dodges the cursor/tap each time. Add as
many or as few lines as you like — it cycles through them in order.

---

## 10. The offline/app bits (safe to ignore)

`manifest.json` and `service-worker.js` let the page be added to a
phone's home screen and reload without internet after the first
visit. They only activate when the site is served over `http`/`https`
(Netlify, GitHub Pages, etc.) — they have no effect when opened as a
local file, and you can delete both files plus the
`<link rel="manifest">` line in `index.html` if you don't want this.

---

Made with vanilla HTML, CSS, and JavaScript — no frameworks, nothing
to install, nothing to break. Good luck 🤍
