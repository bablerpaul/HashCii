import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../components/Icon';
import { Card, FileDropzone, ErrorBanner, TabHeader, Spinner } from '../components/Shared';
import { ALGORITHMS } from '../utils/constants';
import { computeHash, readFile } from '../utils/crypto';

export default function IntegrityTab({ toast }) {
  const [file, setFile] = useState(null);
  const [expected, setExpected] = useState('');
  const [algo, setAlgo] = useState('SHA-256');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verify = async () => {
    try {
      setError('');
      if (!file || !expected) { setError('Select a file and enter expected hash'); return; }
      setLoading(true);
      const data = await readFile(file);
      const computed = computeHash(data, algo);
      const match = computed.toLowerCase() === expected.toLowerCase().trim();
      setResult({ computed, match });
      toast(match ? 'Verified!' : 'Mismatch', match ? 'success' : 'error');
    } catch (e) {
      setError(e.message || 'Verification failed');
      toast(e.message || 'Error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <TabHeader icon="shield" title="Verify Integrity" color="emerald" />
      <AnimatePresence>{error && <ErrorBanner error={error} />}</AnimatePresence>

      <Card>
        <label className="text-sm font-medium text-surface-300 mb-3 block">Select File</label>
        <FileDropzone onFile={setFile} file={file} />
      </Card>
      <Card>
        <label className="text-sm font-medium text-surface-300 mb-3 block">Expected Hash</label>
        <textarea value={expected} onChange={e => { setExpected(e.target.value); setError(''); }} placeholder="Paste expected hash..."
          className="input-field h-20 resize-none" />
      </Card>
      <Card>
        <label className="text-sm font-medium text-surface-300 mb-3 block">Algorithm</label>
        <select value={algo} onChange={e => setAlgo(e.target.value)} className="input-field cursor-pointer font-sans">
          {ALGORITHMS.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
        </select>
      </Card>

      <motion.button whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }} onClick={verify} disabled={loading}
        className="btn-primary w-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center gap-2 shadow-emerald-600/25 disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? <Spinner /> : <Icon name="shield" size={20} />} Verify
      </motion.button>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className={result.match ? 'border-emerald-500/20' : 'border-red-500/20'}>
              <div className="flex items-center gap-3 mb-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${result.match ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                  <Icon name={result.match ? 'check' : 'x'} size={24} className={result.match ? 'text-emerald-400' : 'text-red-400'} />
                </motion.div>
                <div>
                  <p className={`font-bold text-lg ${result.match ? 'text-emerald-400' : 'text-red-400'}`}>
                    {result.match ? 'Integrity Verified' : 'Integrity Failed'}
                  </p>
                  <p className="text-xs text-surface-500">{result.match ? 'File hash matches expected value' : 'File hash does not match'}</p>
                </div>
              </div>
              <div className="hash-output text-surface-400">
                <span className="text-surface-600 text-xs">Computed: </span>{result.computed}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
