/**
 * Configuración centralizada del evento.
 * Modificar estos valores para actualizar toda la página.
 */
export const eventConfig = {
  /** Nombre de la protagonista */
  name: 'Julia',
  /** Nombre corto / apodo para la tipografía script */
  shortName: 'Juli',
  /** Fecha del evento en formato ISO */
  date: '2026-11-28T21:00:00',
  /** Fecha para mostrar en pantalla */
  displayDate: '28 · 11 · 2026',
  /** Hora del evento */
  time: '21:00 hs',
  /** Fecha límite de confirmación */
  rsvpDeadline: '10 de noviembre',
  /** Lugar del evento */
  venue: {
    name: 'Solar Dom Pedro',
    address: "R. Jose Fernandes Mendes, 161 - Armour, Sant'Ana do Livramento - RS, 97575-552, Brasil",
    /** URL de Google Maps del lugar */
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Solar+Dom+Pedro+Sant'Ana+do+Livramento",
    /** Coordenadas / Embed de Google Maps */
    mapsEmbedUrl: "https://maps.google.com/maps?q=R.+Jose+Fernandes+Mendes,+161+-+Armour,+Sant'Ana+do+Livramento+-+RS,+97575-552,+Brasil&t=&z=15&ie=UTF8&iwloc=&output=embed",
  },
  /** Dress code */
  dressCode: 'Formal',
  /** Textos de la sección de introducción */
  introTexts: [
    'Hay momentos que merecen ser celebrados para siempre.',
    'Y este es uno de ellos.',
    'Quiero compartir este día tan especial con vos.',
  ],
  /** Sección de regalos */
  gifts: {
    title: 'Regalos',
    subtitle: 'Un detalle especial',
    message: 'El mejor regalo es compartir este momento juntos. Si deseás hacerme un presente:',
    buttonText: 'Ver datos de cuenta',
    bankDetails: {
      holder: 'Julio López',
      brou: {
        bankName: 'Banco República (BROU)',
        accountNumber: '001227593-00001',
      },
      prex: {
        provider: 'Prex',
        accountNumber: '1822055',
        holder: 'Julio López',
      },
      note: '¡Muchas gracias por tu cariño y generosidad!',
    },
  },
  /** Email receptor de confirmaciones RSVP */
  rsvpRecipientEmail: 'jviera97@gmail.com',
  /** Frase de cierre */
  closingTexts: [
    'Los momentos más lindos son los que compartimos.',
    'Te esperamos para celebrar juntos.',
  ],
  /** Música de fondo de la invitación */
  music: {
    title: "Say You Won't Let Go",
    artist: 'James Arthur',
    src: "/audio/James Arthur - Say You Won't Let Go.mp3",
  },
} as const;
