# Reticle MS — Fortune 500 Site Redesign

A rich, industrial, trust-forward single-page website for **reticlems.com**,
designed to Fortune 500 standards: dark gunmetal + brass palette, editorial
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
| Palette    | Deep charcoal `#0a0c0f` · gunmetal panels · brass `#c89b3c` → gold `#e7c167` |
| Type       | Fraunces (display serif) · Archivo (grotesk) · IBM Plex Mono (specs) |
| Motif      | The reticle: crosshair preloader, rotating watermarks, target-corner card hovers, crosshair cursor |
| Motion     | Preloader lock-on, staggered line-mask hero reveal, IntersectionObserver fade-ups, clip image reveals, counters, marquee, parallax band, magnetic buttons — all disabled under `prefers-reduced-motion` |

## Imagery

The original site (reticlems.com) was **unreachable from the build sandbox**
(network egress allowlist), so all six photos were **AI-generated to match the
brand** (FLUX.2 Max for the hero, Gemini 3 Pro for the rest) with one
consistent grade: low-key charcoal + amber/brass rim light.

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

## Form handling

The quote form composes a pre-filled email via `mailto:`. To capture leads
server-side instead, point the form at Formspree/Basin/GoDaddy forms and
remove the mailto handler at the bottom of `js/main.js`.

## Deploying

- **GitHub Pages**: Settings → Pages → deploy from branch, root folder.
- **GoDaddy / any host**: upload `index.html`, `css/`, `js/`, `assets/` as-is.
