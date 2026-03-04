import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../components/Icon';
import { Card, ErrorBanner, TabHeader } from '../components/Shared';
import { ENCODING_MODES, MAX_TEXT_LENGTH } from '../utils/constants';
import { processEncoding, copyToClipboard } from '../utils/crypto';

export default function EncodeTab({ toast }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('base64-encode');
  const [error, setError] = useState('');

  const process = () => {
    try {
      setError('');
      if (!input.trim()) { setError('Enter text to process'); return; }
      setOutput(processEncoding(input, mode));
      toast('Processed', 'success');
    } catch (e) {
      setError(e.message || 'Processing failed');
      toast(e.message || 'Error', 'error');
    }
  };

  const copy = () => copyToClipboard(output).then(() => toast('Copied', 'success')).catch(() => toast('Copy failed', 'error'));
  const swap = () => { setInput(output); setOutput(''); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <TabHeader icon="code" title="Encode / Decode" color="purple" />
      <AnimatePresence>{error && <ErrorBanner error={error} />}</AnimatePresence>

      <Card>
        <label className="text-sm font-medium text-surface-300 mb-3 block">Mode</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ENCODING_MODES.map(m => (
            <motion.button key={m.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setMode(m.value)}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
                mode === m.value
                  ? 'bg-purple-500/15 border-purple-500/30 text-purple-400'
                  : 'bg-white/[0.02] border-white/[0.04] text-surface-400 hover:bg-white/[0.04]'
              }`}
            >
              <span className="text-[10px] font-mono opacity-50 block mb-0.5">{m.icon}</span>
              {m.label}
            </motion.button>
          ))}
        </div>
      </Card>

      <Card>
        <label className="text-sm font-medium text-surface-300 mb-3 block">Input</label>
        <textarea value={input} onChange={e => { setInput(e.target.value); setError(''); }} placeholder="Enter text..."
          className="input-field h-28 resize-none" maxLength={MAX_TEXT_LENGTH} />
      </Card>

      <div className="flex gap-3">
        <motion.button whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }} onClick={process}
          className="btn-primary flex-1 bg-gradient-to-r from-purple-500 to-fuchsia-600 flex items-center justify-center gap-2 shadow-purple-600/25">
          <Icon name="code" size={20} /> Process
        </motion.button>
        {output && (
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={swap} className="px-4 bg-white/[0.04] hover:bg-white/[0.06] rounded-xl text-surface-400 border border-white/[0.06] transition-all">
            <Icon name="swap" size={20} />
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {output && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-surface-500">Output</span>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={copy}
                  className="text-xs text-accent-400 hover:text-accent-300 flex items-center gap-1.5 transition-colors">
                  <Icon name="copy" size={14} /> Copy
                </motion.button>
              </div>
              <div className="hash-output text-purple-400 max-h-40 overflow-auto">{output}</div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
