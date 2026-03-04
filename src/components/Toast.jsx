import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';

export default function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`fixed bottom-6 right-6 z-[9999] px-5 py-3.5 rounded-2xl flex items-center gap-3 shadow-2xl backdrop-blur-xl max-w-sm border ${
          type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          type === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'
        }`}>
          <Icon name={type === 'success' ? 'check' : 'x'} size={16} />
        </div>
        <span className="text-sm font-medium">{message}</span>
      </motion.div>
    </AnimatePresence>
  );
}
