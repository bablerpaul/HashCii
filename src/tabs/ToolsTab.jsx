import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../components/Icon';
import { Card, TabHeader } from '../components/Shared';
import { MAX_TEXT_LENGTH } from '../utils/constants';
import { copyToClipboard } from '../utils/crypto';

export default function ToolsTab({ toast }) {
  const [uuid, setUuid] = useState('');
  const [textInput, setTextInput] = useState('');
  const [stats, setStats] = useState(null);

  const generateUUID = () => {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    const id = `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
    setUuid(id);
    toast('UUID generated', 'success');
  };

  const copyUuid = () => copyToClipboard(uuid).then(() => toast('Copied', 'success')).catch(() => toast('Copy failed', 'error'));

  const analyzeText = (text) => {
    if (!text) { setStats(null); return; }
    setStats({
      chars: text.length,
      noSpace: text.replace(/\s/g, '').length,
      words: text.trim() ? text.trim().split(/\s+/).length : 0,
      lines: text.split('\n').length,
      bytes: new Blob([text]).size,
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <TabHeader icon="tools" title="Utilities" color="cyan" />

      {/* UUID */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Icon name="refresh" size={16} className="text-cyan-400" />
          <h3 className="text-sm font-medium text-white">UUID v4 Generator</h3>
        </div>
        <div className="flex gap-2">
          <input type="text" value={uuid} readOnly placeholder="Click generate..."
            className="input-field text-cyan-400 flex-1" />
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={generateUUID}
            className="btn-primary bg-gradient-to-r from-cyan-500 to-teal-500 shadow-cyan-600/20 text-sm px-5">
            Generate
          </motion.button>
          {uuid && (
            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={copyUuid} className="px-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-surface-400">
              <Icon name="copy" size={18} />
            </motion.button>
          )}
        </div>
      </Card>

      {/* Text stats */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Icon name="text" size={16} className="text-cyan-400" />
          <h3 className="text-sm font-medium text-white">Text Statistics</h3>
        </div>
        <textarea value={textInput} onChange={e => { setTextInput(e.target.value); analyzeText(e.target.value); }}
          placeholder="Paste text to analyze..."
          className="input-field h-24 resize-none" maxLength={MAX_TEXT_LENGTH} />
        {stats && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-5 gap-2.5 mt-4">
            {[
              ['Chars', stats.chars], ['No Space', stats.noSpace], ['Words', stats.words], ['Lines', stats.lines], ['Bytes', stats.bytes],
            ].map(([label, val]) => (
              <div key={label} className="bg-surface-950/80 rounded-xl p-3 text-center border border-white/[0.04]">
                <div className="text-lg font-bold text-cyan-400 tabular-nums">{val.toLocaleString()}</div>
                <div className="text-[10px] text-surface-600 uppercase tracking-widest mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
