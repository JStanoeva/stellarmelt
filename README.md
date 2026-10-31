# 💫 Stellarmelt

A minimal, elegant, glassmorphism-themed landing page for the cosmic rock band **Stellarmelt**. It blends shimmering UI, soft gradients, and a starlit vibe with accessible, responsive React + TypeScript + Tailwind code.

**Live site:** https://stellarmelt.vercel.app

---

## 🎼 Purpose

Showcase Stellarmelt's story, music, and upcoming moments in one immersive page:

- a bold hero,
- a "Meet the Band" section,
- an interactive timeline with visuals,
- a discography with playable links,
- and quick links to platforms.

---

## ✨ Features

- **Glassmorphism aesthetic**  
  Soft frosted panels, subtle borders, and elegant depth using the palette `#dd819c`, `#a05987`, `#3b1f52`, `#1e142b`.

- **Animated cosmic backdrop**  
  A gradient that slowly shifts + a lightweight twinkling starfield.

- **Responsive header**  
  Fixed navigation, smooth scrolling, and a hamburger menu on small screens.

- **Hero with contained art**  
  Desktop-only hero image with a gentle glow and drop shadow; CTAs to About and Discography.

- **About (Meet the Band)**  
  Glassy member cards with scroll-reveal fade-in.

- **Timeline with visuals**  
  Two-column layout on large screens: events on the left, a sticky image panel on the right.

  - Cross-fade image per event on **hover/focus**.
  - **Auto-rotate every 5 seconds** (respects Reduced Motion and pauses on hover/focus).

- **Discography**  
  Album card + track cards with:

  - glassy note tile,
  - length pill,
  - "Play" buttons linking to Suno,
  - soft scroll-reveal animations.

- **Contact**  
  Minimal SVG icons (Spotify, YouTube, Tidal) - currently pointing to GitHub placeholders.

- **Accessibility touches**  
  Skip link, visible focus rings, ARIA labels, semantic landmarks, and Reduced Motion support.

- **Zero extra libs**  
  No framer-motion, no icon libraries - just React, TypeScript, and Tailwind.

---

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **Tailwind CSS**
- Build tooling: **Vite**.  
  Deployed on **Vercel**.

---

## 🚀 Run Locally

> **Prereqs:** Node 24 or 26 (LTS), and npm.

### 1) Clone & install

```bash
git clone https://github.com/JStanoeva/stellarmelt.git
cd stellarmelt
npm install
```

### 2) Start the dev server

```bash
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## 📜 License

- Code: [MIT License](./LICENSE) - feel free to use, modify, and share.
- Brand & media: "Stellarmelt" name, logo, and any custom images/artwork are Copyright 2025 Tora Blaze. Please don't reuse brand assets without permission.
