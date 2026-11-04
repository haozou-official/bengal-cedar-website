# BENGAL · CEDAR — Research Website v2

A two-level static research website built from the reviewed v1.1 prototype.

## Pages

- **`index.html`** — Research home: four accordion research directions; selected EMNLP publications; Columbia / Illinois / NYU institutions; entrance to the demonstration.
- **`demo.html`** — Visual Living Report walkthrough, with an optional 7-step guided tour and freely usable screenshot controls.

No server-side code, model endpoints, databases or API keys. All demonstrations use real screenshots provided by the team, not live inference or generated replacement UI imagery.

## Preview locally

```bash
cd bengal_cedar_v2
python3 -m http.server 4173
```

Open **http://localhost:4173/**. Open **http://localhost:4173/demo.html** for the walkthrough.

### Tour controls

- **Start guided tour** opens a seven-step spotlight tour; it does not begin automatically.
- **Next / Back / Skip**, keyboard **→ / ← / Esc**, and **View full screenshot** are available in the tour.
- **Explore freely** skips guided mode. The same report timeline, assistant tabs and screenshot zoom remain accessible.
- **Restart tour** is available after completing or skipping it. On narrow screens, the explanation becomes a compact bottom sheet.

### Report screenshots

The five team-provided captures in `assets/screenshots/hormuz_t0.webp` through `hormuz_t4.webp` correspond to March 5, 6, 10, 19 and 29, 2026. The image changes when the user selects a checkpoint.

### Publication links

- [Detect, Remask, Repair — EMNLP 2026](https://arxiv.org/abs/2606.12807)
- [MemGuard — EMNLP 2026](https://arxiv.org/abs/2605.28009)

No speculative publications are attributed to the other two directions.

## Publish later on GitHub Pages

Once the team has reviewed the content and screenshot/logo permissions, create a **public** GitHub repository and upload the **contents of this folder** (not the enclosing folder). In **Settings → Pages**, choose **Deploy from a branch → main → /(root)**. The site uses relative paths so it works under `https://<username>.github.io/<repository>/`.

**Do not publish without review.** The HTML currently includes `noindex, nofollow` for internal-preview intent; remove that meta tag on publication if search indexing is desired.

## Important scope / review items

- The official program is **IARPA BENGAL**; the three-institution research team is **CEDAR**. Header reads **BENGAL · CEDAR**. The captured UI screenshots still reflect the previous BENGAL-only branding and can be replaced after the separate Seahorse UI rebranding.
- Question answering about Japan's energy response is part of the **Iran / Strait of Hormuz** situation, not a separate unrelated example. The multilingual **Ceuta** example is a different scenario.
- Some visual evidence is candidate or historical context; image relevance must not be equated with factual verification.
- Broader CEDAR research is distinct from the demonstrated features; this website does not present unreleased multimodal inference planning as implemented in the demo.
- External news images, institutional logos, IARPA artwork and screenshots require project review before public release. This site is not an official US Government website.
- **Nothing has been deployed to GitHub or Sephorse.** This ZIP is the local static site.

## Files

`index.html`, `demo.html`, `styles.css` (original v1 base), `v2.css` (research + tour styling), `script.js` (free exploration), `home.js` (research accordions), `tour.js` (guided tour), and `assets/`.
