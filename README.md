# Portfolio Website — Clean Modular Codebase

A clean, modular, and dependency-free recreation of the award-winning **ksenpanchenko.com** portfolio with all interactive effects, canvas particle physics, liquid switches, Web Audio sound synthesis, and micro-interactions.

---

## 🚀 Quick Start (Run Locally)

You can run the site immediately using Node.js without needing any extra installs or packages:

```bash
node server.js
```

Then open your browser at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🎨 How to Customize This For Your Own Portfolio

All content, texts, projects, services, and profile information have been decoupled into a single, clean configuration file:

### 1. Edit Your Profile & Content
Open **[`js/config.js`](file:///c:/Users/salman/Downloads/ksenpanchenko.com/js/config.js)** to edit:
* **`profile`**: Your name, job title, city, time zone, status ("Available for projects"), contact email, and avatar photo.
* **`facts`**: The highlight metrics and services displayed in the top fact banner.
* **`cases`**: Your featured projects (case study title, category, description, video/slide paths, and tools used).
* **`services`**: The 4 services you provide, descriptions, and feature bullet lists.
* **`awards`**: Any design, engineering, or career recognition awards.
* **`socials`**: Your LinkedIn, GitHub, Behance, X, or Dribbble profile links.

### 2. Replace Images & Media
* **Avatar & Profile Cutout**: Replace `images/home/avatar.webp` and `images/kseniia-cutout.webp` with your own photos.
* **Case Study Screenshots / Videos**: Put your project images or `.mp4` / `.webm` recordings inside `images/cases/`.

---

## 📂 Project Architecture

```
├── index.html                   # Clean semantic home page
├── about.html                   # Complete About page
├── about/
│   └── index.html               # Clean route /about/ compatibility
├── server.js                    # Zero-dependency local dev server
├── js/
│   ├── config.js                # ⭐️ Central portfolio configuration
│   ├── main.js                  # Application entry point
│   ├── effects/
│   │   ├── glyph-scatter.js     # Canvas ASCII particle scatter & wave shockwave engine
│   │   ├── liquid-toggle.js     # Gooey SVG filter physics switch (theme & sound)
│   │   ├── sound.js             # Web Audio API 2400Hz mechanical click synthesizer
│   │   ├── cursor.js            # Custom smooth cursor with decrypt letter scramble
│   │   └── magnetic.js          # Magnetic button attraction & typography roll-up
│   └── components/
│       ├── selected-work.js     # Sticky showcase, video sync & ASCII counter canvas
│       ├── services.js          # Interactive 3D sticker cards & Round 1/2 switch
│       ├── theme.js             # Dark / Light theme engine
│       └── clock.js             # Live time-zone clock formatter
├── css/
│   ├── base.css                 # CSS variables, typography, and dark theme
│   ├── components.css           # Cards, navigation, stickers, and awards
│   └── selected-work.css        # Showcase layout & screen frames
├── glyphs/                      # ASCII coordinate maps (branch.json, quote.json, portrait.json)
├── fonts/                       # Custom typography (.woff2)
├── images/                      # High-res graphics and case media
└── work/                        # In-depth case study subpages (emerald24.html)
```

---

## ⚡ Included Animations & Effects

1. **ASCII Glyph Canvas Scatter**: Responsive coordinate particle system with cursor repulsion, click shockwaves, and character cycling.
2. **Liquid Gooey Switches**: SVG filter-based smooth gooey toggles with inertia drag.
3. **Sound Synthesizer**: Procedural mechanical click generated with `AudioContext` and bandpass filtering (zero audio files needed).
4. **Selected Work Showcase**: Sticky scroll progression with animated ASCII digits counter (`01`, `02`, `03`, `04`) and synchronized mockups.
5. **Interactive 3D Stickers**: Mouse-tracking perspective tilt with bouncy spring recovery and stage switching.
6. **Custom Magnetic Cursor**: Smooth trailing cursor with letter decrypt scrambling ("View", "Next", "Look").
