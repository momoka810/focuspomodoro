'use client';

import { motion } from 'framer-motion';

interface GeometricArtProps {
  progress: number;
  isActive: boolean;
  isFocus: boolean;
}

export function GeometricArt({ progress, isActive, isFocus }: GeometricArtProps) {
  if (!isActive) return null;

  const circles = [1, 2, 3, 4, 5];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative w-96 h-96">
        {circles.map((circle, index) => {
          const delay = index * 0.2;
          const scale = 0.3 + (progress * 0.7);
          const baseSize = 60 + index * 50;

          return (
            <motion.div
              key={circle}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: isFocus ? [0.1, 0.3, 0.1] : [0.05, 0.15, 0.05],
                scale: scale,
                rotate: progress * 360 * (index % 2 === 0 ? 1 : -1),
              }}
              transition={{
                opacity: {
                  duration: 4 + index,
                  repeat: Infinity,
                  delay: delay,
                  ease: 'easeInOut',
                },
                scale: {
                  duration: 1.5,
                  ease: 'easeOut',
                },
                rotate: {
                  duration: 60 + index * 10,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }}
            >
              <div
                className={`rounded-full border-2 ${
                  isFocus
                    ? 'border-orange-300/40'
                    : 'border-emerald-300/40'
                }`}
                style={{
                  width: baseSize,
                  height: baseSize,
                }}
              />
            </motion.div>
          );
        })}

        {[...Array(12)].map((_, index) => {
          const angle = (index * 30 * Math.PI) / 180;
          const radius = 150 * progress;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={`ripple-${index}`}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                marginLeft: x,
                marginTop: y,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 0.1, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: index * 0.25,
                ease: 'easeInOut',
              }}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isFocus ? 'bg-orange-400' : 'bg-emerald-400'
                }`}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
