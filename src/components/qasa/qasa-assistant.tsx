"use client";

import { useState } from 'react';
import { QasaOrb } from './qasa-orb';
import { QasaChat } from './qasa-chat';
import { AnimatePresence, motion } from 'framer-motion';

export function QasaAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <QasaOrb onClick={() => setIsOpen(true)} />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <QasaChat onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
