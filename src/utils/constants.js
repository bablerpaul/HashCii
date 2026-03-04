export const ALGORITHMS = [
  { name: 'MD5', bits: 128, color: '#f97316' },
  { name: 'SHA-1', bits: 160, color: '#eab308' },
  { name: 'SHA-224', bits: 224, color: '#22c55e' },
  { name: 'SHA-256', bits: 256, color: '#6366f1' },
  { name: 'SHA-384', bits: 384, color: '#8b5cf6' },
  { name: 'SHA-512', bits: 512, color: '#a855f7' },
  { name: 'SHA3-256', bits: 256, color: '#ec4899' },
  { name: 'SHA3-512', bits: 512, color: '#f43f5e' },
  { name: 'RIPEMD-160', bits: 160, color: '#14b8a6' },
];

export const HASH_PATTERNS = [
  { len: 32, algs: ['MD5', 'MD4'] },
  { len: 40, algs: ['SHA-1', 'RIPEMD-160'] },
  { len: 56, algs: ['SHA-224', 'SHA3-224'] },
  { len: 64, algs: ['SHA-256', 'SHA3-256', 'BLAKE2s-256'] },
  { len: 96, algs: ['SHA-384', 'SHA3-384'] },
  { len: 128, algs: ['SHA-512', 'SHA3-512', 'BLAKE2b-512'] },
];

export const HMAC_ALGORITHMS = [
  'MD5', 'SHA1', 'SHA256', 'SHA384', 'SHA512', 'SHA224', 'SHA3', 'RIPEMD160',
];

export const ENCODING_MODES = [
  { value: 'base64-encode', label: 'Base64 Encode', icon: '→ B64' },
  { value: 'base64-decode', label: 'Base64 Decode', icon: 'B64 →' },
  { value: 'hex-encode', label: 'Hex Encode', icon: '→ HEX' },
  { value: 'hex-decode', label: 'Hex Decode', icon: 'HEX →' },
  { value: 'url-encode', label: 'URL Encode', icon: '→ URL' },
  { value: 'url-decode', label: 'URL Decode', icon: 'URL →' },
];

export const MAX_FILE_SIZE = 500 * 1024 * 1024;
export const MAX_TEXT_LENGTH = 1_000_000;

export const TOOL_CARDS = [
  { id: 'generator', name: 'Hash Generator', icon: 'hash', gradient: 'from-indigo-600 to-violet-600', desc: 'Generate cryptographic hashes from text or files', shortcut: '1' },
  { id: 'hmac', name: 'HMAC', icon: 'key', gradient: 'from-amber-500 to-orange-600', desc: 'Create keyed-hash message authentication codes', shortcut: '2' },
  { id: 'compare', name: 'Compare', icon: 'compare', gradient: 'from-blue-500 to-cyan-500', desc: 'Side-by-side hash comparison with diff view', shortcut: '3' },
  { id: 'integrity', name: 'Verify', icon: 'shield', gradient: 'from-emerald-500 to-green-600', desc: 'Verify file integrity against known hashes', shortcut: '4' },
  { id: 'encode', name: 'Encode/Decode', icon: 'code', gradient: 'from-purple-500 to-fuchsia-600', desc: 'Base64, Hex, and URL encoding utilities', shortcut: '5' },
  { id: 'password', name: 'Password Lab', icon: 'lock', gradient: 'from-pink-500 to-rose-600', desc: 'Strength analysis and secure generation', shortcut: '6' },
  { id: 'tools', name: 'Utilities', icon: 'tools', gradient: 'from-cyan-500 to-teal-500', desc: 'UUID generator, text statistics, and more', shortcut: '7' },
  { id: 'batch', name: 'Batch Process', icon: 'folder', gradient: 'from-violet-500 to-purple-600', desc: 'Hash multiple files simultaneously', shortcut: '8' },
  { id: 'identify', name: 'Identify', icon: 'search', gradient: 'from-orange-500 to-red-500', desc: 'Detect hash algorithm from hash string', shortcut: '9' },
];
