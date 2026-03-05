import React from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';

const tabs = [
  { id: 'generator', label: 'Hash', icon: 'hash' },
  { id: 'hmac', label: 'HMAC', icon: 'key' },
  { id: 'compare', label: 'Compare', icon: 'compare' },
  { id: 'integrity', label: 'Verify', icon: 'shield' },
  { id: 'encode', label: 'Encode', icon: 'code' },
  { id: 'password', label: 'Password', icon: 'lock' },
  { id: 'tools', label: 'Tools', icon: 'tools' },
  { id: 'batch', label: 'Batch', icon: 'folder' },
  { id: 'identify', label: 'Identify', icon: 'search' },
];

export default function Nav({ tab, setTab, onOpenBrowserSettings }) {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 inset-x-0 z-40 glass"
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setTab('choose')}
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500 to-purple-600 flex items-center justify-center shadow-lg shadow-accent-600/20 group-hover:shadow-accent-500/40 transition-shadow">
            <Icon name="lock" size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight gradient-text font-display">HashCii</span>
        </motion.button>

        {/* Tabs + Settings */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5 bg-white/[0.02] p-1 rounded-xl border border-white/[0.04]">
            {tabs.map(t => (
              <motion.button
                key={t.id}
                whileHover={{ scale: tab === t.id ? 1 : 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setTab(t.id)}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors duration-200 ${
                  tab === t.id ? 'text-white' : 'text-surface-500 hover:text-surface-300'
                }`}
              >
                {tab === t.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-accent-600 rounded-lg shadow-lg shadow-accent-600/25"
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon name={t.icon} size={16} />
                  <span className="hidden md:inline">{t.label}</span>
                </span>
              </motion.button>
            ))}
          </div>

          {/* Browser settings */}
          <motion.button
            whileHover={{ scale: 1.08, rotate: 30 }}
            whileTap={{ scale: 0.92 }}
            onClick={onOpenBrowserSettings}
            className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.06] transition-all group"
            title="Browser settings"
          >
            <Icon name="settings" size={17} className="text-surface-500 group-hover:text-accent-400 transition-colors" />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
