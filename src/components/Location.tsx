'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { eventConfig } from '@/lib/event-config';
import BotanicalWatercolor from '@/components/decorative/BotanicalWatercolor';

export default function Location() {
  const shouldReduceMotion = useReducedMotion();
  const duration = shouldReduceMotion ? 0 : 0.7;
  const hasLocation = Boolean(eventConfig.venue.mapsUrl && eventConfig.venue.mapsUrl.length > 0);

  return (
    <section id="location" className="relative py-12 sm:py-16 md:py-20 px-6 overflow-hidden">
      {/* Delicate side watercolor sprigs */}
      <div className="hidden sm:block absolute top-1/2 -translate-y-1/2 left-2 sm:left-6 w-14 sm:w-20 opacity-40 pointer-events-none">
        <BotanicalWatercolor variant="sprig-left" />
      </div>
      <div className="hidden sm:block absolute top-1/2 -translate-y-1/2 right-2 sm:right-6 w-14 sm:w-20 opacity-40 pointer-events-none">
        <BotanicalWatercolor variant="sprig-right" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration }}
        >
          <div className="flex items-center justify-center gap-3 mb-2.5">
            <div className="w-8 sm:w-10 opacity-70">
              <BotanicalWatercolor variant="sprig-left" />
            </div>
            <p className="font-serif text-sage-600 text-xs sm:text-sm tracking-[0.3em] uppercase font-medium">
              Ubicación
            </p>
            <div className="w-8 sm:w-10 opacity-70">
              <BotanicalWatercolor variant="sprig-right" />
            </div>
          </div>
          <h2 className="font-serif text-forest text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">
            ¿Dónde nos encontramos?
          </h2>
          <p className="font-serif text-sage-600 text-sm sm:text-base md:text-lg italic max-w-md mx-auto">
            Te esperamos para compartir una noche mágica e inolvidable.
          </p>
        </motion.div>

        {/* Main Card with Venue Info & Map */}
        <motion.div
          className="relative bg-ivory-50/80 border border-sage-300/40 rounded-sm overflow-hidden shadow-sm transition-all duration-300 hover:border-sage-400/60 hover:shadow-md"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration, delay: 0.2 }}
        >
          {/* Top Venue Header */}
          <div className="p-6 sm:p-8 text-center bg-white/70 border-b border-sage-200/40">
            {/* Map Pin Badge */}
            <div className="w-11 h-11 mx-auto mb-3.5 rounded-full bg-sage-100/60 border border-sage-300/35 flex items-center justify-center text-forest shadow-xs">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>

            <h3 className="font-serif text-forest text-2xl sm:text-3xl font-medium mb-2 tracking-wide">
              {eventConfig.venue.name}
            </h3>
            <p className="font-serif text-sage-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              {eventConfig.venue.address}
            </p>

            {hasLocation && (
              <div className="mt-5">
                <a
                  href={eventConfig.venue.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2.5 px-7 sm:px-9 py-3 sm:py-3.5 bg-forest text-ivory font-serif text-xs sm:text-sm tracking-[0.22em] uppercase rounded-sm border border-forest transition-all duration-300 hover:bg-forest/90 hover:shadow-lg hover:shadow-forest/15 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  {/* Google Maps Pin Icon */}
                  <svg
                    className="w-4 h-4 text-sage-300 transition-transform duration-300 group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>Cómo llegar con Maps</span>
                </a>
              </div>
            )}
          </div>

          {/* Interactive Map Embed */}
          <div className="w-full h-64 sm:h-80 md:h-96 bg-sage-100/30 relative">
            {eventConfig.venue.mapsEmbedUrl ? (
              <iframe
                src={eventConfig.venue.mapsEmbedUrl}
                className="w-full h-full border-0 grayscale-[15%] contrast-[105%] transition-all duration-700 hover:grayscale-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación del evento en Google Maps"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-center px-6">
                <div>
                  <svg
                    className="w-10 h-10 mx-auto mb-3 text-sage-400/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                    />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <p className="font-serif text-sage-400 text-sm italic">
                    Ubicación a confirmar
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

