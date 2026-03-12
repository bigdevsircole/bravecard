# ✨ BraveCard — Digital Profile Creator

Create stunning digital profile cards with personalized QR codes. Connect your world — social media, contact info, and more — in one elegant scan.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwindcss)

---

## 🚀 Features

- **Profile Builder** — Add your name, occupation, bio, and profile picture
- **Social Media Links** — Connect WhatsApp, Instagram, Facebook, TikTok, Twitter, Telegram, and WeChat
- **5 Design Templates** — Minimalist Elegance, Modern Bold, Classic Professional, Creative Portfolio, and Social Connector
- **QR Code Generation** — Auto-generated QR codes linked to your profile for instant sharing
- **Download & Share** — Download QR codes as PNG or copy your profile link
- **Responsive Design** — Looks great on mobile, tablet, and desktop
- **Dark Mode UI** — Premium dark theme with gold accents

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 |
| **Language** | TypeScript 5.9 |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 3.4 |
| **UI Components** | shadcn/ui (40+ components) |
| **QR Codes** | qrcode.react |
| **Notifications** | Sonner |
| **Icons** | Lucide React |

---

## 📦 Getting Started

### Prerequisites

- **Node.js** 20 or higher
- **npm** (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/bravecard.git
cd bravecard

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## 📁 Project Structure

```
bravecard/
├── index.html              # HTML entry point
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS theme & plugins
├── postcss.config.js        # PostCSS configuration
├── package.json
├── src/
│   ├── main.tsx             # App entry point (renders React)
│   ├── App.tsx              # Main application component
│   ├── App.css              # App-specific styles & animations
│   ├── index.css            # Global styles, design tokens & utilities
│   ├── components/
│   │   └── ui/              # shadcn/ui component library (40+ components)
│   ├── hooks/
│   │   └── use-mobile.ts    # Mobile detection hook
│   └── lib/
│       └── utils.ts         # Utility functions (cn helper)
└── dist/                    # Production build output
```

---

## 🎨 Customization

### Design Templates

Templates are defined in `src/App.tsx` as the `designTemplates` array. Each template has:

```ts
{
  id: string;
  name: string;
  description: string;
  preview: string;       // Tailwind gradient classes
  colors: {
    bg: string;          // Background color
    accent: string;      // Accent color
    text: string;        // Text color
  }
}
```

### Social Platforms

Social platforms are configured in the `socialPlatforms` array in `src/App.tsx`. Add or remove platforms by editing this array.

### Theme Colors

The gold/dark color palette is defined in two places:

- **CSS variables** — `src/index.css` (`:root` block)
- **Tailwind config** — `tailwind.config.js` (`theme.extend.colors`)

---

## 📜 License

© 2026 BraveCard. All rights reserved.
