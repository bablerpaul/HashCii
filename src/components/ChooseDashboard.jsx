import React from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';
import { TOOL_CARDS } from '../utils/constants';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 200 } },
};

export default function ChooseDashboard({ setTab }) {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient opacity-40" />

      <div className="max-w-6xl w-full relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, delay: 0.1 }}
            className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent-500 to-purple-600 flex items-center justify-center shadow-lg shadow-accent-600/20"
          >
            <Icon name="sparkle" size={26} className="text-white" />
          </motion.div>
          <h1 className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight mb-4">
            <span className="gradient-text">CHOOSE</span>
          </h1>
          <p className="text-surface-400 text-lg max-w-md mx-auto">Select a cryptographic tool to begin</p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {TOOL_CARDS.map((tool) => (
            <motion.button
              key={tool.id}
              variants={item}
              whileHover={{ scale: 1.03, y: -6 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTab(tool.id)}
              className="glass-card p-6 text-left cursor-pointer group relative overflow-hidden"
            >
              {/* Glow on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />

              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                <Icon name={tool.icon} size={24} className="text-white" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:gradient-text transition-all duration-300">
                {tool.name}
              </h3>
              <p className="text-sm text-surface-500 group-hover:text-surface-400 transition-colors leading-relaxed">
                {tool.desc}
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-surface-600 group-hover:text-accent-400 transition-colors">
                <span className="w-5 h-5 rounded bg-white/[0.04] flex items-center justify-center font-mono text-[10px]">{tool.shortcut}</span>
                <span>Press to open</span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
