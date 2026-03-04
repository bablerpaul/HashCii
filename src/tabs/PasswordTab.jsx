import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../components/Icon';
import { Card, TabHeader } from '../components/Shared';
import { analyzePassword, generatePassword, copyToClipboard } from '../utils/crypto';

const strengthColors = {
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500', ring: 'ring-emerald-500/20' },
  green:   { text: 'text-green-400',   bg: 'bg-green-500',   ring: 'ring-green-500/20' },
  amber:   { text: 'text-amber-400',   bg: 'bg-amber-500',   ring: 'ring-amber-500/20' },
  orange:  { text: 'text-orange-400',   bg: 'bg-orange-500',  ring: 'ring-orange-500/20' },
  red:     { text: 'text-red-400',      bg: 'bg-red-500',     ring: 'ring-red-500/20' },
};

export default function PasswordTab({ toast }) {
  const [password, setPassword] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (pwd) => { setPassword(pwd); setAnalysis(analyzePassword(pwd)); };
  const handleGenerate = () => { const p = generatePassword(20); setPassword(p); setAnalysis(analyzePassword(p)); setShowPwd(true); toast('Generated', 'success'); };
  const copy = () => copyToClipboard(password).then(() => toast('Copied', 'success')).catch(() => toast('Copy failed', 'error'));

  const c = analysis ? strengthColors[analysis.color] : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <TabHeader icon="lock" title="Password Lab" color="pink" />

      <Card>
        <label className="text-sm font-medium text-surface-300 mb-3 block">Password</label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input type={showPwd ? 'text' : 'password'} value={password}
              onChange={e => handleChange(e.target.value)} placeholder="Type or generate..."
              className="input-field pr-10" maxLength={100} />
            <button onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors">
              <Icon name={showPwd ? 'x' : 'search'} size={16} />
            </button>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleGenerate}
            className="px-4 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl text-white shadow-lg shadow-pink-600/20">
            <Icon name="dice" size={20} />
          </motion.button>
          {password && (
            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={copy} className="px-4 bg-white/[0.04] border border-white/[0.06] rounded-xl text-surface-400 hover:text-surface-200 transition-colors">
              <Icon name="copy" size={18} />
            </motion.button>
          )}
        </div>
      </Card>

      <AnimatePresence>
        {analysis && c && (
          <>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-white">Strength</span>
                  <motion.span key={analysis.label} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className={`text-sm font-bold ${c.text}`}>{analysis.label}
                  </motion.span>
                </div>
                <div className="w-full bg-white/[0.04] rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${analysis.score * 10}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-full ${c.bg} rounded-full`}
                  />
                </div>
                <p className="mt-2 text-xs text-surface-600 text-right tabular-nums">{analysis.score} / 10</p>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <h3 className="text-sm font-medium text-white mb-4">Criteria</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    ['Length ≥ 8', analysis.length >= 8],
                    ['Lowercase', analysis.lower],
                    ['Uppercase', analysis.upper],
                    ['Numbers', analysis.number],
                    ['Special chars', analysis.special],
                  ].map(([label, pass]) => (
                    <motion.div key={label} layout
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                        pass ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-white/[0.02] border-white/[0.04]'
                      }`}
                    >
                      <span className="text-sm text-surface-300">{label}</span>
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}
                        className={`text-base ${pass ? 'text-emerald-400' : 'text-surface-700'}`}>
                        {pass ? '✓' : '✗'}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
