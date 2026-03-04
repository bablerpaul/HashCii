import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CryptoJS from 'crypto-js';
import Icon from '../components/Icon';
import { Card, ErrorBanner, TabHeader } from '../components/Shared';
import { HMAC_ALGORITHMS, MAX_TEXT_LENGTH } from '../utils/constants';
import { copyToClipboard, validateText } from '../utils/crypto';

export default function HMACTab({ toast }) {
  const [text, setText] = useState('');
  const [secret, setSecret] = useState('');
  const [algo, setAlgo] = useState('SHA256');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const generate = () => {
    try {
      setError('');
      if (!text.trim() || !secret.trim()) { setError('Enter both message and secret key'); return; }
      const v = validateText(text); if (!v.valid) { setError(v.error); return; }
      const hash = CryptoJS['Hmac' + algo](text, secret).toString();
      setResult(hash);
      toast('HMAC generated', 'success');
    } catch (e) {
      setError('HMAC generation failed');
      toast('Error', 'error');
    }
  };

  const copy = () => copyToClipboard(result).then(() => toast('Copied', 'success')).catch(() => toast('Copy failed', 'error'));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <TabHeader icon="key" title="HMAC Generator" color="amber" />
      <AnimatePresence>{error && <ErrorBanner error={error} />}</AnimatePresence>

      <Card>
        <label className="text-sm font-medium text-surface-300 mb-3 block">Message</label>
        <textarea value={text} onChange={e => { setText(e.target.value); setError(''); }} placeholder="Enter message..."
          className="input-field h-24 resize-none" maxLength={MAX_TEXT_LENGTH} />
      </Card>
      <Card>
        <label className="text-sm font-medium text-surface-300 mb-3 block">Secret Key</label>
        <input type="password" value={secret} onChange={e => { setSecret(e.target.value); setError(''); }} placeholder="Enter secret key..."
          className="input-field" maxLength={MAX_TEXT_LENGTH} />
      </Card>
      <Card>
        <label className="text-sm font-medium text-surface-300 mb-3 block">Algorithm</label>
        <select value={algo} onChange={e => setAlgo(e.target.value)} className="input-field cursor-pointer font-sans">
          {HMAC_ALGORITHMS.map(a => <option key={a} value={a}>HMAC-{a}</option>)}
        </select>
      </Card>

      <motion.button whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }} onClick={generate}
        className="btn-primary w-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center gap-2 shadow-amber-600/25">
        <Icon name="key" size={20} /> Generate HMAC
      </motion.button>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-surface-500 bg-white/[0.04] px-2.5 py-1 rounded-lg">HMAC-{algo}</span>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={copy}
                  className="text-xs text-accent-400 hover:text-accent-300 flex items-center gap-1.5 transition-colors">
                  <Icon name="copy" size={14} /> Copy
                </motion.button>
              </div>
              <div className="hash-output text-amber-400">{result}</div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
