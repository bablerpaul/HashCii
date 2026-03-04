import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../components/Icon';
import { Card, FileDropzone, ErrorBanner, TabHeader, Spinner } from '../components/Shared';
import { ALGORITHMS, MAX_TEXT_LENGTH, MAX_FILE_SIZE } from '../utils/constants';
import { computeHash, readFile, copyToClipboard, validateText, formatSize } from '../utils/crypto';

export default function GeneratorTab({ toast }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [algo, setAlgo] = useState('SHA-256');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    try {
      setError('');
      if (!text && !file) { setError('Enter text or select a file'); return; }
      if (text) { const v = validateText(text); if (!v.valid) { setError(v.error); return; } }
      setLoading(true);
      const data = file ? await readFile(file) : text;
      const hash = computeHash(data, algo);
      setResult({ algo, hash });
      toast('Hash generated', 'success');
    } catch (e) {
      setError(e.message || 'Hashing failed');
      toast(e.message || 'Error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copy = (h) => copyToClipboard(h).then(() => toast('Copied', 'success')).catch(() => toast('Copy failed', 'error'));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <TabHeader icon="hash" title="Hash Generator" color="accent" />
      <AnimatePresence>{error && <ErrorBanner error={error} />}</AnimatePresence>

      <Card>
        <label className="text-sm font-medium text-surface-300 mb-3 block">Input Text</label>
        <textarea value={text} onChange={e => { setText(e.target.value); setError(''); }} placeholder="Enter text to hash..."
          className="input-field h-28 resize-none" maxLength={MAX_TEXT_LENGTH} />
        <div className="mt-2 text-xs text-surface-600 tabular-nums">{text.length.toLocaleString()} / {MAX_TEXT_LENGTH.toLocaleString()}</div>
        <div className="mt-4">
          <label className="text-sm font-medium text-surface-300 mb-3 block">Or Upload File <span className="text-surface-600">(max {formatSize(MAX_FILE_SIZE)})</span></label>
          <FileDropzone onFile={setFile} file={file} />
        </div>
      </Card>

      <Card>
        <label className="text-sm font-medium text-surface-300 mb-3 block">Algorithm</label>
        <select value={algo} onChange={e => setAlgo(e.target.value)}
          className="input-field cursor-pointer font-sans">
          {ALGORITHMS.map(a => <option key={a.name} value={a.name}>{a.name} ({a.bits}-bit)</option>)}
        </select>
      </Card>

      <motion.button whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }} onClick={generate} disabled={loading}
        className="btn-primary w-full bg-gradient-to-r from-accent-600 to-violet-600 flex items-center justify-center gap-2 shadow-accent-600/25 disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? <Spinner /> : <Icon name="hash" size={20} />} Generate Hash
      </motion.button>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20 }}>
            <Card>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-medium text-surface-500 bg-white/[0.04] px-2.5 py-1 rounded-lg">{result.algo}</span>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => copy(result.hash)}
                  className="text-xs text-accent-400 hover:text-accent-300 flex items-center gap-1.5 transition-colors">
                  <Icon name="copy" size={14} /> Copy
                </motion.button>
              </div>
              <div className="hash-output text-emerald-400">{result.hash}</div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
