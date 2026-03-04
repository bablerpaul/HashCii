<div align="center">

```
██╗  ██╗ █████╗ ███████╗██╗  ██╗ ██████╗██╗██╗
██║  ██║██╔══██╗██╔════╝██║  ██║██╔════╝██║██║
███████║███████║███████╗███████║██║     ██║██║
██╔══██║██╔══██║╚════██║██╔══██║██║     ██║██║
██║  ██║██║  ██║███████║██║  ██║╚██████╗██║██║
╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝╚═╝
```

### ⛓️ Zero-trust, client-side cryptographic toolkit

<br>

[![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
&nbsp;
[![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
&nbsp;
[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
&nbsp;
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

<br>

> **All cryptographic operations run 100% in your browser.**
> No servers. No network calls. No telemetry. Your data never leaves your machine.

<br>

[**Features**](#-features) &nbsp;•&nbsp; [**Requirements**](#-requirements) &nbsp;•&nbsp; [**Installation**](#-installation) &nbsp;•&nbsp; [**Usage**](#-usage) &nbsp;•&nbsp; [**Security**](#-security) &nbsp;•&nbsp; [**Tech Stack**](#-tech-stack) &nbsp;•&nbsp; [**License**](#-license)

<br>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="divider" width="100%">

</div>

<br>

## 📋 Table of Contents

<details>
<summary><b>Click to expand</b></summary>

<br>

- [Features](#-features)
- [Requirements](#-requirements)
- [Installation](#-installation)
  - [Windows](#-windows)
  - [macOS](#-macos)
  - [Linux (Ubuntu/Debian)](#-linux-ubuntudebian)
  - [Linux (Fedora/RHEL)](#-linux-fedorarhel)
  - [Linux (Arch)](#-linux-arch)
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

</details>

<br>

## ✨ Features

<table>
<tr>
<td width="250"><b>🔐 Hash Generator</b></td>
<td>Hash text or files via drag-and-drop</td>
<td><code>MD5</code> <code>SHA-1</code> <code>SHA-224</code> <code>SHA-256</code> <code>SHA-384</code> <code>SHA-512</code> <code>SHA3-256</code> <code>SHA3-512</code> <code>RIPEMD-160</code></td>
</tr>
<tr>
<td><b>🔑 HMAC</b></td>
<td>Keyed-hash message authentication codes</td>
<td><code>HMAC-MD5</code> <code>HMAC-SHA1/224/256/384/512</code> <code>HMAC-SHA3</code> <code>HMAC-RIPEMD160</code></td>
</tr>
<tr>
<td><b>⚖️ Compare</b></td>
<td>Side-by-side hash comparison</td>
<td>Case-insensitive match with visual diff</td>
</tr>
<tr>
<td><b>🛡️ Integrity Verify</b></td>
<td>Verify file checksum against a known hash</td>
<td>All 9 algorithms with file drag-and-drop</td>
</tr>
<tr>
<td><b>🔄 Encode / Decode</b></td>
<td>Convert between encoding formats</td>
<td><code>Base64</code> <code>Hex</code> <code>URL</code></td>
</tr>
<tr>
<td><b>🧪 Password Lab</b></td>
<td>Strength analysis & secure generation</td>
<td>CSPRNG with rejection sampling (no modulo bias)</td>
</tr>
<tr>
<td><b>🧰 Utilities</b></td>
<td>UUID v4 generator & text statistics</td>
<td>Cryptographically secure UUID, char/word/line/byte counts</td>
</tr>
<tr>
<td><b>📦 Batch Process</b></td>
<td>Hash multiple files at once</td>
<td>All algorithms with bulk copy</td>
</tr>
<tr>
<td><b>🔍 Identify Hash</b></td>
<td>Detect which algorithm produced a hash</td>
<td>6 pattern families (32/40/56/64/96/128 characters)</td>
</tr>
</table>

<br>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="divider" width="100%">

<br>

## 📦 Requirements

| Tool | Version | What It's For |
|:-----|:--------|:-------------|
| ![Node.js](https://img.shields.io/badge/Node.js-%3E%3D%2020.x-339933?style=flat-square&logo=node.js&logoColor=white) | `>= 20.x` | JavaScript build toolchain |
| ![npm](https://img.shields.io/badge/npm-%3E%3D%2010.x-CB3837?style=flat-square&logo=npm&logoColor=white) | `>= 10.x` | Package manager (comes with Node.js) |
| ![Git](https://img.shields.io/badge/Git-%3E%3D%202.x-F05032?style=flat-square&logo=git&logoColor=white) | `>= 2.x` | Cloning the repository |
| ![Python](https://img.shields.io/badge/Python-%3E%3D%203.10-3776AB?style=flat-square&logo=python&logoColor=white) | `>= 3.10` *(optional)* | Production localhost launcher |

<br>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="divider" width="100%">

<br>

## 🚀 Installation

### 🪟 Windows

<details>
<summary><b>Click to expand Windows instructions</b></summary>

<br>

#### 1. Install Node.js

Download and run the **Windows Installer (.msi)** from the official site:

> 👉 **https://nodejs.org/en/download** — choose the **LTS** version.

During installation, make sure **"Add to PATH"** is checked.

After installation, open **PowerShell** or **Command Prompt** and verify:

```powershell
node --version
npm --version
```

#### 2. Install Git

Download and run the installer from:

> 👉 **https://git-scm.com/download/win**

Use the default options. After installation, verify:

```powershell
git --version
```

#### 3. Install Python *(optional — only needed for the production launcher)*

Download from:

> 👉 **https://www.python.org/downloads/**

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

</details>

---

### 🍎 macOS

<details>
<summary><b>Click to expand macOS instructions</b></summary>

<br>

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

</details>

---

### 🐧 Linux (Ubuntu/Debian)

<details>
<summary><b>Click to expand Ubuntu/Debian instructions</b></summary>

<br>

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

</details>

---

### 🐧 Linux (Fedora/RHEL)

<details>
<summary><b>Click to expand Fedora/RHEL instructions</b></summary>

<br>

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

</details>

---

### 🐧 Linux (Arch)

<details>
<summary><b>Click to expand Arch instructions</b></summary>

<br>

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

</details>

<br>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="divider" width="100%">

<br>

## 🎮 Usage

### Development Mode

Start the Vite dev server with hot module replacement:

```bash
npm run dev
```

> App opens at **http://127.0.0.1:5173**

### Production Build

```bash
# Build optimized static files
npm run build

# Preview the production build
npm run preview
```

### Production Launcher

The Python launcher starts a localhost-only HTTP server and opens the app in your browser.

<table>
<tr>
<td><b>🪟 Windows</b></td>
<td>

```powershell
.\start.bat
```

</td>
</tr>
<tr>
<td><b>🍎 macOS / 🐧 Linux</b></td>
<td>

```bash
chmod +x start.sh
./start.sh
```

</td>
</tr>
</table>

**Advanced options:**

```bash
python launcher.py --port 8080        # Custom port
python launcher.py --browser chrome   # Specific browser
python launcher.py --browser firefox  # Specific browser
python launcher.py --no-open          # Server only, no browser
```

The launcher will:
- 🔒 Bind **only to `127.0.0.1`** (not accessible from other machines)
- 🔁 Auto-select the next available port if the default is in use
- 🌐 Prompt you to choose from your installed browsers

<br>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="divider" width="100%">

<br>

## 🗂️ Project Structure

```
HashCii/
│
├── 📄 index.html               Vite entry point with CSP meta tags
├── ⚙️ vite.config.js            Vite build configuration
├── 🎨 tailwind.config.js        Tailwind CSS theme & design tokens
├── ⚙️ postcss.config.js         PostCSS pipeline
├── 📦 package.json              Dependencies and scripts
├── 🐍 launcher.py               Production localhost server
├── 🪟 start.bat                 Windows launcher script
├── 🐧 start.sh                  macOS/Linux launcher script
├── 📜 LICENSE                   MIT License
│
├── src/
│   ├── main.jsx                 React 18 entry (StrictMode)
│   ├── App.jsx                  Root component with tab routing
│   ├── index.css                Tailwind + custom glassmorphism styles
│   │
│   ├── components/
│   │   ├── Hero.jsx             Landing page with spring animations
│   │   ├── Nav.jsx              Animated navigation bar
│   │   ├── ChooseDashboard.jsx  Tool selector grid
│   │   ├── Toast.jsx            Auto-dismiss notifications
│   │   ├── Icon.jsx             20+ SVG icon paths
│   │   └── Shared.jsx           Card, FileDropzone, ErrorBanner, Spinner
│   │
│   ├── tabs/
│   │   ├── GeneratorTab.jsx     Hash generation
│   │   ├── HMACTab.jsx          HMAC computation
│   │   ├── CompareTab.jsx       Hash comparison
│   │   ├── IntegrityTab.jsx     File verification
│   │   ├── EncodeTab.jsx        Encode / Decode
│   │   ├── PasswordTab.jsx      Password tools
│   │   ├── ToolsTab.jsx         UUID + text stats
│   │   ├── BatchTab.jsx         Multi-file hashing
│   │   └── IdentifyTab.jsx      Hash identification
│   │
│   └── utils/
│       ├── constants.js         Algorithm definitions & limits
│       └── crypto.js            Crypto, validation & sanitization
│
└── dist/                        Build output (generated)
```

<br>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="divider" width="100%">

<br>

## ⌨️ Keyboard Shortcuts

<div align="center">

| Key | Action | | Key | Action |
|:---:|:-------|:-:|:---:|:-------|
| <kbd>1</kbd> | Hash Generator | | <kbd>6</kbd> | Password Lab |
| <kbd>2</kbd> | HMAC | | <kbd>7</kbd> | Utilities |
| <kbd>3</kbd> | Compare | | <kbd>8</kbd> | Batch Process |
| <kbd>4</kbd> | Integrity Verify | | <kbd>9</kbd> | Identify Hash |
| <kbd>5</kbd> | Encode / Decode | | <kbd>Esc</kbd> | Back to Dashboard |

</div>

<br>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="divider" width="100%">

<br>

## 🔒 Security

### Architecture

HashCii is a **zero-trust, air-gapped** application:

```
┌────────────────────────────────────────────────────┐
│                    YOUR BROWSER                     │
│                                                     │
│   User Input ──► Validation ──► CryptoJS ──► Output │
│       │                                       │     │
│   FileReader                            Clipboard   │
│   (ArrayBuffer)                    (secure context)  │
│                                                     │
│              ❌ NO network calls                     │
│              ❌ NO fetch / XHR / WebSocket           │
│              ❌ NO telemetry                         │
│              ❌ NO server-side processing            │
└────────────────────────────────────────────────────┘
```

### Content Security Policy

```
default-src 'self'; script-src 'self'; connect-src 'none';
frame-src 'none'; object-src 'none'; form-action 'none';
```

### HTTP Security Headers

| Header | Value |
|:-------|:------|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `no-referrer` |
| `Cache-Control` | `no-store, no-cache, must-revalidate` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` |

### Cryptographic Security

| Feature | Implementation |
|:--------|:--------------|
| UUID v4 | `crypto.getRandomValues()` — CSPRNG |
| Password generation | Rejection sampling — zero modulo bias |
| Input sanitization | HTML entity encoding for `& < > " '` |
| Input limits | Text: 1M chars · Files: 500 MB · Hashes: 256 chars |

### Audit Results

| Check | Status |
|:------|:------:|
| `eval()` / `innerHTML` / dynamic execution | ✅ |
| Hardcoded secrets or API keys | ✅ |
| Network API calls (`fetch`, `XHR`, `WebSocket`) | ✅ |
| `Math.random()` in security contexts | ✅ |
| Modulo bias in random generation | ✅ |
| CDN-loaded scripts (supply chain) | ✅ |

> ✅ = **Not found / Fixed / Eliminated**

<br>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="divider" width="100%">

<br>

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Build** | [![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev) | Module bundler · HMR · esbuild minification |
| **UI** | [![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev) | Component architecture · StrictMode |
| **Styling** | [![Tailwind](https://img.shields.io/badge/Tailwind_CSS_3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com) | Utility-first CSS · custom design tokens |
| **Animation** | [![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/) | Spring physics · layout animations |
| **Crypto** | [![CryptoJS](https://img.shields.io/badge/CryptoJS_4.2-333?style=flat-square&logo=javascript&logoColor=white)](https://github.com/brix/crypto-js) | Hash · HMAC · encoding |
| **Fonts** | [![Google Fonts](https://img.shields.io/badge/Google_Fonts-4285F4?style=flat-square&logo=googlefonts&logoColor=white)](https://fonts.google.com) | Space Grotesk · Syne · JetBrains Mono |
| **Server** | [![Python](https://img.shields.io/badge/Python_http.server-3776AB?style=flat-square&logo=python&logoColor=white)](https://docs.python.org/3/library/http.server.html) | Localhost-only · security headers |

</div>

<br>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="divider" width="100%">

<br>

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/HashCii.git
cd HashCii

# 2. Create a feature branch
git checkout -b feature/my-awesome-feature

# 3. Make your changes, then commit
git add .
git commit -m "feat: add my awesome feature"

# 4. Push to your fork
git push origin feature/my-awesome-feature

# 5. Open a Pull Request on GitHub
```

**Before submitting, please make sure:**

- [x] The project builds without errors → `npm run build`
- [x] No new security vulnerabilities introduced
- [x] Code follows existing style conventions

<br>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="divider" width="100%">

<br>

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this software for any purpose.

<br>

---

<div align="center">

```
╔══════════════════════════════════════════════╗
║                                              ║
║   Made with ❤️ by bablerpaul                  ║
║   https://github.com/bablerpaul              ║
║                                              ║
╚══════════════════════════════════════════════╝
```

**⭐ Star this repo if you find it useful!**

</div>
