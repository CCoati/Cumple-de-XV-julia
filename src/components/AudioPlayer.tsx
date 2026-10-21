'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { eventConfig } from '@/lib/event-config';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.45;

    const playAudio = () => {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay bloqueado inicialmente por política del navegador
            setIsPlaying(false);
          });
      }
    };

    // 1. Intentar reproducir de inmediato al cargar la página
    playAudio();

    // 2. Respaldo para navegadores móviles con bloqueo de autoplay:
    // Al primer contacto (scroll, tap o clic en cualquier parte), activar de inmediato
    const handleFirstInteraction = () => {
      if (audio.paused) {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    window.addEventListener('scroll', handleFirstInteraction, { passive: true });
    window.addEventListener('click', handleFirstInteraction, { passive: true });

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      cleanup();
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

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
        autoPlay
        loop
        preload="auto"
      />

      {/* Botón flotante pequeño: solo símbolo de audio y mute */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none">
        <motion.button
          type="button"
          onClick={togglePlay}
          title={isPlaying ? 'Silenciar música' : 'Activar música'}
          aria-label={isPlaying ? 'Silenciar música' : 'Activar música'}
          className={`relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border shadow-md backdrop-blur-md transition-all duration-300 cursor-pointer ${
            isPlaying
              ? 'bg-forest text-ivory border-forest/90 hover:bg-forest/90 hover:shadow-lg hover:shadow-forest/20'
              : 'bg-ivory-50/90 text-sage-600 border-sage-300/70 hover:bg-white hover:text-forest hover:border-sage-400'
          }`}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          {isPlaying ? (
            /* Símbolo de Audio sonando */
            <svg
              className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-ivory fill-current"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" fill="none" />
            </svg>
          ) : (
            /* Símbolo de Mute */
            <svg
              className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-sage-500 hover:text-forest fill-current transition-colors"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="22" y1="9" x2="16" y2="15" fill="none" />
              <line x1="16" y1="9" x2="22" y2="15" fill="none" />
            </svg>
          )}

          {/* Sutil pulso cuando la música está reproduciéndose */}
          {isPlaying && (
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sage-400" />
            </span>
          )}
        </motion.button>
      </div>
    </>
  );
}
