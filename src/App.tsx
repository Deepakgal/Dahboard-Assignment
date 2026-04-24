'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from '@/src/components/common/Sidebar';
import Header from '@/src/components/common/Header';
import Dashboard from '@/src/views/Dashboard';
import Sessions from '@/src/views/Sessions';
import Marketplace from '@/src/views/Marketplace';
import Settings from '@/src/views/Settings';
import '@/src/styles/global.css';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard />
          </motion.div>
        );
      case 'roadmap':
      case 'session':
        return (
          <motion.div
            key="sessions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Sessions />
          </motion.div>
        );
      case 'marketplace':
        return (
          <motion.div
            key="marketplace"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Marketplace />
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Settings />
          </motion.div>
        );
      default:
        return (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>{activeView.toUpperCase()}</h2>
            <p style={{ color: 'var(--text-muted)' }}>This section is coming soon! Our team is hard at work building this feature for you.</p>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        activeView={activeView} 
        onNavigate={(view) => {
          setActiveView(view);
          setIsSidebarOpen(false); // Close on navigate for mobile
        }} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="main-content">
        <Header onMenuClick={toggleSidebar} />
        <div className="content-wrapper">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}


