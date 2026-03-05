import React from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';

const letters = 'HashCii'.split('');

export default function Hero({ onStart }) {

  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 mesh-gradient opacity-60" />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent-600/20 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/[0.03] rounded-full"
      />

      <div className="text-center relative z-10 max-w-3xl">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
          className="w-20 h-20 mx-auto mb-10 rounded-2xl bg-gradient-to-br from-accent-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-accent-600/30 animate-float"
        >
          <Icon name="lock" size={36} className="text-white" />
        </motion.div>

        {/* Title */}
        <h1 className="font-display leading-none mb-6" style={{ fontSize: 'clamp(5rem, 15vw, 12rem)', letterSpacing: '-0.06em' }}>
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07, type: 'spring', damping: 20, stiffness: 150 }}
              className="inline-block gradient-text"
            >
              {letter}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="text-lg text-surface-400 max-w-lg mx-auto leading-relaxed mb-10"
        >
          Professional cryptographic toolkit for secure hashing, encoding, and verification — all running locally in your browser.
        </motion.p>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex flex-wrap gap-2 justify-center mb-12"
        >
          {['Hash Generation', 'HMAC', 'Integrity', 'Encoding', 'Password Lab', 'Batch Processing'].map((f, i) => (
            <motion.span
              key={f}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + i * 0.06 }}
              className="tag"
            >
              {f}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, type: 'spring', damping: 15 }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="btn-primary bg-gradient-to-r from-accent-600 to-purple-600 shadow-accent-600/30 hover:shadow-accent-500/50"
        >
          <span className="flex items-center gap-3">
            Get Started
            <Icon name="arrow" size={18} />
          </span>
        </motion.button>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-20 flex justify-center gap-16"
        >
          {[['9+', 'Algorithms'], ['7', 'Tools'], ['100%', 'Client-side']].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold gradient-text font-display">{num}</div>
              <div className="text-xs text-surface-500 mt-1 uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
