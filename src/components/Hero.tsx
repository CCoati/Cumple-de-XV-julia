'use client';

import { motion, useReducedMotion } from 'framer-motion';
import BotanicalWatercolor from '@/components/decorative/BotanicalWatercolor';
import OrnamentalFrame from '@/components/decorative/OrnamentalFrame';

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const duration = shouldReduceMotion ? 0 : 1;

  const scrollToNext = () => {
    document.getElementById('introduction')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-svh flex flex-col items-center justify-between overflow-hidden py-8 sm:py-10 md:py-12 px-4 sm:px-6"
    >
      {/* Authentic luxury scalloped frame */}
      <OrnamentalFrame />

      {/* Top-Left Authentic Watercolor Foliage */}
      <motion.div
        className="absolute top-2 sm:top-6 left-2 sm:left-6 w-24 sm:w-36 md:w-48 lg:w-56 max-w-[28vw] pointer-events-none z-20"
        initial={{ opacity: 0, y: -20, x: -20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: duration * 1.2, delay: 0.2 }}
      >
        <BotanicalWatercolor variant="top-left" opacity={0.92} />
      </motion.div>

      {/* Bottom-Right Authentic Watercolor Foliage */}
      <motion.div
        className="absolute bottom-2 sm:bottom-6 right-2 sm:right-6 w-24 sm:w-36 md:w-48 lg:w-56 max-w-[28vw] pointer-events-none z-20"
        initial={{ opacity: 0, y: 20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: duration * 1.2, delay: 0.4 }}
      >
        <BotanicalWatercolor variant="bottom-right" opacity={0.92} />
      </motion.div>

      {/* Top-Right Star Sparkles */}
      <motion.div
        className="absolute top-6 sm:top-12 right-6 sm:right-14 w-10 sm:w-14 pointer-events-none z-10 opacity-70"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.75, scale: 1 }}
        transition={{ duration, delay: 0.6 }}
      >
        <svg viewBox="0 0 100 100" fill="#7A8B6F" className="w-full h-full">
          <path d="M50 0 Q50 50, 100 50 Q50 50, 50 100 Q50 50, 0 50 Q50 50, 50 0 Z" />
          <path d="M85 10 Q85 25, 100 25 Q85 25, 85 40 Q85 25, 70 25 Q85 25, 85 10 Z" transform="scale(0.5) translate(80, 20)" />
        </svg>
      </motion.div>

      {/* Bottom-Left Star Sparkles */}
      <motion.div
        className="absolute bottom-8 sm:bottom-14 left-6 sm:left-14 w-9 sm:w-12 pointer-events-none z-10 opacity-70"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.75, scale: 1 }}
        transition={{ duration, delay: 0.8 }}
      >
        <svg viewBox="0 0 100 100" fill="#7A8B6F" className="w-full h-full">
          <path d="M50 0 Q50 50, 100 50 Q50 50, 50 100 Q50 50, 0 50 Q50 50, 50 0 Z" />
          <path d="M25 80 Q25 90, 35 90 Q25 90, 25 100 Q25 90, 15 90 Q25 90, 25 80 Z" transform="scale(0.4) translate(-10, 80)" />
        </svg>
      </motion.div>

      {/* Top spacing spacer */}
      <div className="w-full h-1 sm:h-2" />

      {/* Main Content Card with elegant balanced vertical spacing */}
      <div className="relative z-10 text-center px-4 py-3 sm:py-6 max-w-md mx-auto flex flex-col items-center justify-center my-auto">
        {/* Centerpiece: XV + Juli + Flanking Watercolor Sprigs */}
        <motion.div
          className="relative my-2 sm:my-3 w-full flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: duration * 1.2, delay: 0.3, ease: 'easeOut' }}
        >
          <div className="w-60 sm:w-72 md:w-80 max-w-[85vw] mx-auto py-1">
            <BotanicalWatercolor variant="centerpiece" opacity={0.98} />
          </div>
        </motion.div>

        {/* Divider with heart */}
        <motion.div
          className="flex items-center justify-center gap-3 w-44 sm:w-60 my-2 sm:my-3"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration, delay: 0.5 }}
        >
          <div className="flex-1 h-px bg-sage-300/60" />
          <span className="text-sage-500 text-xs">♥</span>
          <div className="flex-1 h-px bg-sage-300/60" />
        </motion.div>

        {/* Date in tracked clean style */}
        <motion.p
          className="font-serif text-sage-800 text-sm sm:text-base md:text-lg tracking-[0.3em] uppercase mb-1.5 sm:mb-2 font-medium"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: 0.7 }}
        >
          28 DE NOVIEMBRE, 2026
        </motion.p>

        {/* Centered tiny heart */}
        <motion.div
          className="text-sage-400 text-xs mb-2 sm:mb-2.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration, delay: 0.8 }}
        >
          ♥
        </motion.div>

        {/* Bottom invitation quote */}
        <motion.p
          className="font-serif text-sage-600 text-xs sm:text-sm tracking-[0.18em] uppercase max-w-xs sm:max-w-md mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: 0.9 }}
        >
          Los momentos más lindos son los que compartimos
        </motion.p>
      </div>

      {/* Elegant Scroll invitation CTA with generous clearance above the bottom border */}
      <motion.div
        className="relative z-20 pb-3 sm:pb-5 text-center mt-2 sm:mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: 1.5 }}
      >
        <button
          type="button"
          onClick={scrollToNext}
          className="group inline-flex flex-col items-center gap-1.5 px-5 py-2 rounded-full bg-ivory-50/80 border border-sage-300/45 shadow-xs backdrop-blur-[2px] transition-all duration-300 hover:bg-white hover:border-sage-400/70 hover:shadow-sm cursor-pointer"
        >
          <span className="font-serif text-forest text-[11px] sm:text-xs tracking-[0.22em] uppercase font-medium">
            Descubrí la invitación
          </span>
          <motion.svg
            animate={shouldReduceMotion ? {} : { y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-3.5 h-3.5 text-sage-500 transition-colors group-hover:text-forest"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </button>
      </motion.div>
    </section>
  );
}

