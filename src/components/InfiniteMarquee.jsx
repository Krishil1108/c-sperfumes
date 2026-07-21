'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function InfiniteMarquee({ items }) {
  const marqueeItems = [...items, ...items, ...items, ...items];

  return (
    <section className="trust-badges-bar">
      <motion.div
        className="trust-badges-inner"
        animate={{ x: [0, '-25%'] }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 22 }}
        style={{ width: 'max-content', display: 'flex' }}
      >
        {marqueeItems.map((item, idx) => (
          <span key={idx} className="trust-badge-item">
            {item}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
