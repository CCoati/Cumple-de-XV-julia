'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface OliveSprigProps {
  className?: string;
  variant?: 'branch' | 'cluster' | 'corner' | 'delicate';
  direction?: 'left' | 'right';
  size?: number;
  opacity?: number;
}

export default function OliveSprig({
  className = '',
  variant = 'delicate',
  direction = 'left',
  size = 100,
  opacity = 0.5,
}: OliveSprigProps) {
  const shouldReduceMotion = useReducedMotion();
  const isRight = direction === 'right';
  const scaleX = isRight ? -1 : 1;

  if (variant === 'cluster') {
    return (
      <motion.div
        className={`pointer-events-none select-none inline-block ${className}`}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity }}
        viewport={{ once: true }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.8 }}
        style={{ transform: `scaleX(${scaleX})` }}
      >
        <svg
          width={size}
          height={size * 0.6}
          viewBox="0 0 140 84"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main stem */}
          <path
            d="M10 70 C35 60, 80 40, 130 20"
            stroke="#7A8B6F"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            opacity={0.7}
          />
          {/* Side stem */}
          <path
            d="M50 53 C65 42, 85 45, 105 38"
            stroke="#7A8B6F"
            strokeWidth="0.8"
            strokeLinecap="round"
            fill="none"
            opacity={0.5}
          />
          {/* Olive leaves with layered watercolor shades */}
          <ellipse cx="32" cy="56" rx="14" ry="5.5" fill="#A3B18A" opacity={0.35} transform="rotate(-30 32 56)" />
          <ellipse cx="50" cy="46" rx="13" ry="5" fill="#7A8B6F" opacity={0.3} transform="rotate(-25 50 46)" />
          <ellipse cx="70" cy="38" rx="15" ry="5.5" fill="#8B9D7D" opacity={0.35} transform="rotate(-20 70 38)" />
          <ellipse cx="92" cy="30" rx="14" ry="5" fill="#A3B18A" opacity={0.3} transform="rotate(-15 92 30)" />
          <ellipse cx="114" cy="24" rx="12" ry="4.5" fill="#7A8B6F" opacity={0.35} transform="rotate(-10 114 24)" />
          <ellipse cx="128" cy="18" rx="9" ry="3.5" fill="#8B9D7D" opacity={0.4} transform="rotate(-5 128 18)" />

          {/* Underside leaves */}
          <ellipse cx="42" cy="62" rx="12" ry="4.5" fill="#7A8B6F" opacity={0.25} transform="rotate(25 42 62)" />
          <ellipse cx="64" cy="52" rx="13" ry="5" fill="#A3B18A" opacity={0.3} transform="rotate(20 64 52)" />
          <ellipse cx="85" cy="44" rx="12" ry="4.5" fill="#8B9D7D" opacity={0.25} transform="rotate(15 85 44)" />
          <ellipse cx="106" cy="34" rx="11" ry="4" fill="#A3B18A" opacity={0.3} transform="rotate(10 106 34)" />

          {/* Olive fruits / berries */}
          <ellipse cx="46" cy="58" rx="4" ry="5.5" fill="#5C6B4F" opacity={0.5} transform="rotate(15 46 58)" />
          <ellipse cx="78" cy="46" rx="3.8" ry="5.2" fill="#5C6B4F" opacity={0.45} transform="rotate(-10 78 46)" />
        </svg>
      </motion.div>
    );
  }

  if (variant === 'corner') {
    return (
      <motion.div
        className={`pointer-events-none select-none inline-block ${className}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity }}
        viewport={{ once: true }}
        transition={{ duration: shouldReduceMotion ? 0 : 1 }}
        style={{ transform: `scaleX(${scaleX})` }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Curved arching branch for corners */}
          <path
            d="M15 145 C25 90, 60 35, 145 15"
            stroke="#7A8B6F"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            opacity={0.6}
          />
          {/* Leaves along arch */}
          <ellipse cx="30" cy="115" rx="16" ry="6" fill="#A3B18A" opacity={0.35} transform="rotate(-65 30 115)" />
          <ellipse cx="45" cy="85" rx="15" ry="5.5" fill="#8B9D7D" opacity={0.3} transform="rotate(-55 45 85)" />
          <ellipse cx="68" cy="60" rx="16" ry="6" fill="#7A8B6F" opacity={0.35} transform="rotate(-40 68 60)" />
          <ellipse cx="98" cy="40" rx="15" ry="5.5" fill="#A3B18A" opacity={0.3} transform="rotate(-25 98 40)" />
          <ellipse cx="128" cy="25" rx="14" ry="5" fill="#8B9D7D" opacity={0.35} transform="rotate(-10 128 25)" />

          {/* Inner leaves */}
          <ellipse cx="40" cy="125" rx="13" ry="5" fill="#7A8B6F" opacity={0.25} transform="rotate(35 40 125)" />
          <ellipse cx="58" cy="98" rx="14" ry="5" fill="#A3B18A" opacity={0.3} transform="rotate(45 58 98)" />
          <ellipse cx="82" cy="72" rx="13" ry="4.8" fill="#8B9D7D" opacity={0.25} transform="rotate(55 82 72)" />
          <ellipse cx="112" cy="50" rx="12" ry="4.5" fill="#7A8B6F" opacity={0.3} transform="rotate(65 112 50)" />

          {/* Delicate olives */}
          <ellipse cx="54" cy="90" rx="3.5" ry="5" fill="#5C6B4F" opacity={0.45} transform="rotate(-20 54 90)" />
          <ellipse cx="88" cy="56" rx="3.5" ry="5" fill="#5C6B4F" opacity={0.45} transform="rotate(15 88 56)" />
        </svg>
      </motion.div>
    );
  }

  // default: delicate sprig
  return (
    <motion.div
      className={`pointer-events-none select-none inline-block ${className}`}
      initial={{ opacity: 0, x: isRight ? 10 : -10 }}
      whileInView={{ opacity }}
      viewport={{ once: true }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.8 }}
      style={{ transform: `scaleX(${scaleX})` }}
    >
      <svg
        width={size}
        height={size * 0.45}
        viewBox="0 0 110 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 40 C35 35, 65 25, 100 15"
          stroke="#7A8B6F"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          opacity={0.6}
        />
        {/* Soft olive leaves */}
        <ellipse cx="30" cy="33" rx="12" ry="4.8" fill="#A3B18A" opacity={0.35} transform="rotate(-25 30 33)" />
        <ellipse cx="52" cy="27" rx="13" ry="5" fill="#8B9D7D" opacity={0.3} transform="rotate(-20 52 27)" />
        <ellipse cx="74" cy="21" rx="12" ry="4.8" fill="#7A8B6F" opacity={0.35} transform="rotate(-15 74 21)" />
        <ellipse cx="94" cy="16" rx="9" ry="3.8" fill="#A3B18A" opacity={0.35} transform="rotate(-10 94 16)" />

        {/* Opposite side */}
        <ellipse cx="42" cy="35" rx="10" ry="4.2" fill="#7A8B6F" opacity={0.25} transform="rotate(20 42 35)" />
        <ellipse cx="64" cy="28" rx="11" ry="4.5" fill="#A3B18A" opacity={0.3} transform="rotate(15 64 28)" />
        <ellipse cx="84" cy="22" rx="10" ry="4" fill="#8B9D7D" opacity={0.25} transform="rotate(10 84 22)" />

        {/* Small olive fruit */}
        <ellipse cx="48" cy="33" rx="3" ry="4.2" fill="#5C6B4F" opacity={0.4} transform="rotate(10 48 33)" />
      </svg>
    </motion.div>
  );
}
