'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface SparkleProps {
  className?: string;
  size?: number;
  color?: string;
  delay?: number;
}

export default function Sparkle({
  className = '',
  size = 16,
  color = '#7A8B6F',
  delay = 0,
}: SparkleProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`pointer-events-none select-none ${className}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={
        shouldReduceMotion
          ? { opacity: 0.5, scale: 1 }
          : {
              opacity: [0, 0.6, 0.3, 0.7, 0],
              scale: [0.5, 1, 0.8, 1.1, 0.5],
            }
      }
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 4-pointed star / sparkle */}
        <path
          d="M12 0 C12 0, 13.5 9, 12 12 C12 12, 9 13.5, 0 12 C0 12, 9 10.5, 12 12 C12 12, 10.5 0, 12 0 Z"
          fill={color}
          opacity={0.7}
        />
        <path
          d="M12 24 C12 24, 10.5 15, 12 12 C12 12, 15 10.5, 24 12 C24 12, 15 13.5, 12 12 C12 12, 13.5 24, 12 24 Z"
          fill={color}
          opacity={0.7}
        />
      </svg>
    </motion.div>
  );
}

/**
 * A group of sparkles distributed for a section
 */
interface SparkleGroupProps {
  count?: number;
  className?: string;
}

export function SparkleGroup({ count = 5, className = '' }: SparkleGroupProps) {
  const positions = [
    { top: '10%', left: '15%', size: 14, delay: 0 },
    { top: '20%', right: '12%', size: 10, delay: 1.5 },
    { top: '65%', left: '8%', size: 12, delay: 0.8 },
    { top: '75%', right: '18%', size: 16, delay: 2 },
    { top: '45%', left: '85%', size: 11, delay: 1.2 },
    { top: '30%', left: '5%', size: 13, delay: 2.5 },
    { top: '85%', right: '8%', size: 9, delay: 0.5 },
    { top: '50%', right: '5%', size: 15, delay: 1.8 },
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {positions.slice(0, count).map((pos, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: pos.top,
            left: 'left' in pos ? pos.left : undefined,
            right: 'right' in pos ? pos.right : undefined,
          }}
        >
          <Sparkle size={pos.size} delay={pos.delay} />
        </div>
      ))}
    </div>
  );
}
