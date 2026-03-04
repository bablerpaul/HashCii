<div align="center">

# ⛓️ HashCii

**Zero-trust, client-side cryptographic toolkit**

[![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

All cryptographic operations run **100% in your browser**.  
No servers. No network calls. No telemetry. Your data never leaves your machine.

---

[Features](#-features) · [Requirements](#-requirements) · [Installation](#-installation) · [Usage](#-usage) · [Security](#-security) · [Tech Stack](#-tech-stack) · [License](#-license)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Requirements](#-requirements)
- [Installation](#-installation)
  - [Windows](#windows)
  - [macOS](#macos)
  - [Linux (Ubuntu/Debian)](#linux-ubuntudebian)
  - [Linux (Fedora/RHEL)](#linux-fedorarhel)
  - [Linux (Arch)](#linux-arch)
- [Usage](#-usage)
  - [Development Mode](#development-mode)
  - [Production Build](#production-build)
  - [Production Launcher](#production-launcher)
- [Project Structure](#-project-structure)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Security](#-security)
- [Tech Stack](#-tech-stack)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

| Tool | What It Does | Supported Algorithms |
|------|-------------|---------------------|
| **Hash Generator** | Hash text or files via drag-and-drop | MD5 · SHA-1 · SHA-224 · SHA-256 · SHA-384 · SHA-512 · SHA3-256 · SHA3-512 · RIPEMD-160 |
| **HMAC** | Generate keyed-hash message authentication codes | HMAC-MD5 · HMAC-SHA1/224/256/384/512 · HMAC-SHA3 · HMAC-RIPEMD160 |
| **Compare** | Side-by-side hash comparison | Case-insensitive match with visual diff |
| **Integrity Verify** | Verify a file's checksum against a known hash | All 9 algorithms with file drag-and-drop |
| **Encode / Decode** | Convert between encoding formats | Base64 · Hex · URL |
| **Password Lab** | Analyze password strength and generate secure passwords | CSPRNG with rejection sampling (no modulo bias) |
| **Utilities** | UUID v4 generator and text statistics | Cryptographically secure UUID, character/word/line/byte counts |
| **Batch Process** | Hash multiple files at once | All algorithms with bulk copy |
| **Identify Hash** | Detect which algorithm produced a hash | 6 pattern families (32 / 40 / 56 / 64 / 96 / 128 characters) |

---

## 📦 Requirements

| Tool | Required Version | What It's For |
|------|-----------------|---------------|
| **Node.js** | `>= 20.x` | JavaScript build toolchain |
| **npm** | `>= 10.x` | Package manager (comes with Node.js) |
| **Git** | `>= 2.x` | Cloning the repository |
| **Python** | `>= 3.10` *(optional)* | Running the production localhost launcher |

---

## 🚀 Installation

### Windows

#### 1. Install Node.js

Download and run the **Windows Installer (.msi)** from the official site:

👉 **https://nodejs.org/en/download** — choose the **LTS** version.

During installation, make sure **"Add to PATH"** is checked.

After installation, open **PowerShell** or **Command Prompt** and verify:

```powershell
node --version
npm --version
```

#### 2. Install Git

Download and run the installer from:

👉 **https://git-scm.com/download/win**

Use the default options. After installation, verify:

```powershell
git --version
```

#### 3. Install Python *(optional — only needed for the production launcher)*

Download from:

👉 **https://www.python.org/downloads/**

> ⚠️ During installation, **check "Add Python to PATH"** on the first screen.

Verify:

```powershell
python --version
```

#### 4. Clone and Install HashCii

```powershell
git clone https://github.com/bablerpaul/HashCii.git
cd HashCii
npm install
```

---

### macOS

#### 1. Install Homebrew *(if not already installed)*

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. Install Node.js and Git

```bash
brew install node git
```

Verify:

```bash
node --version
npm --version
git --version
```

#### 3. Install Python *(optional)*

macOS comes with Python 3 on recent versions. Check with:

```bash
python3 --version
```

If not present:

```bash
brew install python
```

#### 4. Clone and Install HashCii

```bash
git clone https://github.com/bablerpaul/HashCii.git
cd HashCii
npm install
```

---

### Linux (Ubuntu/Debian)

#### 1. Install Node.js (via NodeSource)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 2. Install Git

```bash
sudo apt-get install -y git
```

#### 3. Install Python *(optional)*

```bash
sudo apt-get install -y python3
```

#### 4. Verify

```bash
node --version    # Should print v20.x.x or higher
npm --version     # Should print 10.x.x or higher
git --version
python3 --version # Optional
```

#### 5. Clone and Install HashCii

```bash
git clone https://github.com/bablerpaul/HashCii.git
cd HashCii
npm install
```

---

### Linux (Fedora/RHEL)

#### 1. Install Node.js

```bash
sudo dnf install -y nodejs
```

Or use NodeSource for the latest LTS:

```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs
```

#### 2. Install Git and Python

```bash
sudo dnf install -y git python3
```

#### 3. Clone and Install HashCii

```bash
git clone https://github.com/bablerpaul/HashCii.git
cd HashCii
npm install
```

---

### Linux (Arch)

#### 1. Install All Dependencies

```bash
sudo pacman -S nodejs npm git python
```

#### 2. Clone and Install HashCii

```bash
git clone https://github.com/bablerpaul/HashCii.git
cd HashCii
npm install
```

---

## 🎮 Usage

### Development Mode

Start the Vite dev server with hot module replacement:

```bash
npm run dev
```

Open **http://127.0.0.1:5173** in your browser.

### Production Build

Build optimized static files into the `dist/` folder:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Production Launcher

The Python launcher starts a localhost-only HTTP server and opens the app in your browser.

**Windows:**

```powershell
.\start.bat
```

**macOS / Linux:**

```bash
chmod +x start.sh
./start.sh
```

**With options:**

```bash
# Choose a specific port
python launcher.py --port 8080

# Choose a specific browser
python launcher.py --browser chrome
python launcher.py --browser firefox

# Start server without opening browser
python launcher.py --no-open
```

The launcher will:
- Bind **only to `127.0.0.1`** (not accessible from other machines)
- Auto-select the next available port if the default is in use
- Prompt you to choose from your installed browsers

---

## 🗂️ Project Structure

```
HashCii/
├── index.html               # Vite entry point with CSP meta tags
├── vite.config.js            # Vite build configuration
├── tailwind.config.js        # Tailwind CSS theme & design tokens
├── postcss.config.js         # PostCSS pipeline
├── package.json              # Dependencies and scripts
├── launcher.py               # Production localhost server
├── start.bat                 # Windows launcher script
├── start.sh                  # macOS/Linux launcher script
├── LICENSE                   # MIT License
├── src/
│   ├── main.jsx              # React 18 entry (StrictMode)
│   ├── App.jsx               # Root component with tab routing
│   ├── index.css             # Tailwind + custom styles
│   ├── components/
│   │   ├── Hero.jsx          # Landing page with animations
│   │   ├── Nav.jsx           # Navigation bar
│   │   ├── ChooseDashboard.jsx  # Tool selector grid
│   │   ├── Toast.jsx         # Notification component
│   │   ├── Icon.jsx          # SVG icon library
│   │   └── Shared.jsx        # Reusable UI components
│   ├── tabs/
│   │   ├── GeneratorTab.jsx  # Hash generation
│   │   ├── HMACTab.jsx       # HMAC computation
│   │   ├── CompareTab.jsx    # Hash comparison
│   │   ├── IntegrityTab.jsx  # File verification
│   │   ├── EncodeTab.jsx     # Encode/Decode
│   │   ├── PasswordTab.jsx   # Password tools
│   │   ├── ToolsTab.jsx      # UUID + text stats
│   │   ├── BatchTab.jsx      # Multi-file hashing
│   │   └── IdentifyTab.jsx   # Hash identification
│   └── utils/
│       ├── constants.js      # Algorithm definitions & limits
│       └── crypto.js         # Crypto, validation & sanitization
└── dist/                     # Build output (generated)
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1` | Hash Generator |
| `2` | HMAC |
| `3` | Compare |
| `4` | Integrity Verify |
| `5` | Encode / Decode |
| `6` | Password Lab |
| `7` | Utilities |
| `8` | Batch Process |
| `9` | Identify Hash |
| `Esc` | Back to Dashboard |

---

## 🔒 Security

### Architecture

HashCii is a **zero-trust, air-gapped** application:

- **No backend** — all computation happens in the browser
- **No network calls** — there are zero `fetch()`, `XMLHttpRequest`, or `WebSocket` calls in the codebase
- **No telemetry** — no analytics, tracking, or data collection
- **Localhost only** — the Python launcher binds to `127.0.0.1`, not accessible from other machines

### Content Security Policy

The app ships with a strict CSP that blocks all external connections:

```
default-src 'self'; script-src 'self'; connect-src 'none';
frame-src 'none'; object-src 'none'; form-action 'none';
```

### HTTP Security Headers

The production launcher injects these headers on every response:

| Header | Value |
|--------|-------|
| X-Content-Type-Options | `nosniff` |
| X-Frame-Options | `DENY` |
| Referrer-Policy | `no-referrer` |
| Cache-Control | `no-store, no-cache, must-revalidate` |
| Permissions-Policy | `camera=(), microphone=(), geolocation=(), payment=()` |

### Crypto Security

| Feature | Implementation |
|---------|---------------|
| UUID v4 | `crypto.getRandomValues()` (CSPRNG) |
| Password generation | Rejection sampling — no modulo bias |
| Input sanitization | HTML entity encoding for `& < > " '` |
| Input limits | Text: 1M chars, Files: 500 MB, Hashes: 256 chars |

### Audit Status

| Check | Result |
|-------|--------|
| `eval()` / `innerHTML` / dynamic execution | ✅ None found |
| Hardcoded secrets or API keys | ✅ None found |
| Network API calls | ✅ None found |
| `Math.random()` in security contexts | ✅ Replaced with CSPRNG |
| Modulo bias in random generation | ✅ Fixed with rejection sampling |
| CDN-loaded scripts (supply chain risk) | ✅ Eliminated — all bundled via npm |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Build | [Vite 5](https://vitejs.dev) | Module bundler with HMR and esbuild minification |
| UI | [React 18](https://react.dev) | Component architecture with StrictMode |
| Styling | [Tailwind CSS 3](https://tailwindcss.com) | Utility-first CSS with custom design tokens |
| Animation | [Framer Motion](https://www.framer.com/motion/) | Spring physics, layout animations |
| Crypto | [CryptoJS 4.2.0](https://github.com/brix/crypto-js) | Hash, HMAC, and encoding functions |
| Fonts | Google Fonts | Space Grotesk · Syne · JetBrains Mono |
| Server | Python `http.server` | Localhost-only with security headers |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/my-feature
   ```
3. **Make your changes** and commit:
   ```bash
   git commit -m "feat: add my feature"
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/my-feature
   ```
5. **Open a Pull Request** on GitHub

Please make sure:
- The project builds without errors (`npm run build`)
- No new security vulnerabilities are introduced
- Code follows the existing style conventions

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this software for any purpose.

---

<div align="center">

Made with ❤️ by [bablerpaul](https://github.com/bablerpaul)

</div>
