'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { eventConfig } from '@/lib/event-config';
import BotanicalWatercolor from '@/components/decorative/BotanicalWatercolor';

interface DetailCardProps {
  icon: React.ReactNode;
  category: string;
  primaryText: string;
  secondaryText?: string;
  delay: number;
}

function DetailCard({ icon, category, primaryText, secondaryText, delay }: DetailCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="group relative bg-ivory-50/70 border border-sage-300/35 rounded-sm p-6 sm:p-8 text-center transition-all duration-500 hover:border-sage-400/60 hover:bg-white/80 hover:shadow-md hover:shadow-forest/5 hover:-translate-y-1"
      initial={{ opacity: 0, y: 25, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.6,
        delay: shouldReduceMotion ? 0 : delay,
      }}
    >
      {/* Delicate inner hairline frame */}
      <div className="absolute inset-2 border border-sage-200/30 rounded-sm pointer-events-none transition-colors duration-300 group-hover:border-sage-300/40" />

      {/* Ornate corner ticks */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-sage-400/40 pointer-events-none" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-sage-400/40 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-sage-400/40 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-sage-400/40 pointer-events-none" />

      {/* Circular icon badge */}
      <div className="relative mx-auto mb-4 w-12 h-12 rounded-full bg-sage-100/60 border border-sage-300/30 flex items-center justify-center text-sage-600 transition-all duration-300 group-hover:bg-forest group-hover:text-ivory group-hover:scale-105 shadow-sm">
        {icon}
      </div>

      {/* Category / Subtitle */}
      <p className="font-serif text-sage-600 text-xs sm:text-sm tracking-[0.3em] uppercase mb-2 font-medium">
        {category}
      </p>

      {/* Primary Value */}
      <h3 className="font-serif text-forest text-lg sm:text-xl md:text-2xl font-medium leading-snug mb-1">
        {primaryText}
      </h3>

      {/* Secondary Context Note (if any) */}
      {secondaryText && (
        <p className="font-serif text-sage-600 text-sm sm:text-base italic mt-1">
          {secondaryText}
        </p>
      )}
    </motion.div>
  );
}

/* Linear SVG Icons */
const CalendarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SparklesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
  </svg>
);

export default function EventDetails() {
  const shouldReduceMotion = useReducedMotion();

  const details = [
    {
      icon: <CalendarIcon />,
      category: 'Fecha',
      primaryText: '28 de noviembre de 2026',
      secondaryText: 'Sábado',
    },
    {
      icon: <ClockIcon />,
      category: 'Horario',
      primaryText: eventConfig.time,
      secondaryText: 'Puntualidad agradecida',
    },
    {
      icon: <MapPinIcon />,
      category: 'Lugar',
      primaryText: eventConfig.venue.name,
      secondaryText: 'Sant\'Ana do Livramento, RS',
    },
    {
      icon: <SparklesIcon />,
      category: 'Dress Code',
      primaryText: eventConfig.dressCode,
      secondaryText: 'Elegante',
    },
  ];

  return (
    <section id="event-details" className="relative py-12 sm:py-16 md:py-20 px-6 overflow-hidden">
      {/* Delicate side watercolor sprigs */}
      <div className="hidden sm:block absolute top-1/2 -translate-y-1/2 left-2 sm:left-6 w-14 sm:w-20 opacity-40 pointer-events-none">
        <BotanicalWatercolor variant="sprig-left" />
      </div>
      <div className="hidden sm:block absolute top-1/2 -translate-y-1/2 right-2 sm:right-6 w-14 sm:w-20 opacity-40 pointer-events-none">
        <BotanicalWatercolor variant="sprig-right" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-2.5">
            <div className="w-8 sm:w-10 opacity-70">
              <BotanicalWatercolor variant="sprig-left" />
            </div>
            <p className="font-serif text-sage-600 text-xs sm:text-sm tracking-[0.3em] uppercase font-medium">
              Detalles
            </p>
            <div className="w-8 sm:w-10 opacity-70">
              <BotanicalWatercolor variant="sprig-right" />
            </div>
          </div>
          <h2 className="font-serif text-forest text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">
            Información del evento
          </h2>
          <p className="font-serif text-sage-600 text-sm sm:text-base md:text-lg italic max-w-lg mx-auto">
            Todo lo que necesitás saber para ser parte de una noche inolvidable.
          </p>
        </motion.div>

        {/* 2x2 Elevated Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {details.map((detail, index) => (
            <DetailCard
              key={detail.category}
              icon={detail.icon}
              category={detail.category}
              primaryText={detail.primaryText}
              secondaryText={detail.secondaryText}
              delay={index * 0.12}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
