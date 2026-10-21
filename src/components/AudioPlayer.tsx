'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eventConfig } from '@/lib/event-config';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInteractedRef = useRef<boolean>(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4;

    const handleCanPlay = () => {
      setIsLoaded(true);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Intentar reproducción automática
    const attemptPlay = () => {
      if (hasInteractedRef.current) return;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            hasInteractedRef.current = true;
          })
          .catch(() => {
            // Autoplay bloqueado por políticas del navegador; se activará con la primera interacción
            setIsPlaying(false);
          });
      }
    };

    // Intento inmediato al cargar
    attemptPlay();

    // Eventos de primera interacción del usuario en la pantalla
    const onUserInteraction = () => {
      if (!hasInteractedRef.current && audio.paused) {
        attemptPlay();
      }
      removeListeners();
    };

    const removeListeners = () => {
      window.removeEventListener('click', onUserInteraction);
      window.removeEventListener('touchstart', onUserInteraction);
      window.removeEventListener('scroll', onUserInteraction);
    };

    window.addEventListener('click', onUserInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', onUserInteraction, { once: true, passive: true });
    window.addEventListener('scroll', onUserInteraction, { once: true, passive: true });

    // Mostrar brevemente un aviso al inicio
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(true);
      const hideTimer = setTimeout(() => setShowTooltip(false), 5000);
      return () => clearTimeout(hideTimer);
    }, 1200);

    return () => {
      clearTimeout(tooltipTimer);
      removeListeners();
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    hasInteractedRef.current = true;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.log('Error al reproducir audio:', err));
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={encodeURI(eventConfig.music.src)}
        loop
        preload="auto"
      />

      {/* Botón flotante de reproducción en esquina inferior derecha */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 select-none">
        {/* Tooltip informativo inicial o en hover */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 border border-sage-300/70 shadow-md text-forest text-xs font-serif backdrop-blur-sm pointer-events-none"
            >
              <span className="w-2 h-2 rounded-full bg-sage-400 animate-pulse" />
              <span>
                {isPlaying ? 'Reproduciendo:' : 'Música:'}{' '}
                <strong className="font-medium">{eventConfig.music.title}</strong>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botón interactivo principal */}
        <motion.button
          type="button"
          onClick={togglePlay}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label={isPlaying ? 'Pausar música de fondo' : 'Reproducir música de fondo'}
          className={`group relative flex items-center gap-2.5 h-11 px-3.5 sm:px-4 rounded-full border transition-all duration-300 cursor-pointer shadow-md backdrop-blur-md ${
            isPlaying
              ? 'bg-forest text-ivory border-forest shadow-forest/20 hover:bg-forest/90'
              : 'bg-ivory-50/95 text-forest border-sage-300/70 hover:bg-white hover:border-sage-400 shadow-sage-200/50'
          }`}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          {/* Ondas sonoras / Ecualizador animado cuando suena */}
          {isPlaying ? (
            <div className="flex items-end gap-[3px] h-3.5 w-3.5 my-auto">
              <span className="w-[2.5px] bg-ivory rounded-full h-full animate-[musicBar_0.8s_ease-in-out_infinite_alternate]" />
              <span className="w-[2.5px] bg-ivory rounded-full h-2/3 animate-[musicBar_0.8s_ease-in-out_0.2s_infinite_alternate]" />
              <span className="w-[2.5px] bg-ivory rounded-full h-4/5 animate-[musicBar_0.8s_ease-in-out_0.4s_infinite_alternate]" />
            </div>
          ) : (
            /* Icono de Play elegante cuando está pausado */
            <svg
              className="w-3.5 h-3.5 text-sage-600 transition-colors group-hover:text-forest fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}

          {/* Texto de control */}
          <span className="font-serif text-[11px] sm:text-xs tracking-[0.2em] uppercase font-medium">
            {isPlaying ? 'Música' : 'Música'}
          </span>

          {/* Indicador sutil de pulso al sonar */}
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sage-400" />
            </span>
          )}
        </motion.button>
      </div>

      <style jsx global>{`
        @keyframes musicBar {
          0% {
            height: 25%;
          }
          100% {
            height: 100%;
          }
        }
      `}</style>
    </>
  );
}
