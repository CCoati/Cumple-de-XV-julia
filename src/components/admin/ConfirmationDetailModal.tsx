'use client';

import type { RSVPDocument } from '@/types/rsvp';

interface DetailModalProps {
  confirmation: RSVPDocument | null;
  onClose: () => void;
  onEdit: (item: RSVPDocument) => void;
  onDelete: (item: RSVPDocument) => void;
}

export default function ConfirmationDetailModal({
  confirmation,
  onClose,
  onEdit,
  onDelete,
}: DetailModalProps) {
  if (!confirmation) return null;

  const formatDate = (raw: unknown): string => {
    if (!raw) return 'Fecha no registrada';
    try {
      const rawObj = raw as { toDate?: () => Date };
      const date = typeof rawObj.toDate === 'function' ? rawObj.toDate() : new Date(raw as string | number);
      return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Fecha no disponible';
    }
  };

  const isAttending = confirmation.attending === 'yes';
  const totalPeople = isAttending ? 1 + (confirmation.guestCount || 0) : 0;
  const cleanPhone = confirmation.phone.replace(/[^0-9]/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-md border border-sage-300 max-w-lg w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-sage-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-serif font-medium ${
                  isAttending
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-stone-100 text-stone-700 border border-stone-300'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isAttending ? 'bg-emerald-600' : 'bg-stone-500'
                  }`}
                />
                {isAttending ? 'Confirmado — Asistirá' : 'No asistirá'}
              </span>
            </div>
            <h2 className="font-serif text-2xl text-forest font-medium">
              {confirmation.fullName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-sage-400 hover:text-forest transition-colors p-1 rounded-sm"
            aria-label="Cerrar detalle"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content body */}
        <div className="py-5 space-y-4 overflow-y-auto flex-1 font-serif text-sm">
          {/* Métricas clave */}
          <div className="grid grid-cols-2 gap-3 bg-[#FAF8F5] p-3.5 rounded border border-sage-200/70">
            <div>
              <p className="text-xs text-sage-600 uppercase tracking-wider">Total de Personas</p>
              <p className="text-xl font-medium text-forest mt-0.5">
                {totalPeople} {totalPeople === 1 ? 'persona' : 'personas'}
              </p>
            </div>
            <div>
              <p className="text-xs text-sage-600 uppercase tracking-wider">Acompañantes</p>
              <p className="text-xl font-medium text-forest mt-0.5">
                {isAttending ? confirmation.guestCount || 0 : 0}
              </p>
            </div>
          </div>

          {/* Teléfono y WhatsApp */}
          <div>
            <p className="text-xs text-sage-600 uppercase tracking-wider mb-1">Teléfono / Contacto</p>
            <div className="flex items-center gap-3">
              <span className="text-forest text-base font-medium">{confirmation.phone}</span>
              {cleanPhone && (
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs transition-colors shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                  WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Lista de acompañantes si asiste */}
          {isAttending && confirmation.guestCount > 0 && (
            <div>
              <p className="text-xs text-sage-600 uppercase tracking-wider mb-1.5">
                Nombres de los acompañantes ({confirmation.guestNames.length})
              </p>
              <div className="bg-[#FAF8F5] p-3 rounded border border-sage-200/70 space-y-1.5">
                {confirmation.guestNames.map((name, i) => (
                  <div key={i} className="flex items-center gap-2 text-forest text-sm">
                    <span className="w-5 h-5 rounded-full bg-sage-200 text-forest text-xs flex items-center justify-center font-medium">
                      {i + 1}
                    </span>
                    <span>{name || 'Sin nombre especificado'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mensaje u observaciones */}
          <div>
            <p className="text-xs text-sage-600 uppercase tracking-wider mb-1">
              Mensaje o dedicatoria
            </p>
            <div className="bg-[#FAF8F5] p-3.5 rounded border border-sage-200/70 text-forest text-sm italic whitespace-pre-wrap leading-relaxed">
              {confirmation.message ? `"${confirmation.message}"` : 'Sin mensaje adicional.'}
            </div>
          </div>

          {/* Fecha y metadatos */}
          <div className="pt-2 text-xs text-sage-500 border-t border-sage-200/50 flex flex-col gap-1">
            <p>
              <strong className="text-sage-700">Registrado el:</strong> {formatDate(confirmation.createdAt)}
            </p>
            <p className="font-mono text-[11px] text-sage-400">
              ID Firestore: {confirmation.id}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-sage-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onDelete(confirmation)}
            className="px-3.5 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded font-serif text-xs uppercase tracking-wider transition-colors"
          >
            Eliminar
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-sage-300 text-sage-700 hover:bg-sage-50 rounded font-serif text-xs uppercase tracking-wider transition-colors"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={() => onEdit(confirmation)}
              className="px-4 py-2 bg-forest text-white hover:bg-forest/90 rounded font-serif text-xs uppercase tracking-wider transition-colors"
            >
              Editar datos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
