'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface LeafSprigProps {
  className?: string;
  direction?: 'left' | 'right';
  size?: number;
}

export default function LeafSprig({
  className = '',
  direction = 'left',
  size = 80,
}: LeafSprigProps) {
  const shouldReduceMotion = useReducedMotion();
  const flip = direction === 'right' ? -1 : 1;

  return (
    <motion.div
      className={`pointer-events-none select-none inline-block ${className}`}
      initial={{ opacity: 0, x: flip * -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: shouldReduceMotion ? 0 : 1 }}
      style={{ transform: `scaleX(${flip})` }}
    >
      <svg
        width={size}
        height={size * 0.5}
        viewBox="0 0 120 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stem */}
        <path
          d="M10 50 C30 45, 70 30, 110 25"
          stroke="#7A8B6F"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          opacity={0.6}
        />
        {/* Leaves */}
        <ellipse cx="35" cy="38" rx="14" ry="6" fill="#A3B18A" opacity={0.3}
          transform="rotate(-25 35 38)" />
        <ellipse cx="55" cy="32" rx="12" ry="5" fill="#8B9D7D" opacity={0.35}
          transform="rotate(-20 55 32)" />
        <ellipse cx="75" cy="28" rx="13" ry="5" fill="#A3B18A" opacity={0.3}
          transform="rotate(-15 75 28)" />
        <ellipse cx="95" cy="25" rx="10" ry="4" fill="#7A8B6F" opacity={0.35}
          transform="rotate(-10 95 25)" />
        {/* Upper leaves */}
        <ellipse cx="45" cy="38" rx="11" ry="5" fill="#7A8B6F" opacity={0.25}
          transform="rotate(20 45 38)" />
        <ellipse cx="68" cy="30" rx="10" ry="4" fill="#8B9D7D" opacity={0.3}
          transform="rotate(15 68 30)" />
        <ellipse cx="88" cy="26" rx="9" ry="4" fill="#A3B18A" opacity={0.25}
          transform="rotate(10 88 26)" />
      </svg>
    </motion.div>
  );
}
