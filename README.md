# Reticle MS — Fortune 500 Site Redesign

A rich, industrial, trust-forward single-page website for **reticlems.com**,
designed to Fortune 500 standards: ink-navy + royal-cobalt + chrome palette
(drawn from the RMS chrome logo and brand blue), editorial
serif typography, an animated reticle/crosshair brand motif, scroll-triggered
reveals, animated counters, parallax, and a magnetic-button CTA system.

**Zero build step.** Open `index.html` in a browser — that's the site.

```
index.html                  # the whole page (semantic, SEO/OG-tagged)
css/style.css               # design system + animations
js/main.js                  # interaction engine (vanilla JS, no dependencies)
assets/download-images.sh   # pulls the AI imagery into the repo (see below)
```

## Design language

| Element    | Choice                                                        |
|------------|---------------------------------------------------------------|
| Palette    | Ink navy `#070b15` · gunmetal panels · royal cobalt `#4666ec` → `#8ca3ff` · chrome-silver gradient accents (from the RMS logo) |
| Type       | Fraunces (display serif) · Archivo (grotesk) · IBM Plex Mono (specs) |
| Motif      | The reticle: crosshair preloader, rotating watermarks, target-corner card hovers, crosshair cursor |
| Motion     | Preloader lock-on, staggered line-mask hero reveal, IntersectionObserver fade-ups, clip image reveals, counters, marquee, parallax band, magnetic buttons — all disabled under `prefers-reduced-motion` |

## Imagery

The original site (reticlems.com) was **unreachable from the build sandbox**
(network egress allowlist), so all six photos were **AI-generated to match the
brand** (FLUX.2 Max for the hero, Gemini 3 Pro for the rest) with one
consistent grade: low-key ink-blue + cobalt rim light with chrome-silver
highlights, matched to the RMS brand.

Images are currently **hot-linked** from the render CDN. To vendor them into
the repo (recommended before launch), run on any normally-connected machine:

```bash
bash assets/download-images.sh
```

This downloads all six into `assets/img/` and rewrites `index.html` to use
the local copies. Want different imagery later? Every URL lives in one
commented block at the top of `index.html`.

If an image ever fails to load, the site degrades gracefully — a styled
gunmetal/blueprint backdrop appears instead of a broken image.

## Content status

Services, capabilities lists, QMS/ITAR language, and positioning are now
sourced from the original reticlems.com (via screenshots): Reticle
Manufacturing Solutions, LLC — manufacturing capabilities, CNC programming
& setup, R&D/product development consulting, and systems & process design.
The quality section deliberately mirrors the original's honest framing:
QMS *modeled after* ISO 9001:2015/AS9100D (non-registered), ITAR registered.

Still **placeholder — verify before launch**:

- [ ] **Stats** (28+ years, 4,200+ projects, 99% on-time, 40+ materials)
- [ ] **Testimonials** — labeled "Sample of what partners say"; swap in real
      quotes (with permission) and update that heading
- [ ] **Contact info** — phone is a `555` placeholder; confirm hours and
      location (San Clemente assumed). Email is M.Fetter@ReticleMS.com
      (owner-provided).
- [ ] **CTA promises** ("quotes within one business day")

## Hero background video

`assets/video/hero-loop.mp4` (1600w, 1.3 MB) and `hero-loop-sm.mp4` (960w,
0.4 MB) are an 8-second loop of real CNC machining footage
([Pexels #5998850](https://www.pexels.com/video/5998850/), free for
commercial use, no attribution required), color-graded to the cobalt brand
and compressed with H.264 + faststart. The page paints instantly with the
still image; the video lazy-loads after `window.load` and fades in — and is
skipped entirely on small screens, `prefers-reduced-motion`, or data-saver.
To swap footage, edit the video id in `.github/workflows/fetch-video.yml`
and push — the workflow re-downloads, re-grades, and re-commits.

## Work gallery & inspection lightbox

"The Work" (#work) is a six-image gallery served as WebP (thumbs ~16–37 KB
lazy-loaded, full images ~80–210 KB loaded on click). Clicking a frame opens
the **inspection lightbox**: crosshair lock-on sweep, HUD readouts, live
metrology-style coordinates, and a 2.4× reticle loupe that follows the
cursor (touch: drag to inspect; keyboard: arrows/Escape; swipe to page).
Images are AI-generated representative shots — to swap in real portfolio
photos, replace the numbered files in `assets/gallery/` (or update the ids
in `.github/workflows/fetch-gallery.yml` and push to re-run the optimizer).

## Form handling

The quote form composes a pre-filled email via `mailto:`. To capture leads
server-side instead, point the form at Formspree/Basin/GoDaddy forms and
remove the mailto handler at the bottom of `js/main.js`.

## Deploying

- **GitHub Pages**: Settings → Pages → deploy from branch, root folder.
- **GoDaddy / any host**: upload `index.html`, `css/`, `js/`, `assets/` as-is.
