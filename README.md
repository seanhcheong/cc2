# Card Fit Studio assets

This repository now ships the cinematic dashboard inside [`card-fit-studio/`](card-fit-studio/). Running a static server from the repo root keeps the existing landing page untouched while letting you browse the full experience at `/card-fit-studio/`—a structure that sidesteps merge conflicts with any in-progress marketing site.

## Quick start
1. Start a static server from the repo root (e.g. `python -m http.server 8000`).
2. Visit `http://localhost:8000/card-fit-studio/` for the fully interactive dashboard, or open the root `index.html` if you just need the redirect panel.
3. Copy the entire folder elsewhere when embedding the dashboard in another project.

All assets remain framework-free HTML/CSS/JS and rely on CDN builds of Three.js, D3, and GSAP.
