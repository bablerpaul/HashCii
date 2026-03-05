<div align="center">

# HashCii v1.1.0 — Release Notes

**March 5, 2026**

[![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
&nbsp;
[![Version](https://img.shields.io/badge/Version-1.1.0-6366f1?style=for-the-badge)]()

</div>

---

## What's New in v1.1.0

### Desktop Shortcut & Browser Selection

- **Cross-platform desktop shortcut creator** — Run `python create_shortcut.py` to place a one-click launcher icon on your desktop (Windows `.lnk`, macOS `.app`, Linux `.desktop`).
- **In-app browser selector** — Click the ⚙ gear icon in the navigation bar to choose which browser HashCii opens in. Your preference is saved and remembered across launches.
- **Silent Windows launcher** — Desktop shortcut launches without a visible console window via `start_hidden.vbs`.
- **Auto-generated icon assets** — The shortcut script creates `hashcii.ico` (multi-resolution) and `hashcii.png` automatically; no external tools needed.

### Security Hardening

This release includes a full security audit with the following fixes:

| # | Severity | Issue | Fix |
|---|----------|-------|-----|
| 1 | **Critical** | CSP `connect-src 'none'` blocked all API calls | Changed to `connect-src 'self'` to allow same-origin requests |
| 2 | **High** | No POST body size limit on API endpoints | Added 16 KB max body limit; returns `413 Payload Too Large` |
| 3 | **High** | Config file accepted arbitrary keys/values | Whitelist-only (`browser` key), string-type enforced, 256-char max |
| 4 | **High** | No origin validation (DNS rebinding risk) | Added `_is_local_origin()` guard — API rejects non-localhost origins |
| 5 | **Medium** | Hash comparison used `===` (timing side-channel) | Replaced with constant-time `timingSafeCompare()` in Compare & Integrity tabs |
| 6 | **Medium** | Browser selector API validated browser ID against known list | POST `/api/browser-preference` now rejects unknown browser IDs |
| 7 | **Medium** | IntegrityTab expected-hash field had no length limit | Added `maxLength={256}` |
| 8 | **Low** | Fetch calls had no timeout / abort handling | Added `AbortController` with 5-second timeout + response status checks |
| 9 | **Low** | Unused state variable in Hero component | Removed dead `mounted` state and unused imports |

### Security Architecture (unchanged)

- **100% client-side** — All cryptographic operations (hashing, HMAC, encoding) run entirely in your browser. No data is ever sent to any server.
- **Localhost-only server** — The production launcher binds exclusively to `127.0.0.1`; not accessible from the network.
- **Hardened HTTP headers** — `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `Permissions-Policy`, `X-Permitted-Cross-Domain-Policies: none`, `Cache-Control: no-store`.
- **Content Security Policy** — Strict CSP: `default-src 'self'`, `script-src 'self'`, `object-src 'none'`, `frame-src 'none'`, `form-action 'none'`, `base-uri 'self'`.
- **CSPRNG** — Password generator uses `crypto.getRandomValues()` with rejection sampling (no modulo bias). UUID v4 generation is also cryptographically secure.
- **Input validation** — File size limits (500 MB), text length limits (1M chars), XSS-safe output (React escaping + `sanitize()` helper).

---

## Files Changed

### New Files
| File | Description |
|------|-------------|
| `src/components/BrowserSelector.jsx` | In-app modal for selecting preferred browser |
| `create_shortcut.py` | Cross-platform desktop shortcut/icon creator |
| `start_hidden.vbs` | Windows silent launcher (hides console) |
| `assets/icon.svg` | SVG icon source |
| `assets/hashcii.ico` | Generated multi-resolution Windows icon |
| `assets/hashcii.png` | Generated 256×256 PNG icon |
| `RELEASE.md` | This release document |

### Modified Files
| File | Change |
|------|--------|
| `package.json` | Version bumped to `1.1.0` |
| `index.html` | CSP `connect-src` changed from `'none'` → `'self'` |
| `launcher.py` | Added API endpoints, POST body limit, config whitelisting, origin validation, saved-browser auto-launch |
| `src/App.jsx` | Integrated `BrowserSelector` modal |
| `src/components/Nav.jsx` | Added ⚙ settings button |
| `src/components/Icon.jsx` | Added `settings` and `globe` icon paths |
| `src/components/Hero.jsx` | Removed dead code (unused `mounted` state) |
| `src/utils/crypto.js` | Added `timingSafeCompare()` constant-time comparison |
| `src/tabs/CompareTab.jsx` | Uses `timingSafeCompare()` instead of `===` |
| `src/tabs/IntegrityTab.jsx` | Uses `timingSafeCompare()`, added `maxLength` on expected hash |
| `.gitignore` | Added `.hashcii_config.json` |

---

## Quick Start

```bash
# Clone
git clone https://github.com/bablerpaul/HashCii.git
cd HashCii

# Install & build
npm install
npm run build

# Create desktop shortcut (optional)
python create_shortcut.py

# Launch
# Windows:
start.bat
# macOS / Linux:
./start.sh
```

---

## Tools Included

| Tool | Description | Algorithms |
|------|-------------|------------|
| **Hash Generator** | Hash text or files | MD5, SHA-1/224/256/384/512, SHA3-256/512, RIPEMD-160 |
| **HMAC** | Keyed-hash authentication | All supported hash algorithms |
| **Compare** | Constant-time hash comparison | Visual diff with match/mismatch |
| **Integrity Verify** | File checksum verification | All 9 algorithms |
| **Encode/Decode** | Encoding conversion | Base64, Hex, URL |
| **Password Lab** | Strength analysis & generation | CSPRNG, 10-point scoring |
| **Utilities** | UUID v4 generator, text stats | Cryptographically secure |
| **Batch Process** | Multi-file hashing | All algorithms |
| **Identify Hash** | Detect hash algorithm | 6 length-based pattern families |

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1`–`9` | Switch to tool tab |
| `Escape` | Go back |

---

## Tech Stack

- **React 19** + **Vite 5** + **Tailwind CSS 3**
- **CryptoJS** for hash/HMAC/encoding
- **Framer Motion** for animations
- **Python 3** localhost launcher (production)

---

## License

MIT — see [LICENSE](LICENSE)

---

<div align="center">
<sub>Built by <a href="https://github.com/bablerpaul">bablerpaul</a></sub>
</div>
