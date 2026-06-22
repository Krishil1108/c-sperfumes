'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function InfiniteMarquee({ items }) {
  // Duplicate items to ensure smooth infinite scroll
  const marqueeItems = [...items, ...items, ...items, ...items];

  return (
    <section className="trust-badges-bar overflow-hidden py-4 bg-[var(--color-primary)]">
      <div className="flex whitespace-nowrap">
        <motion.div
          className="flex items-center gap-8 md:gap-16 pr-8 md:pr-16"
          animate={{ x: [0, -1035] }} // Adjust width based on total items
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20
          }}
          style={{ width: "max-content", display: "flex" }}
        >
          {marqueeItems.map((item, idx) => (
            <div key={idx} className="text-[var(--color-accent)] font-medium tracking-widest text-xs uppercase interactive-hover shrink-0">
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
