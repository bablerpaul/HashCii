import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../components/Icon';
import { Card, ErrorBanner, TabHeader } from '../components/Shared';
import { timingSafeCompare } from '../utils/crypto';

export default function CompareTab({ toast }) {
  const [h1, setH1] = useState('');
  const [h2, setH2] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const compare = () => {
    setError('');
    if (!h1 || !h2) { setError('Enter both hashes'); return; }
    const match = timingSafeCompare(h1.trim(), h2.trim());
    setResult(match);
    toast(match ? 'Match!' : 'No match', match ? 'success' : 'error');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <TabHeader icon="compare" title="Compare Hashes" color="blue" />
      <AnimatePresence>{error && <ErrorBanner error={error} />}</AnimatePresence>

      <Card>
        <label className="text-sm font-medium text-surface-300 mb-3 block">First Hash</label>
        <textarea value={h1} onChange={e => { setH1(e.target.value); setError(''); }} placeholder="Paste first hash..."
          className="input-field h-24 resize-none" maxLength={256} />
      </Card>
      <Card>
        <label className="text-sm font-medium text-surface-300 mb-3 block">Second Hash</label>
        <textarea value={h2} onChange={e => { setH2(e.target.value); setError(''); }} placeholder="Paste second hash..."
          className="input-field h-24 resize-none" maxLength={256} />
      </Card>

      <motion.button whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }} onClick={compare}
        className="btn-primary w-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center gap-2 shadow-blue-600/25">
        <Icon name="compare" size={20} /> Compare
      </motion.button>

      <AnimatePresence>
        {result !== null && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 18 }}>
            <Card className={`text-center py-10 ${result ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10, delay: 0.1 }}
                className={`w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center ${result ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                <Icon name={result ? 'check' : 'x'} size={36} className={result ? 'text-emerald-400' : 'text-red-400'} />
              </motion.div>
              <p className={`text-xl font-bold ${result ? 'text-emerald-400' : 'text-red-400'}`}>
                {result ? 'Hashes Match' : 'Hashes Differ'}
              </p>
              <p className="text-sm text-surface-500 mt-2">
                {result ? 'Both inputs produce identical hashes' : 'The hashes are not equal'}
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
