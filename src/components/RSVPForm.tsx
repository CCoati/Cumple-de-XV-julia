'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import type { RSVPFormData, RSVPFormStatus } from '@/types/rsvp';
import BotanicalWatercolor from '@/components/decorative/BotanicalWatercolor';
import HeartDivider from '@/components/decorative/HeartDivider';
import { saveRSVPToSupabase, isSupabaseConfigured } from '@/lib/supabase';

const initialFormData: RSVPFormData = {
  fullName: '',
  cedula: '',
  phone: '',
  attending: 'yes',
  guestCount: 0,
  guestNames: [],
  dietaryNotes: '',
  message: '',
};

export default function RSVPForm() {
  const shouldReduceMotion = useReducedMotion();
  const duration = shouldReduceMotion ? 0 : 0.6;

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState<RSVPFormData>(initialFormData);
  const [status, setStatus] = useState<RSVPFormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef<HTMLDivElement>(null);
  const isSubmittingRef = useRef<boolean>(false);

  const updateField = useCallback(
    <K extends keyof RSVPFormData>(field: K, value: RSVPFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleOpenForm = () => {
    setIsFormVisible(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 150);
  };


  const validate = (): string | null => {
    const trimmedName = formData.fullName.trim();
    if (!trimmedName) {
      return 'Por favor, ingresá tu nombre y apellido.';
    }
    if (trimmedName.length < 2) {
      return 'El nombre y apellido debe contener al menos 2 caracteres.';
    }
    if (trimmedName.length > 100) {
      return 'El nombre no puede superar los 100 caracteres.';
    }

    const trimmedPhone = formData.phone.trim();
    if (!trimmedPhone) {
      return 'Por favor, ingresá tu número de teléfono o WhatsApp.';
    }
    if (trimmedPhone.length < 6) {
      return 'El teléfono debe contener al menos 6 caracteres.';
    }
    if (trimmedPhone.length > 30) {
      return 'El teléfono no puede superar los 30 caracteres.';
    }

    const trimmedCedula = formData.cedula.trim();
    if (!trimmedCedula) {
      return 'Por favor, ingresá tu cédula de identidad.';
    }
    if (trimmedCedula.length < 4) {
      return 'La cédula de identidad debe contener al menos 4 caracteres.';
    }
    if (trimmedCedula.length > 30) {
      return 'La cédula de identidad no puede superar los 30 caracteres.';
    }


    if (formData.dietaryNotes && formData.dietaryNotes.length > 500) {
      return 'Las preferencias de alimentación no pueden superar los 500 caracteres.';
    }

    if (formData.message && formData.message.length > 500) {
      return 'El mensaje no puede superar los 500 caracteres.';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bloqueo inmediato para evitar doble envío por múltiples clics
    if (isSubmittingRef.current || status === 'loading') {
      return;
    }

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      setStatus('error');
      return;
    }

    isSubmittingRef.current = true;
    setStatus('loading');
    setErrorMessage('');

    try {
      let savedToSupabase = false;

      // 1. Guardar en Supabase (tabla 'confirmaciones')
      if (isSupabaseConfigured) {
        const supabaseResult = await saveRSVPToSupabase(formData);
        if (supabaseResult.success) {
          savedToSupabase = true;
        } else {
          console.error('Error guardando en Supabase:', supabaseResult.error);
          throw new Error(
            supabaseResult.error || 'No se pudo guardar la confirmación en la base de datos.'
          );
        }
      }

      // 2. Notificación por correo como respaldo / aviso instantáneo
      let emailNotificationSent = false;
      try {
        const res = await fetch('https://formsubmit.co/ajax/jviera97@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            _subject: `🎉 Nueva Confirmación - 15 de Julia (${formData.fullName})`,
            _template: 'table',
            _captcha: 'false',
            'Nombre y Apellido': formData.fullName,
            'Cédula de Identidad': formData.cedula.trim(),
            'Teléfono / WhatsApp': formData.phone,
            '¿Asiste?': formData.attending === 'yes' ? 'Sí, voy a estar' : 'No voy a poder',
            'Preferencia de alimentación / Alergias':
              formData.attending === 'yes'
                ? formData.dietaryNotes?.trim() || 'Ninguna'
                : 'No asiste',
            'Mensaje o Deseo': formData.message.trim() || 'Sin mensaje adicional',
          }),
        });
        if (res.ok) emailNotificationSent = true;
      } catch {
        // Ignorar falla de red secundaria hacia formsubmit
      }

      if (!emailNotificationSent && !savedToSupabase) {
        try {
          const fallbackRes = await fetch('/api/rsvp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
          if (fallbackRes.ok) emailNotificationSent = true;
        } catch {
          // Ignorar falla de red hacia api local
        }
      }

      // Confirmación exitosa si se guardó en Supabase o en respaldo
      if (savedToSupabase || emailNotificationSent || !isSupabaseConfigured) {
        setStatus('success');
      } else {
        throw new Error('No se pudo registrar la confirmación en el servidor.');
      }
    } catch (error) {
      console.error('Error al procesar confirmación:', error);
      setErrorMessage(
        'No pudimos registrar tu confirmación en este momento. Por favor verificá tu conexión e intentá de nuevo.'
      );
      setStatus('error');
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const inputClasses =
    'w-full bg-white/80 border border-sage-300/40 rounded-sm px-4 py-3.5 font-serif text-forest text-base placeholder:text-sage-400/60 transition-all duration-300 focus:outline-none focus:border-sage-500 focus:bg-white focus:ring-1 focus:ring-sage-300/30';

  return (
    <section id="rsvp" className="relative py-12 sm:py-16 md:py-20 px-6 overflow-hidden">
      {/* Delicate side watercolor sprigs */}
      <div className="hidden sm:block absolute top-1/2 -translate-y-1/2 left-2 sm:left-6 w-14 sm:w-20 opacity-40 pointer-events-none">
        <BotanicalWatercolor variant="sprig-left" />
      </div>
      <div className="hidden sm:block absolute top-1/2 -translate-y-1/2 right-2 sm:right-6 w-14 sm:w-20 opacity-40 pointer-events-none">
        <BotanicalWatercolor variant="sprig-right" />
      </div>

      <div className="max-w-md sm:max-w-lg mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-8 sm:mb-10"
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
              Confirmación
            </p>
            <div className="w-8 sm:w-10 opacity-70">
              <BotanicalWatercolor variant="sprig-right" />
            </div>
          </div>
          <h2 className="font-serif text-forest text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">
            ¿Nos acompañás?
          </h2>
          <p className="font-serif text-sage-600 text-sm sm:text-base md:text-lg italic">
            Queremos compartir este momento tan especial con vos.
          </p>
        </motion.div>

        {/* Prominent CTA Trigger Button when form is hidden */}
        {!isFormVisible && status !== 'success' && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration, delay: 0.15 }}
          >
            <div className="bg-ivory-50/70 border border-sage-300/40 rounded-sm p-8 sm:p-12 shadow-sm transition-all duration-300 hover:border-sage-400/60 hover:shadow-md">
              <p className="font-serif text-forest text-lg sm:text-xl mb-8 leading-relaxed max-w-md mx-auto">
                Por favor, confirmá tu asistencia hasta el 10 de noviembre para organizar cada detalle de esta noche mágica.
              </p>

              <button
                type="button"
                onClick={handleOpenForm}
                className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 sm:px-14 py-4 sm:py-4.5 bg-forest text-ivory font-serif text-xs sm:text-sm tracking-[0.25em] uppercase rounded-sm border border-forest shadow-md transition-all duration-300 hover:bg-forest/90 hover:shadow-xl hover:shadow-forest/15 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <svg
                  className="w-4 h-4 text-sage-300 transition-transform duration-300 group-hover:scale-125"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                <span className="font-medium">Confirmar Asistencia</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Revealed Form Container */}
        <div ref={formRef}>
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                className="text-center py-12 bg-ivory-50/70 border border-sage-300/40 rounded-sm p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Checkmark animation */}
                <motion.div
                  className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-sage-400/50 flex items-center justify-center bg-sage-50"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                >
                  <motion.svg
                    className="w-8 h-8 text-sage-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    />
                  </motion.svg>
                </motion.div>

                <motion.h3
                  className="font-script text-forest text-4xl sm:text-5xl mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  ¡Gracias!
                </motion.h3>

                <motion.p
                  className="font-serif text-sage-600 text-sm sm:text-base italic mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  {formData.attending === 'yes'
                    ? 'Nos alegra muchísimo saber que vas a acompañarnos.'
                    : 'Lamentamos que no puedas acompañarnos. ¡Te vamos a extrañar!'}
                </motion.p>

                <HeartDivider />
              </motion.div>
            ) : isFormVisible ? (
              <motion.div
                key="form-container"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="bg-ivory-50/70 border border-sage-300/40 rounded-sm p-6 sm:p-8 shadow-sm"
              >
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-sage-200/40">
                  <span className="font-serif text-sage-600 text-xs tracking-[0.2em] uppercase">
                    Completá tus datos
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsFormVisible(false)}
                    className="font-serif text-sage-400 hover:text-forest text-xs tracking-wider uppercase transition-colors"
                  >
                    Ocultar
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="rsvp-name"
                      className="block font-serif text-sage-600 text-xs tracking-[0.2em] uppercase mb-2"
                    >
                      Nombre y apellido <span className="text-sage-400">*</span>
                    </label>
                    <input
                      id="rsvp-name"
                      type="text"
                      className={inputClasses}
                      placeholder="Tu nombre completo"
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      maxLength={100}
                      required
                    />
                  </div>

                  {/* Cédula de Identidad */}
                  <div>
                    <label
                      htmlFor="rsvp-cedula"
                      className="block font-serif text-sage-600 text-xs tracking-[0.2em] uppercase mb-2"
                    >
                      Cédula de identidad <span className="text-sage-400">*</span>
                    </label>
                    <input
                      id="rsvp-cedula"
                      type="text"
                      className={inputClasses}
                      placeholder="Ej: 1.234.567-8"
                      value={formData.cedula}
                      onChange={(e) => updateField('cedula', e.target.value)}
                      maxLength={30}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="rsvp-phone"
                      className="block font-serif text-sage-600 text-xs tracking-[0.2em] uppercase mb-2"
                    >
                      Teléfono <span className="text-sage-400">*</span>
                    </label>
                    <input
                      id="rsvp-phone"
                      type="tel"
                      className={inputClasses}
                      placeholder="Tu número de teléfono o WhatsApp"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      maxLength={30}
                      required
                    />
                  </div>

                  {/* Attending */}
                  <div>
                    <p className="font-serif text-sage-600 text-xs tracking-[0.2em] uppercase mb-3">
                      ¿Vas a asistir? <span className="text-sage-400">*</span>
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'yes' as const, label: 'Sí, voy a estar' },
                        { value: 'no' as const, label: 'No voy a poder' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => updateField('attending', option.value)}
                          className={`px-4 py-3 border rounded-sm font-serif text-sm transition-all duration-300 ${
                            formData.attending === option.value
                              ? 'border-sage-500/60 bg-sage-100/60 text-forest font-medium shadow-sm'
                              : 'border-sage-300/30 bg-white/40 text-sage-500 hover:border-sage-400/40'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preferencias de alimentación o alergias */}
                  {formData.attending === 'yes' && (
                    <div>
                      <label
                        htmlFor="rsvp-dietary"
                        className="block font-serif text-sage-600 text-xs tracking-[0.2em] uppercase mb-2"
                      >
                        Preferencia en la alimentación o alergia{' '}
                        <span className="text-sage-400/60 text-[10px] lowercase">(opcional)</span>
                      </label>
                      <input
                        id="rsvp-dietary"
                        type="text"
                        className={inputClasses}
                        placeholder="Ej: Celíaco/a, vegetariano/a, intolerancia a la lactosa, alergia a nueces..."
                        value={formData.dietaryNotes || ''}
                        maxLength={200}
                        onChange={(e) => updateField('dietaryNotes', e.target.value)}
                      />
                      <p className="font-serif text-sage-500 text-[11px] mt-1.5 italic">
                        Contanos si tenés alguna necesidad o restricción alimentaria.
                      </p>
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="rsvp-message"
                      className="block font-serif text-sage-600 text-xs tracking-[0.2em] uppercase mb-2"
                    >
                      Mensaje <span className="text-sage-400/60 text-[10px]">(opcional)</span>
                    </label>
                    <textarea
                      id="rsvp-message"
                      rows={3}
                      className={`${inputClasses} resize-none`}
                      placeholder="¿Querés dejarnos algún mensaje o deseo?"
                      value={formData.message}
                      maxLength={500}
                      onChange={(e) => updateField('message', e.target.value)}
                    />
                  </div>

                  {/* Error state */}
                  <AnimatePresence>
                    {status === 'error' && errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-red-50/60 border border-red-200/50 rounded-sm px-4 py-3 text-center"
                      >
                        <p className="font-serif text-red-600/90 text-sm">{errorMessage}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-3.5 bg-forest text-ivory font-serif text-sm tracking-[0.2em] uppercase rounded-sm transition-all duration-300 hover:bg-forest/90 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                      {status === 'loading' ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Enviando confirmación...
                        </span>
                      ) : (
                        'Enviar confirmación'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
