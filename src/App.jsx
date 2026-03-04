import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Nav from './components/Nav';
import Hero from './components/Hero';
import ChooseDashboard from './components/ChooseDashboard';
import Toast from './components/Toast';

import GeneratorTab from './tabs/GeneratorTab';
import HMACTab from './tabs/HMACTab';
import CompareTab from './tabs/CompareTab';
import IntegrityTab from './tabs/IntegrityTab';
import EncodeTab from './tabs/EncodeTab';
import PasswordTab from './tabs/PasswordTab';
import ToolsTab from './tabs/ToolsTab';
import BatchTab from './tabs/BatchTab';
import IdentifyTab from './tabs/IdentifyTab';

const TAB_IDS = ['generator', 'hmac', 'compare', 'integrity', 'encode', 'password', 'tools', 'batch', 'identify'];

export default function App() {
  const [tab, setTab] = useState('home');
  const [toastMsg, setToastMsg] = useState(null);

  const toast = useCallback((msg, type = 'success') => {
    setToastMsg({ msg, type, id: Date.now() });
  }, []);

  /* Keyboard shortcuts: 1-9 for tabs, Escape to go back */
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      if (e.key === 'Escape') { setTab(tab === 'home' ? 'home' : 'choose'); return; }
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 9) setTab(TAB_IDS[num - 1]);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [tab]);

  const renderTab = () => {
    switch (tab) {
      case 'home':      return <Hero key="hero" onStart={() => setTab('choose')} />;
      case 'choose':    return <ChooseDashboard key="choose" setTab={setTab} />;
      case 'generator': return <GeneratorTab key="gen" toast={toast} />;
      case 'hmac':      return <HMACTab key="hmac" toast={toast} />;
      case 'compare':   return <CompareTab key="cmp" toast={toast} />;
      case 'integrity': return <IntegrityTab key="int" toast={toast} />;
      case 'encode':    return <EncodeTab key="enc" toast={toast} />;
      case 'password':  return <PasswordTab key="pwd" toast={toast} />;
      case 'tools':     return <ToolsTab key="tools" toast={toast} />;
      case 'batch':     return <BatchTab key="batch" toast={toast} />;
      case 'identify':  return <IdentifyTab key="id" toast={toast} />;
      default:          return <Hero key="hero" onStart={() => setTab('choose')} />;
    }
  };

  const isToolTab = TAB_IDS.includes(tab);

  return (
    <div className="mesh-gradient min-h-screen relative">
      <div className="noise" />

      {/* Navigation — only when not on the hero/home */}
      <AnimatePresence>
        {tab !== 'home' && <Nav tab={tab} setTab={setTab} />}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && <Toast key={toastMsg.id} message={toastMsg.msg} type={toastMsg.type} onDone={() => setToastMsg(null)} />}
      </AnimatePresence>

      {/* Page content */}
      <main className={tab !== 'home' ? 'pt-20 pb-12 px-4' : ''}>
        <div className={isToolTab ? 'max-w-2xl mx-auto' : ''}>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25, ease: 'easeInOut' }}>
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
