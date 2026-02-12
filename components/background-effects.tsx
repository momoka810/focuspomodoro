'use client';

import { motion } from 'framer-motion';

export function BackgroundEffects() {
  const particles = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-purple-950/20" />

      {particles.map((i) => {
        const delay = i * 0.5;
        const duration = 15 + Math.random() * 10;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const scale = 0.3 + Math.random() * 0.7;

        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
              scale: [scale, scale * 1.5, scale],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: 'easeInOut',
            }}
          />
        );
      })}

      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_50%)]" />
    </div>
  );
}
