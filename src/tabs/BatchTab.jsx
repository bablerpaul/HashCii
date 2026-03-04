import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../components/Icon';
import { Card, FileDropzone, ErrorBanner, TabHeader, Spinner } from '../components/Shared';
import { ALGORITHMS } from '../utils/constants';
import { computeHash, readFile, formatSize, copyToClipboard, sanitize } from '../utils/crypto';

export default function BatchTab({ toast }) {
  const [files, setFiles] = useState([]);
  const [algo, setAlgo] = useState('SHA-256');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const process = async () => {
    try {
      setError('');
      if (files.length === 0) { setError('Select at least one file'); return; }
      setLoading(true);
      const res = [];
      for (const f of files) {
        try {
          const data = await readFile(f);
          res.push({ name: f.name, size: f.size, hash: computeHash(data, algo), ok: true });
        } catch (e) {
          res.push({ name: f.name, size: f.size, hash: e.message, ok: false });
        }
      }
      setResults(res);
      toast(`Processed ${files.length} files`, 'success');
    } catch (e) {
      setError(e.message || 'Processing failed');
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    const text = results.filter(r => r.ok).map(r => `${r.name}: ${r.hash}`).join('\n');
    copyToClipboard(text).then(() => toast('Copied all', 'success')).catch(() => toast('Copy failed', 'error'));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <TabHeader icon="folder" title="Batch Processing" color="violet" />
      <AnimatePresence>{error && <ErrorBanner error={error} />}</AnimatePresence>

      <Card>
        <label className="text-sm font-medium text-surface-300 mb-3 block">Select Files</label>
        <FileDropzone onFile={setFiles} file={files.length > 0 ? files : null} multiple />
      </Card>
      <Card>
        <label className="text-sm font-medium text-surface-300 mb-3 block">Algorithm</label>
        <select value={algo} onChange={e => setAlgo(e.target.value)} className="input-field cursor-pointer font-sans">
          {ALGORITHMS.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
        </select>
      </Card>

      <motion.button whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }} onClick={process} disabled={loading}
        className="btn-primary w-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center gap-2 shadow-violet-600/25 disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? <Spinner /> : <Icon name="folder" size={20} />} Process Files
      </motion.button>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-white">Results ({results.length})</span>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={copyAll}
                  className="text-xs text-accent-400 hover:text-accent-300 flex items-center gap-1.5 transition-colors">
                  <Icon name="copy" size={14} /> Copy All
                </motion.button>
              </div>
              <div className="space-y-2.5 max-h-72 overflow-auto">
                {results.map((r, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className={`rounded-xl p-3 border ${r.ok ? 'bg-surface-950/80 border-white/[0.04]' : 'bg-red-500/5 border-red-500/15'}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon name="file" size={14} className="text-surface-500" />
                      <span className="text-sm font-medium text-white truncate">{sanitize(r.name)}</span>
                      <span className="text-xs text-surface-600 ml-auto flex-shrink-0">{formatSize(r.size)}</span>
                    </div>
                    <div className={`font-mono text-xs break-all ${r.ok ? 'text-violet-400' : 'text-red-400'}`}>{r.hash}</div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
