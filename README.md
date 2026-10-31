<p align="center">
  <img src="./public/favicon.svg" alt="" width="72" height="72" />
</p>

<h1 align="center">💫 Stellarmelt</h1>

<p align="center">
  The official website of <strong>Stellarmelt</strong>, a cosmic rock band.<br />
  A night-sky stage with a glossy 3D planet, poster type and stardust transitions.
</p>

<p align="center">
  <a href="https://stellarmelt.vercel.app"><strong>stellarmelt.vercel.app</strong></a>
</p>

<p align="center">
  <img src="./docs/screenshots/home-desktop.webp" alt="The Stellarmelt home page: the huge STELLAR MELT wordmark and the vertical katakana ステラメルト beside a glossy pink planet with a dotted orbit and a small moon" width="100%" />
</p>

---

## 🎼 What it is

Stellarmelt is a fictional band, but its songs are real. They're made with [Suno](https://suno.com), with lyrics by Orion. This site is the band's home. Today it introduces the band and its six members, its first milestone and its album; the songs and the links to follow the band come with the fuller sections.

It's also a front-end project that's being redesigned in the open. The original single-page site was split into components, refactored, and is now being rebuilt one section at a time, with custom SVG and three.js art in place of images.

## 🌌 A look around

The home page is a stage: one section fills the screen at a time, and the planet flies to a new framing for each one.

<p align="center">
  <img src="./docs/screenshots/about-desktop.webp" alt="The About section: the six members as small moons on a dotted orbit around a huge planet, with Tora at the front beside her note" width="49%" />
  <img src="./docs/screenshots/timeline-desktop.webp" alt="The Timeline section: the first event, Stellarmelt is born, under a distant planet" width="49%" />
</p>
<p align="center">
  <img src="./docs/screenshots/discography-desktop.webp" alt="The Discography section: the album Snow and the AI Mind above a planet rising from the bottom of the screen" width="49%" />
  <img src="./docs/screenshots/contact-desktop.webp" alt="The Contact section: Follow Stellarmelt across the cosmos, above a setting planet" width="49%" />
</p>
<p align="center">
  <img src="./docs/screenshots/home-phone.webp" alt="The home page on a phone: the planet on top, the wordmark and buttons below" width="280" />
</p>

## ✨ Features

- **A home stage.** Home, About, Timeline, Discography and Contact each fill the viewport. One step of the mouse wheel, an arrow or Page key, or a swipe moves to the next section (a section taller than the screen scrolls to its edge first), and a dot or a link like `#about` jumps straight to its section. Each step dissolves the words into stardust while the next ones condense out of a haze.
- **The planet.** A glossy shader planet in three.js with a dotted orbit, a moon, a halftone dot field and stars. It loads after the first paint, pauses on hidden tabs and slows itself down on weak graphics cards. Without WebGL, a CSS version of the planet holds the same pose.
- **The band as moons.** In About, the six members are moons on the planet's orbit. Picking one, with a click or the arrow keys, turns the orbit until that moon rests at the front, beside the member's story.
- **No raster images.** Everything on the site is SVG, CSS or three.js, including the constellation-heart logo in the navbar and the little-planet favicon.
- **Poster type.** Syne, Instrument Sans and Martian Mono, plus the band's name in katakana, ステラメルト, set in Dela Gothic One.
- **Glowing dot navigation.** One dot per section on the right edge, with the section's name on hover and focus.
- **Accessible.** A skip link, a visible focus ring, and keyboard steps that move focus to the new section's heading. With reduced motion turned on in the system settings, the stage swaps sections without the flight and the stardust, and the planet stays still.

## 🔭 Coming next

- Fuller Timeline, Discography and Contact sections: the songs and links to follow the band.
- A full Discography page and a Listening Room with a song visualizer.
- A player that keeps playing while you browse, if the official embeds allow it.
- Maybe pages for single songs.

## 🛠️ Tech stack

- **React 19** and **TypeScript 6**, built with **Vite 8**
- **Tailwind CSS 4** through `@tailwindcss/vite` (the theme lives in `src/index.css`)
- **Motion** for the stage's transitions
- **three.js** with **React Three Fiber** for the planet
- Self-hosted fonts from **Fontsource**
- **ESLint 10**, and deployment on **Vercel**

## 🚀 Run locally

> **You need:** Node 24 or 26, and npm.

```bash
git clone https://github.com/JStanoeva/stellarmelt.git
cd stellarmelt
npm ci
npm run dev
```

Then open http://localhost:5173.

| Command | What it does |
|---|---|
| `npm run dev` | Starts the dev server |
| `npm run build` | Type-checks and builds the site into `dist/` |
| `npm run lint` | Runs ESLint |
| `npm run preview` | Serves the built site locally |

## 🗂️ Project structure

```text
src/
  art/          the three.js planet scene and its CSS fallback
  components/   the navbar, the logo, the dot nav, the skip link and the footer
  content/      the site's copy as typed data
  hooks/        the home stage, the motion preference, page visibility, the tall-screen check
  lib/          small helpers (dates, Motion features)
  sections/     the home stage and its five sections
  index.css     the theme: colours, fonts, easings
public/
  favicon.svg   the little-planet favicon
docs/
  screenshots/  the images in this README
```

## ✏️ Editing the copy

Most of the site's copy lives in `src/content/` as data: the home sections' text in `homeSections.ts`, the timeline in `timeline.ts` (the home page shows its first event) and the album in `albums.ts`. `types.ts` describes the album and timeline shapes, and those files are checked against it with `satisfies`, so TypeScript points out anything that no longer fits. A few strings still sit in their components: the Timeline heading, the footer and the skip link.

## 💖 Credits

- **Songs:** made with Suno, lyrics by Orion.
- **Website:** designed and built by Tora Blaze ([JStanoeva](https://github.com/JStanoeva)).

## 📜 License

- Code: [MIT License](./LICENSE) - feel free to use, modify, and share.
- Brand & media: "Stellarmelt" name, logo, and any custom images/artwork are Copyright 2025 Tora Blaze. Please don't reuse brand assets without permission.
