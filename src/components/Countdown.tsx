'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { eventConfig } from '@/lib/event-config';
import BotanicalWatercolor from '@/components/decorative/BotanicalWatercolor';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const eventDate = new Date(eventConfig.date);
  const now = new Date();
  const diff = eventDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

interface CountdownUnitProps {
  value: number;
  label: string;
  delay: number;
}

function CountdownUnit({ value, label, delay }: CountdownUnitProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.6,
        delay: shouldReduceMotion ? 0 : delay,
      }}
    >
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center bg-white/40 shadow-sm">
        {/* Subtle border */}
        <div className="absolute inset-0 border border-sage-300/35 rounded-sm" />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            className="font-serif text-forest text-2xl sm:text-3xl md:text-4xl tabular-nums"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            {String(value).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2.5 sm:mt-3.5 font-serif text-sage-600 text-xs sm:text-sm tracking-[0.25em] uppercase font-medium">
        {label}
      </span>
    </motion.div>
  );
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 0);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(timer);
    };
  }, []);

  // Prevent hydration mismatch by not rendering until client-side
  if (!timeLeft) {
    return (
      <section id="countdown" className="py-20 sm:py-28 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-serif text-sage-600 text-base sm:text-lg tracking-[0.3em] uppercase mb-12">
            Faltan
          </p>
          <div className="flex justify-center gap-4 sm:gap-6 md:gap-8">
            {['Días', 'Horas', 'Minutos', 'Segundos'].map((label) => (
              <div key={label} className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center border border-sage-300/30 rounded-sm">
                  <span className="font-serif text-forest text-2xl sm:text-3xl md:text-4xl">
                    --
                  </span>
                </div>
                <span className="mt-2.5 sm:mt-3.5 font-serif text-sage-600 text-xs sm:text-sm tracking-[0.25em] uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const units: { value: number; label: string }[] = [
    { value: timeLeft.days, label: 'Días' },
    { value: timeLeft.hours, label: 'Horas' },
    { value: timeLeft.minutes, label: 'Minutos' },
    { value: timeLeft.seconds, label: 'Segundos' },
  ];

  return (
    <section id="countdown" className="relative py-12 sm:py-16 md:py-20 px-6 overflow-hidden">
      {/* Decorative side watercolor sprigs (hidden on mobile to prevent overlapping numbers) */}
      <div className="hidden sm:block absolute top-1/2 -translate-y-1/2 left-2 sm:left-6 w-16 sm:w-24 opacity-35 pointer-events-none">
        <BotanicalWatercolor variant="sprig-left" />
      </div>
      <div className="hidden sm:block absolute top-1/2 -translate-y-1/2 right-2 sm:right-6 w-16 sm:w-24 opacity-35 pointer-events-none">
        <BotanicalWatercolor variant="sprig-right" />
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.div
          className="flex items-center justify-center gap-3 mb-8 sm:mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
        >
          <div className="w-8 sm:w-12 opacity-70">
            <BotanicalWatercolor variant="sprig-left" />
          </div>
          <p className="font-serif text-sage-600 text-sm sm:text-base md:text-lg tracking-[0.3em] uppercase font-medium">
            Faltan
          </p>
          <div className="w-8 sm:w-12 opacity-70">
            <BotanicalWatercolor variant="sprig-right" />
          </div>
        </motion.div>

        <div className="flex justify-center gap-3 sm:gap-6 md:gap-8">
          {units.map((unit, index) => (
            <CountdownUnit
              key={unit.label}
              value={unit.value}
              label={unit.label}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
