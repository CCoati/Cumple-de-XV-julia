'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface BotanicalBranchProps {
  variant: 'top-left' | 'bottom-right' | 'left' | 'right' | 'center-left' | 'center-right';
  className?: string;
  opacity?: number;
  scale?: number;
}

export default function BotanicalBranch({
  variant,
  className = '',
  opacity = 0.6,
  scale = 1,
}: BotanicalBranchProps) {
  const shouldReduceMotion = useReducedMotion();

  const getTransform = () => {
    switch (variant) {
      case 'top-left':
        return { rotate: 0, scaleX: 1 };
      case 'bottom-right':
        return { rotate: 180, scaleX: -1 };
      case 'left':
        return { rotate: -30, scaleX: 1 };
      case 'right':
        return { rotate: 30, scaleX: -1 };
      case 'center-left':
        return { rotate: -15, scaleX: 1 };
      case 'center-right':
        return { rotate: 15, scaleX: -1 };
      default:
        return { rotate: 0, scaleX: 1 };
    }
  };

  const transform = getTransform();

  return (
    <motion.div
      className={`pointer-events-none select-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ duration: 2, ease: 'easeOut' }}
      style={{
        transform: `scale(${scale}) rotate(${transform.rotate}deg) scaleX(${transform.scaleX})`,
      }}
    >
      <motion.svg
        viewBox="0 0 200 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        animate={
          shouldReduceMotion
            ? {}
            : {
                rotate: [0, 1, -1, 0],
              }
        }
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Main stem */}
        <path
          d="M100 280 C100 250, 95 200, 100 150 C105 100, 95 60, 100 20"
          stroke="#7A8B6F"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity={0.7}
        />

        {/* Leaves - left side */}
        <ellipse cx="70" cy="50" rx="25" ry="10" fill="#A3B18A" opacity={0.35}
          transform="rotate(-40 70 50)" />
        <ellipse cx="65" cy="90" rx="22" ry="9" fill="#7A8B6F" opacity={0.3}
          transform="rotate(-35 65 90)" />
        <ellipse cx="70" cy="130" rx="20" ry="8" fill="#8B9D7D" opacity={0.35}
          transform="rotate(-45 70 130)" />
        <ellipse cx="68" cy="170" rx="23" ry="9" fill="#A3B18A" opacity={0.3}
          transform="rotate(-30 68 170)" />
        <ellipse cx="72" cy="210" rx="18" ry="7" fill="#7A8B6F" opacity={0.25}
          transform="rotate(-40 72 210)" />

        {/* Leaves - right side */}
        <ellipse cx="130" cy="70" rx="24" ry="9" fill="#8B9D7D" opacity={0.3}
          transform="rotate(35 130 70)" />
        <ellipse cx="135" cy="110" rx="21" ry="8" fill="#A3B18A" opacity={0.35}
          transform="rotate(40 135 110)" />
        <ellipse cx="128" cy="150" rx="22" ry="9" fill="#7A8B6F" opacity={0.3}
          transform="rotate(30 128 150)" />
        <ellipse cx="132" cy="190" rx="19" ry="8" fill="#8B9D7D" opacity={0.35}
          transform="rotate(45 132 190)" />
        <ellipse cx="125" cy="230" rx="16" ry="7" fill="#A3B18A" opacity={0.25}
          transform="rotate(35 125 230)" />

        {/* Small branch stems */}
        <path d="M100 50 C90 45, 75 48, 70 50" stroke="#7A8B6F" strokeWidth="0.8" fill="none" opacity={0.5} />
        <path d="M100 70 C110 65, 125 68, 130 70" stroke="#7A8B6F" strokeWidth="0.8" fill="none" opacity={0.5} />
        <path d="M100 90 C90 85, 70 88, 65 90" stroke="#7A8B6F" strokeWidth="0.8" fill="none" opacity={0.5} />
        <path d="M100 110 C110 105, 130 108, 135 110" stroke="#7A8B6F" strokeWidth="0.8" fill="none" opacity={0.5} />
        <path d="M100 130 C90 125, 75 128, 70 130" stroke="#7A8B6F" strokeWidth="0.8" fill="none" opacity={0.5} />
        <path d="M100 150 C110 145, 123 148, 128 150" stroke="#7A8B6F" strokeWidth="0.8" fill="none" opacity={0.5} />
        <path d="M100 170 C90 165, 73 168, 68 170" stroke="#7A8B6F" strokeWidth="0.8" fill="none" opacity={0.5} />
        <path d="M100 190 C110 185, 127 188, 132 190" stroke="#7A8B6F" strokeWidth="0.8" fill="none" opacity={0.5} />

        {/* Tiny leaf buds at top */}
        <ellipse cx="95" cy="25" rx="8" ry="4" fill="#A3B18A" opacity={0.4}
          transform="rotate(-20 95 25)" />
        <ellipse cx="108" cy="30" rx="9" ry="4" fill="#8B9D7D" opacity={0.35}
          transform="rotate(25 108 30)" />
      </motion.svg>
    </motion.div>
  );
}
