import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';

const BROWSER_ICONS = {
  msedge: '🌐',
  chrome: '🔵',
  'google chrome': '🔵',
  'google-chrome': '🔵',
  firefox: '🦊',
  brave: '🦁',
  'brave-browser': '🦁',
  'brave browser': '🦁',
  opera: '🔴',
  safari: '🧭',
  'chromium-browser': '🌐',
  'windows-default': '💻',
  'mac-default': '💻',
  'linux-default': '💻',
};

export default function BrowserSelector({ isOpen, onClose, toast }) {
  const [browsers, setBrowsers] = useState([]);
  const [currentBrowser, setCurrentBrowser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    Promise.all([
      fetch('/api/browsers', { signal: controller.signal }).then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      }),
      fetch('/api/browser-preference', { signal: controller.signal }).then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      }),
    ])
      .then(([browserList, pref]) => {
        setBrowsers(browserList);
        setCurrentBrowser(pref.browser);
        setLoading(false);
      })
      .catch(() => {
        setError(
          'Browser selection is available when running via the launcher (start.bat / start.sh). Use "python create_shortcut.py" to create a desktop shortcut.'
        );
        setLoading(false);
      });

    return () => { clearTimeout(timeout); controller.abort(); };
  }, [isOpen]);

  const selectBrowser = async (browserId) => {
    setSaving(true);
    try {
      const res = await fetch('/api/browser-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ browser: browserId }),
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setCurrentBrowser(data.browser);
      const label = browsers.find((b) => b.id === browserId)?.label || browserId;
      toast(`Browser set to ${label}`, 'success');
    } catch {
      toast('Failed to save browser preference', 'error');
    }
    setSaving(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card p-6 max-w-lg w-full relative z-10 max-h-[80vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-purple-600 flex items-center justify-center shadow-lg shadow-accent-600/20">
                <Icon name="globe" size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Select Browser</h2>
                <p className="text-sm text-surface-500">Choose your preferred browser for HashCii</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <Icon name="x" size={18} className="text-surface-400" />
            </button>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-surface-500">Detecting browsers...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-12">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Icon name="tools" size={24} className="text-amber-400" />
              </div>
              <p className="text-surface-400 text-sm max-w-sm mx-auto">{error}</p>
            </div>
          )}

          {/* Browser list */}
          {!loading && !error && (
            <div className="space-y-2">
              {browsers.map((browser) => (
                <motion.button
                  key={browser.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => selectBrowser(browser.id)}
                  disabled={saving}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                    currentBrowser === browser.id
                      ? 'border-accent-500/40 bg-accent-500/10 shadow-lg shadow-accent-500/10'
                      : 'border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03]'
                  } ${saving ? 'opacity-60 cursor-wait' : 'cursor-pointer'}`}
                >
                  <span className="text-2xl w-10 h-10 flex items-center justify-center rounded-lg bg-white/[0.04]">
                    {BROWSER_ICONS[browser.id] || '🌐'}
                  </span>
                  <div className="flex-1 text-left">
                    <p className={`font-medium ${currentBrowser === browser.id ? 'text-white' : 'text-surface-300'}`}>
                      {browser.label}
                    </p>
                    <p className="text-xs text-surface-600 font-mono">{browser.id}</p>
                  </div>
                  {currentBrowser === browser.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center flex-shrink-0"
                    >
                      <Icon name="check" size={14} className="text-white" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          )}

          {/* Footer note */}
          {!loading && !error && (
            <p className="text-xs text-surface-600 mt-5 text-center leading-relaxed">
              Your selection will be used the next time you launch HashCii
              from the desktop shortcut.
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
