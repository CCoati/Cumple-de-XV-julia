'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { eventConfig } from '@/lib/event-config';
import BotanicalWatercolor from '@/components/decorative/BotanicalWatercolor';

export default function Introduction() {
  const shouldReduceMotion = useReducedMotion();
  const duration = shouldReduceMotion ? 0 : 0.8;

  return (
    <section
      id="introduction"
      className="relative py-12 sm:py-16 md:py-20 px-6 overflow-hidden"
    >
      {/* Delicate watercolor sprig accents */}
      <div className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-6 w-12 sm:w-16 opacity-40 pointer-events-none">
        <BotanicalWatercolor variant="sprig-left" />
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-6 w-12 sm:w-16 opacity-40 pointer-events-none">
        <BotanicalWatercolor variant="sprig-right" />
      </div>

      <div className="max-w-xl mx-auto text-center">
        {eventConfig.introTexts.map((text, index) => (
          <motion.p
            key={index}
            className={`font-serif text-forest leading-relaxed ${
              index === 0
                ? 'text-xl sm:text-2xl md:text-3xl italic font-normal'
                : index === eventConfig.introTexts.length - 1
                ? 'text-lg sm:text-xl md:text-2xl mt-8 sm:mt-10 text-forest/90'
                : 'text-lg sm:text-xl md:text-2xl mt-6 sm:mt-8 text-forest/90 italic'
            }`}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{
              duration,
              delay: shouldReduceMotion ? 0 : index * 0.3,
              ease: 'easeOut',
            }}
          >
            {text}
          </motion.p>
        ))}
      </div>
    </section>
  );
}

