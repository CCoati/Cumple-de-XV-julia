'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface SectionDividerProps {
  className?: string;
  variant?: 'dots' | 'botanical' | 'line';
}

export default function SectionDivider({
  className = '',
  variant = 'dots',
}: SectionDividerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (variant === 'line') {
    return (
      <motion.div
        className={`flex justify-center ${className}`}
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.8 }}
      >
        <div className="w-24 h-px bg-sage-300/30" />
      </motion.div>
    );
  }

  if (variant === 'botanical') {
    return (
      <motion.div
        className={`flex justify-center ${className}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: shouldReduceMotion ? 0 : 1 }}
      >
        <svg width="120" height="30" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Left branch */}
          <path d="M10 15 C20 15, 40 15, 55 15" stroke="#A3B18A" strokeWidth="0.6" fill="none" opacity={0.4} />
          <ellipse cx="20" cy="12" rx="8" ry="3.5" fill="#A3B18A" opacity={0.2} transform="rotate(-20 20 12)" />
          <ellipse cx="35" cy="11" rx="7" ry="3" fill="#8B9D7D" opacity={0.2} transform="rotate(-15 35 11)" />
          <ellipse cx="25" cy="18" rx="7" ry="3" fill="#7A8B6F" opacity={0.15} transform="rotate(20 25 18)" />
          <ellipse cx="42" cy="18" rx="6" ry="2.5" fill="#A3B18A" opacity={0.2} transform="rotate(15 42 18)" />
          
          {/* Center element */}
          <circle cx="60" cy="15" r="2" fill="#A3B18A" opacity={0.3} />
          
          {/* Right branch (mirrored) */}
          <path d="M65 15 C80 15, 100 15, 110 15" stroke="#A3B18A" strokeWidth="0.6" fill="none" opacity={0.4} />
          <ellipse cx="100" cy="12" rx="8" ry="3.5" fill="#A3B18A" opacity={0.2} transform="rotate(20 100 12)" />
          <ellipse cx="85" cy="11" rx="7" ry="3" fill="#8B9D7D" opacity={0.2} transform="rotate(15 85 11)" />
          <ellipse cx="95" cy="18" rx="7" ry="3" fill="#7A8B6F" opacity={0.15} transform="rotate(-20 95 18)" />
          <ellipse cx="78" cy="18" rx="6" ry="2.5" fill="#A3B18A" opacity={0.2} transform="rotate(-15 78 18)" />
        </svg>
      </motion.div>
    );
  }

  // dots variant (default)
  return (
    <motion.div
      className={`flex items-center justify-center gap-2 ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.8 }}
    >
      <div className="w-1 h-1 rounded-full bg-sage-400/40" />
      <div className="w-1.5 h-1.5 rounded-full bg-sage-400/50" />
      <div className="w-1 h-1 rounded-full bg-sage-400/40" />
    </motion.div>
  );
}
