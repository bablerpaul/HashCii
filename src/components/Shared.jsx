import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';
import { formatSize } from '../utils/crypto';
import { sanitize } from '../utils/crypto';

export function Card({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-card p-5 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function FileDropzone({ onFile, file, multiple = false }) {
  const ref = useRef(null);
  const [drag, setDrag] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const files = Array.from(e.dataTransfer.files);
    if (!multiple && files.length > 0) onFile(files[0]);
    else if (multiple) onFile(files);
  };

  const handleInput = (e) => {
    const files = Array.from(e.target.files || []);
    if (!multiple && files.length > 0) onFile(files[0]);
    else if (multiple) onFile(files);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => ref.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-500 group ${
        drag
          ? 'border-accent-500/60 bg-accent-500/5 scale-[1.01]'
          : 'border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02]'
      }`}
    >
      <input type="file" ref={ref} onChange={handleInput} multiple={multiple} className="hidden" />
      <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
        drag ? 'bg-accent-500/20 text-accent-400' : 'bg-white/[0.04] text-surface-500 group-hover:text-surface-300'
      }`}>
        <Icon name="upload" size={26} />
      </div>
      {file ? (
        <p className="text-sm text-accent-400 font-medium">
          {multiple && Array.isArray(file) ? `${file.length} file(s) selected` : `${sanitize(file.name)} · ${formatSize(file.size)}`}
        </p>
      ) : (
        <>
          <p className="text-sm text-surface-400">
            Drop files here or <span className="text-accent-400 font-medium">browse</span>
          </p>
          <p className="text-xs text-surface-600 mt-1">Max 500 MB per file</p>
        </>
      )}
    </motion.div>
  );
}

export function ErrorBanner({ error }) {
  if (!error) return null;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
    >
      <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
        <Icon name="x" size={14} />
      </div>
      {error}
    </motion.div>
  );
}

export function TabHeader({ icon, title, color = 'accent' }) {
  const colorMap = {
    accent: 'bg-accent-600/15 text-accent-400',
    amber: 'bg-amber-500/15 text-amber-400',
    blue: 'bg-blue-500/15 text-blue-400',
    emerald: 'bg-emerald-500/15 text-emerald-400',
    purple: 'bg-purple-500/15 text-purple-400',
    pink: 'bg-pink-500/15 text-pink-400',
    cyan: 'bg-cyan-500/15 text-cyan-400',
    violet: 'bg-violet-500/15 text-violet-400',
    orange: 'bg-orange-500/15 text-orange-400',
  };

  return (
    <div className="flex items-center gap-3 mb-8">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorMap[color] || colorMap.accent}`}>
        <Icon name={icon} size={22} />
      </div>
      <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
    </div>
  );
}

export function Spinner() {
  return (
    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
