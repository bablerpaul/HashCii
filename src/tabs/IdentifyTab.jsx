import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../components/Icon';
import { Card, ErrorBanner, TabHeader } from '../components/Shared';
import { HASH_PATTERNS } from '../utils/constants';
import { sanitize } from '../utils/crypto';

export default function IdentifyTab({ toast }) {
  const [hash, setHash] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const identify = () => {
    setError('');
    if (!hash.trim()) { setError('Enter a hash to identify'); return; }
    const len = hash.trim().length;
    const pattern = HASH_PATTERNS.find(p => p.len === len);
    setResult({ algs: pattern ? pattern.algs : [], len });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <TabHeader icon="search" title="Identify Hash" color="orange" />
      <AnimatePresence>{error && <ErrorBanner error={error} />}</AnimatePresence>

      <Card>
        <label className="text-sm font-medium text-surface-300 mb-3 block">Hash Value</label>
        <textarea value={hash} onChange={e => { setHash(e.target.value); setError(''); }} placeholder="Paste hash to identify..."
          className="input-field h-24 resize-none" maxLength={256} />
      </Card>

      <motion.button whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }} onClick={identify}
        className="btn-primary w-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center gap-2 shadow-orange-600/25">
        <Icon name="search" size={20} /> Identify
      </motion.button>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card>
              {result.algs.length > 0 ? (
                <>
                  <p className="text-sm text-surface-400 mb-4">Possible algorithms <span className="text-surface-600">({result.len} characters)</span></p>
                  <div className="space-y-2">
                    {result.algs.map((a, i) => (
                      <motion.div key={a} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-surface-950/80 border border-white/[0.04]">
                        <span className="font-medium text-accent-400">{sanitize(a)}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full ${i === 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/[0.04] text-surface-500'}`}>
                          {i === 0 ? 'Most Likely' : 'Possible'}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <span className="text-3xl">?</span>
                  </div>
                  <p className="text-amber-400 font-bold text-lg">Unknown Hash Type</p>
                  <p className="text-xs text-surface-500 mt-1">{result.len} characters — no known match</p>
                </motion.div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
