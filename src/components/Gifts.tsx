'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { eventConfig } from '@/lib/event-config';

export default function Gifts() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const duration = shouldReduceMotion ? 0 : 0.6;

  const { gifts } = eventConfig;
  const { bankDetails } = gifts;

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2500);
  };

  return (
    <section id="regalos" className="relative py-12 sm:py-16 md:py-20 px-6 overflow-hidden">
      {/* Top-Left Star Sparkles */}
      <motion.div
        className="absolute top-6 sm:top-10 left-6 sm:left-16 w-10 sm:w-14 pointer-events-none z-10 opacity-70"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 0.75, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration, delay: 0.2 }}
      >
        <svg viewBox="0 0 100 100" fill="#7A8B6F" className="w-full h-full">
          <path d="M50 0 Q50 50, 100 50 Q50 50, 50 100 Q50 50, 0 50 Q50 50, 50 0 Z" />
          <path d="M85 10 Q85 25, 100 25 Q85 25, 85 40 Q85 25, 70 25 Q85 25, 85 10 Z" transform="scale(0.5) translate(80, 20)" />
        </svg>
      </motion.div>

      {/* Bottom-Right Star Sparkles */}
      <motion.div
        className="absolute bottom-6 sm:bottom-10 right-6 sm:right-16 w-10 sm:w-14 pointer-events-none z-10 opacity-70"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 0.75, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration, delay: 0.3 }}
      >
        <svg viewBox="0 0 100 100" fill="#7A8B6F" className="w-full h-full">
          <path d="M50 0 Q50 50, 100 50 Q50 50, 50 100 Q50 50, 0 50 Q50 50, 50 0 Z" />
          <path d="M25 80 Q25 90, 35 90 Q25 90, 25 100 Q25 90, 15 90 Q25 90, 25 80 Z" transform="scale(0.4) translate(-10, 80)" />
        </svg>
      </motion.div>

      <div className="max-w-xl mx-auto text-center relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration }}
          className="mb-8"
        >
          {/* Gift Icon */}
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-sage-100/50 border border-sage-300/30 flex items-center justify-center text-sage-600">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 12 20 22 4 22 4 12" />
              <rect x="2" y="7" width="20" height="5" />
              <line x1="12" y1="22" x2="12" y2="7" />
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
          </div>

          <p className="font-serif text-sage-600 text-xs sm:text-sm tracking-[0.3em] uppercase mb-2.5 font-medium">
            {gifts.subtitle}
          </p>
          <h2 className="font-serif text-forest text-2xl sm:text-3xl md:text-4xl mb-3">
            {gifts.title}
          </h2>
          <p className="font-serif text-sage-600 text-base sm:text-lg leading-relaxed max-w-lg mx-auto italic">
            {gifts.message}
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration, delay: 0.2 }}
        >
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative inline-flex items-center justify-center gap-3 px-9 sm:px-12 py-3.5 sm:py-4 bg-forest text-ivory font-serif text-xs sm:text-sm tracking-[0.25em] uppercase rounded-sm border border-forest transition-all duration-300 hover:bg-forest/90 hover:shadow-lg hover:shadow-forest/15 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <svg
              className="w-4 h-4 text-sage-300 transition-transform duration-300 group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <polyline points="20 12 20 22 4 22 4 12" />
              <rect x="2" y="7" width="20" height="5" />
              <line x1="12" y1="22" x2="12" y2="7" />
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
            <span className="font-medium">{gifts.buttonText}</span>
          </button>
        </motion.div>
      </div>

      {/* Bank Details Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-forest/40 backdrop-blur-sm transition-opacity"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative w-full max-w-lg bg-ivory border border-sage-300/40 rounded-sm p-6 sm:p-8 shadow-2xl z-10 my-8"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 text-sage-400 hover:text-forest transition-colors rounded-sm"
                aria-label="Cerrar ventana"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Content Header */}
              <div className="text-center mb-6 pt-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-sage-400 text-xs">✦</span>
                  <span className="font-serif text-sage-500 text-xs tracking-[0.25em] uppercase font-medium">
                    Datos de Cuenta
                  </span>
                  <span className="text-sage-400 text-xs">✦</span>
                </div>
                <h3 className="font-serif text-forest text-xl sm:text-2xl">
                  Transferencia Bancaria
                </h3>
              </div>

              {/* Bank Details List */}
              <div className="space-y-4 bg-white/80 border border-sage-200/70 rounded-md p-4 sm:p-6 shadow-xs">
                {/* Account Holder */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-sage-100 text-left gap-1">
                  <span className="font-serif text-sage-600 text-xs uppercase tracking-[0.18em] font-medium">
                    Titular de las cuentas
                  </span>
                  <span className="font-serif text-forest text-sm sm:text-base font-semibold">
                    {bankDetails.holder}
                  </span>
                </div>

                {/* BROU Card */}
                <div className="p-3.5 bg-[#FAF8F5] border border-sage-200/80 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-forest" />
                      <span className="font-serif text-forest text-xs uppercase tracking-[0.16em] font-semibold">
                        {bankDetails.brou.bankName}
                      </span>
                    </div>
                    <span className="font-serif text-sage-500 text-[11px] block mb-0.5">
                      Número de cuenta:
                    </span>
                    <span className="font-mono text-forest text-sm sm:text-base font-bold select-all tracking-wide">
                      {bankDetails.brou.accountNumber}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(bankDetails.brou.accountNumber, 'brou')}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white border border-sage-300 rounded font-serif text-xs text-forest tracking-wider uppercase transition-all hover:bg-sage-50 hover:border-forest/60 active:scale-95 shadow-2xs whitespace-nowrap"
                  >
                    {copiedField === 'brou' ? (
                      <>
                        <svg className="w-3.5 h-3.5 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="font-semibold text-forest">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        <span>Copiar BROU</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Prex Card */}
                <div className="p-3.5 bg-[#FAF8F5] border border-sage-200/80 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#7A8B6F]" />
                      <span className="font-serif text-forest text-xs uppercase tracking-[0.16em] font-semibold">
                        {bankDetails.prex.provider}
                      </span>
                    </div>
                    <span className="font-serif text-sage-500 text-[11px] block mb-0.5">
                      Número de cuenta Prex:
                    </span>
                    <span className="font-mono text-forest text-sm sm:text-base font-bold select-all tracking-wide">
                      {bankDetails.prex.accountNumber}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(bankDetails.prex.accountNumber, 'prex')}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white border border-sage-300 rounded font-serif text-xs text-forest tracking-wider uppercase transition-all hover:bg-sage-50 hover:border-forest/60 active:scale-95 shadow-2xs whitespace-nowrap"
                  >
                    {copiedField === 'prex' ? (
                      <>
                        <svg className="w-3.5 h-3.5 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="font-semibold text-forest">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        <span>Copiar Prex</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Note */}
              <p className="mt-4 text-center font-serif text-sage-600 text-xs italic">
                {bankDetails.note}
              </p>

              {/* Close Button at bottom */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 border border-sage-300/40 rounded-sm font-serif text-xs text-sage-600 tracking-[0.15em] uppercase hover:bg-sage-50 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
