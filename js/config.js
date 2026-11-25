/**
 * Portfolio Configuration File
 * ----------------------------
 * Change any values here to customize this website for your own portfolio!
 */

export const siteConfig = {
  // Personal & Header Information
  profile: {
    name: "Ksen Panchenko",
    role: "UX/UI & Product Designer",
    location: "Dublin, Ireland",
    timeZone: "Europe/Dublin",
    statusText: "Available for projects",
    email: "uxsalman@gmail.com",
    avatar: "/images/home/avatar.webp",
    cutout: "/images/kseniia-cutout.webp",
    headline: {
      displayWord: "Design",
      italicWords: "that clicks"
    },
    tagline: "I value design that disappears — clear enough that no one notices the interface, honest enough to earn trust, simple enough that complex things just click."
  },

  // Highlight Facts (Top Grid)
  facts: [
    {
      label: "Role",
      value: "Product Designer\nB2B SaaS · Enterprise UX"
    },
    {
      label: "Services",
      value: "Product Design\nUX Research & Strategy\nUI & Interaction Design\nPrototyping & Design Systems"
    },
    {
      label: "Focus",
      value: "Complex Workflows\nData-rich Interfaces\nAI-powered Experiences"
    },
    {
      label: "Based in",
      value: "Greater Noida\nUttar Pradesh, India"
    }
  ],

  // Selected Work / Case Studies
  cases: [
    {
      id: "skybiz",
      num: "01",
      title: "SkyBiz",
      category: "FinTech · Brand book · Website",
      tools: "Figma · Illustrator · Photoshop",
      desc: "Online business services for small businesses, freelancers and startups in the USA — making numbers feel light.",
      bg: "linear-gradient(180deg, #75c2ec 0%, #b9e3f9 100%)",
      type: "video",
      video: {
        webm: "/images/cases/skybiz/site.webm",
        mp4: "/images/cases/skybiz/site.mp4",
        poster: "/images/cases/skybiz/site-poster.webp"
      },
      link: "/work/skybiz"
    },
    {
      id: "emerald24",
      num: "02",
      title: "Emerald24",
      category: "FinTech · Website · Gold",
      tools: "Figma · Jira · ChatGPT · Spline",
      desc: "A companion bank website for business and private clients — solid as a stone, smart as a gem.",
      bg: "radial-gradient(120% 90% at 50% 100%, #0f7d5d 0%, #056950 45%, #014132 100%)",
      type: "video",
      video: {
        webm: "/images/cases/emerald24/site-v1.webm",
        mp4: "/images/cases/emerald24/site-v1.mp4",
        poster: "/images/cases/emerald24/site-v1-poster.webp"
      },
      link: "/work/emerald24"
    },
    {
      id: "intxpay",
      num: "03",
      title: "IntXPay",
      category: "FinTech · Payments · Brand identity",
      tools: "Figma · Illustrator · Photoshop · Claude",
      desc: "A fintech platform for businesses worldwide — global payments, crypto trading and financial solutions, all in one place.",
      bg: "#e9ecec",
      type: "slides",
      slides: [
        "/images/cases/intxpay/shot-05.webp",
        "/images/cases/intxpay/shot-06.webp",
        "/images/cases/intxpay/shot-07.webp"
      ],
      link: "/work/intxpay"
    },
    {
      id: "trulia",
      num: "04",
      title: "Trulia",
      category: "Real estate · Mobile app",
      tools: "Figma · Miro",
      desc: "A UX/UI concept for the Trulia real estate app — discover a home and a neighbourhood you’ll love to live in.",
      bg: "linear-gradient(180deg, #01adbc 0%, #0196a3 100%)",
      type: "interactive-phones",
      cover: "/images/cases/trulia/cover.webp",
      tabs: [
        {
          label: "Listing · Layout & Documents",
          screens: [
            {
              src: "/images/cases/trulia/live/listing.webp",
              top: "/images/cases/trulia/live/listing-top.webp",
              solid: "/images/cases/trulia/live/floor-top.webp",
              bar: "/images/cases/trulia/live/bar.webp"
            },
            {
              src: "/images/cases/trulia/live/docs.webp",
              top: "/images/cases/trulia/live/docs-top.webp",
              bar: "/images/cases/trulia/live/bar.webp"
            }
          ]
        },
        {
          label: "Mortgage · Payment & Affordability",
          screens: [
            {
              src: "/images/cases/trulia/live/mort1.webp",
              top: "/images/cases/trulia/live/mort1-top.webp"
            },
            {
              src: "/images/cases/trulia/live/mort2.webp",
              top: "/images/cases/trulia/live/mort2-top.webp"
            }
          ]
        }
      ],
      link: "/work/trulia"
    }
  ],

  // Services
  services: [
    {
      num: "01",
      title: "Product & UX",
      desc: "Research-led flows that make complex products feel simple.",
      items: [
        "User research",
        "Usability testing",
        "Journey mapping",
        "Information architecture",
        "Wireframes & prototypes",
        "Product UI"
      ]
    },
    {
      num: "02",
      title: "Web & Systems",
      desc: "Responsive sites and design systems engineered for scale.",
      items: [
        "Responsive websites",
        "Mobile app UI",
        "Dashboards & portals",
        "Design systems & tokens",
        "Component libraries",
        "Developer handoff & QA"
      ]
    },
    {
      num: "03",
      title: "Turnkey websites",
      desc: "Design and code delivered together — from concept to live site.",
      items: [
        "Creative direction",
        "Information architecture",
        "UI & micro-interactions",
        "Modern web development",
        "SEO & performance",
        "Ongoing support"
      ]
    },
    {
      num: "04",
      title: "Social & Content",
      desc: "Eye-catching visuals and templates that build brand presence.",
      items: [
        "Visual content strategy",
        "Social media templates",
        "Motion & video assets",
        "Presentation decks",
        "Marketing collaterals",
        "Brand assets"
      ]
    }
  ],

  // Awards & Recognition
  awards: [
    {
      title: "London Design Awards 2026 — Gold",
      project: "Emerald24",
      category: "UI Design: Web Applications / Services"
    },
    {
      title: "CSS Design Awards",
      project: "Portfolio",
      category: "Best UI Design · Best UX Design · Best Innovation"
    },
    {
      title: "CSS Design Awards",
      project: "Portfolio",
      category: "Special Kudos"
    },
    {
      title: "Awwwards",
      project: "Portfolio",
      category: "Nominee"
    }
  ],

  // Social Links
  socials: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/kseniia-panchenko-52a89814b/" },
    { label: "Behance", url: "https://www.behance.net/panchenkokseniia" }
  ]
};
