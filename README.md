# Sawariya Seth Tiffin Service

A responsive multi-page website for Sawariya Seth Tiffin Service, built from the supplied Axis brief. The brief only provided the service name, so the site does not claim a real menu, price, contact address, delivery area, or ordering policy. The illustrated meal and menu builder are clearly labelled as examples. The inquiry form prepares a note locally and copies it to the clipboard; it does not send a message.

## Pages

- `/` — Introduction, example meal, and ways to get started
- `/menu` — Illustrative meal builder that carries selections into an enquiry
- `/how-it-works` — Questions to confirm before placing an order
- `/about` — Brand approach
- `/faq` — Menu, service area, pricing, and dietary questions
- `/contact` — Local enquiry note preparation
- Unknown paths — Not-found page

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create and preview a production build:

```bash
npm run build
npm run preview
```

## Deploy to Vercel

Import this GitHub repository in Vercel. The Vercel configuration in this project uses `npm run build` and publishes `dist`. Keep the Vercel Root Directory set to the folder containing this `package.json` (the repository root when this folder is its own repository). The SPA rewrite keeps pages such as `/menu` and `/faq` working when opened directly or refreshed.
