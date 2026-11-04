# Quick visual QA — v2

## Research home
- [ ] Brand reads **BENGAL · CEDAR**, not BENGAL-only as the team name.
- [ ] Only four research headlines appear until one is clicked.
- [ ] Click row 01 → DRR EMNLP 2026 paper link; click row 03 → MemGuard EMNLP 2026 paper link.
- [ ] Clicking a different row closes the previous one.
- [ ] Explore Living Report leads to `demo.html`.
- [ ] Columbia, Illinois, NYU logos are visible and reasonably sized.

## Guided demo
- [ ] Start Guided Tour → `01 / 07` with dimmed backdrop, clear highlighted area and floating card.
- [ ] Next → `02 / 07`, T1 screenshot; Back → `01 / 07`.
- [ ] Steps 03–07 highlight article, Arabic, images, answer audit, and analyst-approved report update.
- [ ] View full screenshot opens the zoom dialog; Esc closes it; tour continues.
- [ ] Skip exits; Restart starts again; final Finish ends tour.
- [ ] Keyboard → / ← and Esc work while the tour is active.
- [ ] Explore Freely leaves all content clickable and tour off.
- [ ] Clicking five dates updates the screenshot itself, not only the description.
- [ ] Assistant Ask / Review / Remember / Incorporate tabs switch images.

## Mobile
- [ ] Research headlines wrap cleanly on 375px width, with no horizontal overflow.
- [ ] Tour card becomes a bottom sheet and important highlighted material remains legible.
- [ ] The Next/Back/Skip buttons fit and function.
- [ ] Screenshot zoom can be closed on mobile.

## Release checks
- [ ] Kathy approves research wording and team attribution.
- [ ] Screenshot rights, program illustration, institution logos and news imagery approved.
- [ ] Current demo header updated separately on Seahorse (do not modify running service as part of this ZIP).
- [ ] For public launch, review `noindex` meta tags, acknowledgements and publication links.

**Environment note:** Automated Chromium opening was blocked by an administrator policy in the build sandbox (including `localhost`, `file://`, and `data:` URLs). HTML markup, JS parsing, image paths and references have been checked; final browser visual/interaction verification is for the local reviewer.
