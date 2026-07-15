 Add the section files
 Copy the files to your theme:
 sections/
  └── cinematic-scroll-hero.liquid
assets/
  ├── cinematic-scroll-hero.css
  └── cinematic-scroll-hero.js
  Add to your homepage
  In your templates/index.json, add the section:
  {
  "sections": {
    "cinematic-hero": {
      "type": "cinematic-scroll-hero",
      "settings": {
        "heading": "Your Heading Here",
        "subheading": "Your subheading text"
      }
    }
  },
  "order": ["cinematic-hero"]
}
 Customize in Theme Editor
Open the Theme Editor and customize:

Add your images (recommended 4 images)
Set animation preferences
Adjust colors and layout
Configure content alignment
🎨 Theme Editor Settings
Content
Heading, subheading, and rich text
Primary and secondary CTAs
Images
Up to 4 images with individual positions
Responsive image settings
Lazy loading options
Appearance
Background and text colors
Gradient overlay
Border radius, opacity
Layout
Desktop and mobile spacing
Section height, max width
Content alignment (9 positions)
Animation
Enable/disable animations
Scroll speed control
Floating animation
Rotation, parallax intensity
Layer spread, blur effects
Cards
Optional product cards
Collection shortcuts
🏗️ Architecture
 copy
cinematic-scroll-hero/
├── sections/
│   └── cinematic-scroll-hero.liquid  — Liquid + HTML + Schema
├── assets/
│   ├── cinematic-scroll-hero.css     — All CSS styles
│   └── cinematic-scroll-hero.js      — GSAP animations
├── docs/
│   ├── INSTALLATION.md               — Detailed installation guide
│   └── CUSTOMIZATION.md              — Customization documentation
├── screenshots/                      — Preview images
└── README.md                         — This file
🎯 Performance
Lazy loading for off-screen images
Responsive image sizes with srcset
Minimal DOM manipulation
requestAnimationFrame for smooth animations
Efficient CSS with custom properties
Scroll-driven animations with GSAP ScrollTrigger
♿ Accessibility
Semantic HTML structure
Proper heading hierarchy (h1 → h2)
ARIA labels and roles
Keyboard accessible controls
Visible focus indicators
Screen reader compatible
Reduced motion support
🔧 Browser Support
| Browser | Version | |---------|---------| | Chrome | 90+ | | Firefox | 88+ | | Safari | 14+ | | Edge | 90+ |

📄 License
MIT © [Contributors]

🤝 Contributing
Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

🙏 Acknowledgments
GSAP — Animation library
Shopify — E-commerce platform
All open-source contributors
Made with ❤️ for the Shopify community

 copy

---

## 5. docs/INSTALLATION.md

```markdown
# Installation Guide

Detailed instructions for installing the Cinematic Scroll Hero in your Shopify theme.

## Prerequisites

Before installing, ensure:

1. You have access to your Shopify theme files
2. Your theme supports Online Store 2.0 sections
3. You can edit theme code (liquid, CSS, JavaScript)

## Step-by-Step Installation

### Step 1: Add GSAP Dependencies

Add GSAP to your theme by editing `layout/theme.liquid`:

**Option A: CDN (Recommended)**

```liquid
<!DOCTYPE html>
<html>
  <head>
    <!-- ... existing head content ... -->
    
    <!-- GSAP Core -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
    <!-- GSAP ScrollTrigger Plugin -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
    
    {{ content_for_header }}
  </head>
  <body>
    <!-- ... body content ... -->
  </body>
</html>
