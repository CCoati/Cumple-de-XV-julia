'use client';

import Image from 'next/image';

interface BotanicalWatercolorProps {
  variant: 'top-left' | 'bottom-right' | 'sprig-left' | 'sprig-right' | 'centerpiece' | 'sparkles';
  className?: string;
  opacity?: number;
  width?: number;
  height?: number;
}

export default function BotanicalWatercolor({
  variant,
  className = '',
  opacity = 1,
  width,
  height,
}: BotanicalWatercolorProps) {
  const images = {
    'top-left': {
      src: '/images/botanicals/branch-top-left-clean.png',
      alt: 'Rama de olivo acuarela superior',
      defaultWidth: 245,
      defaultHeight: 450,
      maskStyle: {
        maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
        maskComposite: 'intersect',
        WebkitMaskComposite: 'destination-in',
      },
    },
    'bottom-right': {
      src: '/images/botanicals/branch-bottom-right-clean.png',
      alt: 'Rama de olivo acuarela inferior',
      defaultWidth: 230,
      defaultHeight: 470,
      maskStyle: {
        maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
        maskComposite: 'intersect',
        WebkitMaskComposite: 'destination-in',
      },
    },
    'sprig-left': {
      src: '/images/botanicals/sprig-left-clean.png',
      alt: 'Ramillete de olivo izquierdo',
      defaultWidth: 105,
      defaultHeight: 190,
      maskStyle: {},
    },
    'sprig-right': {
      src: '/images/botanicals/sprig-right-clean.png',
      alt: 'Ramillete de olivo derecho',
      defaultWidth: 105,
      defaultHeight: 190,
      maskStyle: {},
    },
    'centerpiece': {
      src: '/images/botanicals/centerpiece-xv-juli.png',
      alt: 'XV Juli acuarela',
      defaultWidth: 535,
      defaultHeight: 390,
      maskStyle: {},
    },
    'sparkles': {
      src: '/images/botanicals/sparkle-stars.png',
      alt: 'Estrellas destellos',
      defaultWidth: 140,
      defaultHeight: 120,
      maskStyle: {},
    },
  };

  const current = images[variant];

  return (
    <div
      className={`relative select-none pointer-events-none ${className}`}
      style={{ opacity, ...current.maskStyle }}
    >
      <Image
        src={current.src}
        alt={current.alt}
        width={width || current.defaultWidth}
        height={height || current.defaultHeight}
        className="w-full h-auto object-contain"
        priority={variant === 'top-left' || variant === 'bottom-right' || variant === 'centerpiece'}
      />
    </div>
  );
}
