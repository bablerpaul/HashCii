<div align="center">

# ⛓️ HashCii

**Zero-trust, client-side cryptographic toolkit**

[![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS_3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)

All cryptographic operations execute **exclusively in the browser**. Zero network calls. Zero telemetry. Zero server-side processing.

[Features](#features) · [Architecture](#architecture) · [Getting Started](#getting-started) · [Security](#security-model) · [Stack](#tech-stack)

</div>

---

## Features

| Module | Description | Algorithms / Modes |
|--------|-------------|-------------------|
| **Hash Generator** | Text & file hashing with drag-drop | MD5 · SHA-1 · SHA-224/256/384/512 · SHA3-256/512 · RIPEMD-160 |
| **HMAC** | Keyed-hash message authentication codes | HmacMD5 · HmacSHA1/224/256/384/512 · HmacSHA3 · HmacRIPEMD160 |
| **Compare** | Constant-visual hash comparison | Case-insensitive match with animated diff |
| **Integrity Verify** | File checksum verification against known hashes | All 9 algorithms × file drag-drop |
| **Encode / Decode** | Bidirectional encoding transforms | Base64 · Hex · URL |
| **Password Lab** | Strength analysis + secure generation | `crypto.getRandomValues()` with rejection sampling (no modulo bias) |
| **Utilities** | UUID v4 generator + text statistics | CSPRNG-backed UUID, char/word/line/byte counts |
| **Batch Processing** | Multi-file simultaneous hashing | Parallel per-file results with bulk copy |
| **Hash Identifier** | Algorithm detection by hash length | 6 pattern families (32/40/56/64/96/128 chars) |

---

## Architecture

```
hashcii/
├── index.html               # Vite entry — CSP + security meta headers
├── vite.config.js            # Build config (esbuild minification)
├── tailwind.config.js        # Custom design system tokens
├── postcss.config.js         # PostCSS pipeline
├── launcher.py               # Localhost-only server with security headers
├── start.bat / start.sh      # OS-native launchers
├── src/
│   ├── main.jsx              # React 18 entry (StrictMode)
│   ├── App.jsx               # Root router + keyboard shortcut system
│   ├── index.css             # Tailwind directives + glassmorphism layers
│   ├── components/
│   │   ├── Hero.jsx          # Landing page (Framer Motion spring physics)
│   │   ├── Nav.jsx           # Animated navbar with layoutId tab indicator
│   │   ├── ChooseDashboard.jsx # Tool selector grid with staggered entry
│   │   ├── Toast.jsx         # Notification system (auto-dismiss)
│   │   ├── Icon.jsx          # 20+ SVG icon paths
│   │   └── Shared.jsx        # Card, FileDropzone, ErrorBanner, Spinner
│   ├── tabs/
│   │   ├── GeneratorTab.jsx  # Hash generation
│   │   ├── HMACTab.jsx       # HMAC computation
│   │   ├── CompareTab.jsx    # Hash comparison
│   │   ├── IntegrityTab.jsx  # File verification
│   │   ├── EncodeTab.jsx     # Encoding/decoding
│   │   ├── PasswordTab.jsx   # Password analysis + generation
│   │   ├── ToolsTab.jsx      # UUID + text statistics
│   │   ├── BatchTab.jsx      # Multi-file processing
│   │   └── IdentifyTab.jsx   # Hash type identification
│   └── utils/
│       ├── constants.js      # Algorithm definitions, patterns, limits
│       └── crypto.js         # All crypto + validation + sanitization logic
└── dist/                     # Production build output
```

### Data Flow

```
User Input → Validation → CryptoJS (in-browser) → Rendered Output
     ↓                                                    ↓
  FileReader API                                   Clipboard API
  (ArrayBuffer)                                    (secure context)
```

**No data leaves the browser.** There are no `fetch()`, `XMLHttpRequest`, `WebSocket`, `navigator.sendBeacon()`, or any network API calls in the codebase.

---

## Getting Started

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | ≥ 20.x | Build toolchain |
| npm | ≥ 10.x | Package management |
| Python | ≥ 3.10 | Production launcher (optional) |

### Development

```bash
# Install dependencies
npm install

# Start dev server (HMR enabled)
npm run dev
# → http://127.0.0.1:5173

# Production build
npm run build
# → dist/
```

### Production (localhost)

```bash
# Windows
start.bat

# macOS / Linux
chmod +x start.sh && ./start.sh

# Direct Python launch
python launcher.py --port 8080 --browser chrome
python launcher.py --no-open     # server only, no browser
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1` – `9` | Jump to tool tab |
| `Esc` | Return to dashboard |

---

## Security Model

### Threat Model

HashCii operates as a **zero-trust, air-gapped client application**. The security model assumes:

- All computation is local — no backend, no API, no cloud
- The only network requests are font loading (Google Fonts via CSP-whitelisted origin)
- The localhost server binds exclusively to `127.0.0.1` — no LAN/WAN exposure

### Implemented Controls

#### Content Security Policy (CSP)

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src https://fonts.gstatic.com;
img-src 'self' data:;
connect-src 'none';
frame-src 'none';
object-src 'none';
base-uri 'self';
form-action 'none';
```

#### HTTP Security Headers (launcher.py)

| Header | Value |
|--------|-------|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `no-referrer` |
| `Cache-Control` | `no-store, no-cache, must-revalidate` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` |
| `X-Permitted-Cross-Domain-Policies` | `none` |

#### Input Validation & Sanitization

| Control | Implementation |
|---------|---------------|
| Text input limit | 1,000,000 characters (`MAX_TEXT_LENGTH`) |
| File size limit | 500 MB (`MAX_FILE_SIZE`) |
| Hash input limit | 256 characters (Compare / Identify tabs) |
| HTML entity escaping | `& < > " '` → entity-encoded via `sanitize()` |
| Clipboard | `navigator.clipboard` with `execCommand` fallback |

#### Cryptographic Security

| Feature | Implementation |
|---------|---------------|
| UUID v4 | `crypto.getRandomValues()` — CSPRNG, not `Math.random()` |
| Password generation | Rejection sampling to eliminate modulo bias |
| Hash computation | CryptoJS 4.2.0 (deterministic, no network) |
| HMAC | CryptoJS HMAC with secret key isolation |

### Audit Results

| Check | Status |
|-------|--------|
| `eval()` / `innerHTML` / dynamic code execution | ✅ Not found |
| Hardcoded secrets / API keys / tokens | ✅ Not found |
| `fetch()` / `XMLHttpRequest` / `WebSocket` | ✅ Not found |
| `Math.random()` in security contexts | ✅ Eliminated |
| Modulo bias in random generation | ✅ Fixed (rejection sampling) |
| XSS via unsanitized rendering | ✅ All user input sanitized |
| Supply chain (CDN scripts) | ✅ Eliminated (npm + bundled) |
| In-browser Babel transpilation | ✅ Eliminated (Vite precompilation) |

### Residual Risk Register

| Risk | Severity | Mitigation |
|------|----------|------------|
| npm dependency supply chain | Medium | Lock file present, audit regularly |
| Google Fonts external load | Low | Whitelisted via CSP, font-display swap |
| No SRI on Google Fonts | Low | Consider self-hosting fonts for airgap |
| No automated SAST/SCA pipeline | Medium | Manual audit completed; CI recommended |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Build** | Vite 5 | ES module bundler, HMR, esbuild minification |
| **UI** | React 18 | Component architecture, StrictMode |
| **Styling** | Tailwind CSS 3 | Utility-first CSS, custom design tokens |
| **Animation** | Framer Motion | Spring physics, `layoutId`, `AnimatePresence` |
| **Crypto** | CryptoJS 4.2.0 | Hash / HMAC / encoding operations |
| **Fonts** | Space Grotesk / Syne / JetBrains Mono | Body / Display / Monospace |
| **Server** | Python `http.server` | Localhost-only with security headers |

### Design System

- **Theme**: Dark mode with glassmorphism, mesh gradients, noise texture overlay
- **Colors**: Custom `surface` (zinc-based), `accent` (indigo), `neon` palette
- **Animations**: 6 custom keyframes — `gradient`, `float`, `glowPulse`, `slideUp`, `morph`, `shimmer`
- **Components**: Spring-physics page transitions, staggered grid entries, sliding tab indicator

### Build Output

```
dist/index.html          ~1.2 KB
dist/assets/index.css    ~30 KB  (6 KB gzipped)
dist/assets/index.js    ~437 KB  (142 KB gzipped)
```

---

## License

ISC
