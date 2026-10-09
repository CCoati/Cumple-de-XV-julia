'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { eventConfig } from '@/lib/event-config';
import BotanicalWatercolor from '@/components/decorative/BotanicalWatercolor';
import HeartDivider from '@/components/decorative/HeartDivider';
import { SparkleGroup } from '@/components/decorative/Sparkle';

export default function ClosingSection() {
  const shouldReduceMotion = useReducedMotion();
  const duration = shouldReduceMotion ? 0 : 0.8;

  return (
    <section
      id="closing"
      className="relative py-14 sm:py-20 md:py-24 px-6 overflow-hidden"
    >
      {/* Authentic Watercolor Botanical decorations */}
      <div className="absolute top-6 sm:top-8 right-0 w-28 sm:w-40 md:w-48 opacity-50 pointer-events-none">
        <BotanicalWatercolor variant="top-left" className="scale-x-[-1]" />
      </div>
      <div className="absolute bottom-6 sm:bottom-8 left-0 w-28 sm:w-40 md:w-48 opacity-50 pointer-events-none">
        <BotanicalWatercolor variant="bottom-right" className="scale-x-[-1]" />
      </div>

      {/* Sparkles */}
      <SparkleGroup count={5} />

      <div className="relative z-10 max-w-lg mx-auto text-center">
        {eventConfig.closingTexts.map((text, index) => (
          <motion.p
            key={index}
            className={`font-serif text-forest italic leading-relaxed ${
              index === 0
                ? 'text-xl sm:text-2xl md:text-3xl'
                : 'text-lg sm:text-xl md:text-2xl mt-4 sm:mt-5 text-forest/90'
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration, delay: shouldReduceMotion ? 0 : index * 0.3 }}
          >
            {text}
          </motion.p>
        ))}

        <motion.div
          className="mt-8 sm:mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration, delay: 0.6 }}
        >
          <HeartDivider className="mb-6 sm:mb-8" />
        </motion.div>

        {/* Signature with authentic watercolor sprigs flanking */}
        <div className="relative inline-flex items-center justify-center py-2">
          <div className="hidden sm:block absolute -left-16 top-1/2 -translate-y-1/2 w-14 opacity-80 pointer-events-none">
            <BotanicalWatercolor variant="sprig-left" />
          </div>

          <motion.h2
            className="font-script text-forest text-7xl sm:text-8xl md:text-9xl mb-2 px-6"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration, delay: 0.8 }}
          >
            {eventConfig.shortName}
          </motion.h2>

          <div className="hidden sm:block absolute -right-16 top-1/2 -translate-y-1/2 w-14 opacity-80 pointer-events-none">
            <BotanicalWatercolor variant="sprig-right" />
          </div>
        </div>

        <motion.p
          className="font-serif text-sage-600 text-base sm:text-lg md:text-xl tracking-[0.25em] font-medium mt-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration, delay: 1 }}
        >
          {eventConfig.displayDate}
        </motion.p>

        {/* Footer */}
        <motion.div
          className="mt-20 pt-8 border-t border-sage-200/40"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration, delay: 1.2 }}
        >
          <p className="font-serif text-sage-500 text-xs sm:text-sm tracking-[0.25em] uppercase font-medium">
            Con todo nuestro cariño
          </p>
        </motion.div>
      </div>
    </section>
  );
}
