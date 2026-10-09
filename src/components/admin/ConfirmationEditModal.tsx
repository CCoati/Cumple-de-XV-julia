'use client';

import { useState } from 'react';
import type { RSVPDocument, RSVPFormData } from '@/types/rsvp';

interface EditModalProps {
  confirmation: RSVPDocument | null;
  onClose: () => void;
  onSave: (id: string, updatedData: Partial<RSVPFormData>) => Promise<void>;
}

export default function ConfirmationEditModal({
  confirmation,
  onClose,
  onSave,
}: EditModalProps) {
  const initialCount = Number(confirmation?.guestCount) || 0;
  const [fullName, setFullName] = useState(confirmation?.fullName || '');
  const [phone, setPhone] = useState(confirmation?.phone || '');
  const [attending, setAttending] = useState<'yes' | 'no'>(confirmation?.attending || 'yes');
  const [guestCount, setGuestCount] = useState(initialCount);
  const [guestNames, setGuestNames] = useState<string[]>(() => {
    const names = Array.isArray(confirmation?.guestNames) ? [...confirmation.guestNames] : [];
    while (names.length < initialCount) names.push('');
    return names.slice(0, initialCount);
  });
  const [message, setMessage] = useState(confirmation?.message || '');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!confirmation) return null;

  const handleGuestCountChange = (count: number) => {
    const clamped = Math.max(0, Math.min(10, count));
    setGuestCount(clamped);
    const updated = [...guestNames];
    while (updated.length < clamped) updated.push('');
    while (updated.length > clamped) updated.pop();
    setGuestNames(updated);
  };

  const handleGuestNameChange = (index: number, value: string) => {
    const updated = [...guestNames];
    updated[index] = value;
    setGuestNames(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('El nombre y apellido son obligatorios.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('El teléfono es obligatorio.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const finalGuestCount = attending === 'yes' ? guestCount : 0;
      const finalGuestNames: string[] = [];
      if (attending === 'yes' && finalGuestCount > 0) {
        for (let i = 0; i < finalGuestCount; i++) {
          finalGuestNames.push((guestNames[i] || '').trim().slice(0, 100));
        }
      }

      await onSave(confirmation.id, {
        fullName: fullName.trim(),
        phone: phone.trim(),
        attending,
        guestCount: finalGuestCount,
        guestNames: finalGuestNames,
        message: message.trim(),
      });
      onClose();
    } catch (err: unknown) {
      console.error('Error guardando cambios:', err);
      const messageText = err instanceof Error ? err.message : 'Error al actualizar la confirmación en Firestore.';
      setErrorMessage(messageText);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    'w-full bg-[#FAF8F5] border border-sage-300 rounded px-3.5 py-2.5 font-serif text-forest text-sm placeholder:text-sage-400 focus:outline-none focus:border-sage-500 focus:bg-white transition-all';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-md border border-sage-300 max-w-lg w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sage-200">
          <h2 className="font-serif text-xl text-forest font-medium">
            Editar Confirmación
          </h2>
          <button
            onClick={onClose}
            className="text-sage-400 hover:text-forest transition-colors p-1"
            aria-label="Cerrar edición"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4 overflow-y-auto flex-1 font-serif text-sm">
          {/* Nombre */}
          <div>
            <label className="block text-xs text-sage-600 uppercase tracking-wider mb-1 font-medium">
              Nombre y Apellido
            </label>
            <input
              type="text"
              required
              maxLength={100}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClasses}
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-xs text-sage-600 uppercase tracking-wider mb-1 font-medium">
              Teléfono / WhatsApp
            </label>
            <input
              type="tel"
              required
              maxLength={30}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClasses}
            />
          </div>

          {/* Asistencia */}
          <div>
            <label className="block text-xs text-sage-600 uppercase tracking-wider mb-1 font-medium">
              Estado de Asistencia
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAttending('yes')}
                className={`py-2 px-3 rounded border text-xs uppercase tracking-wider transition-all font-medium ${
                  attending === 'yes'
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900 shadow-sm'
                    : 'bg-white border-sage-300 text-sage-600 hover:bg-sage-50'
                }`}
              >
                Sí, asistirá
              </button>
              <button
                type="button"
                onClick={() => setAttending('no')}
                className={`py-2 px-3 rounded border text-xs uppercase tracking-wider transition-all font-medium ${
                  attending === 'no'
                    ? 'bg-stone-200 border-stone-400 text-stone-900 shadow-sm'
                    : 'bg-white border-sage-300 text-sage-600 hover:bg-sage-50'
                }`}
              >
                No asistirá
              </button>
            </div>
          </div>

          {/* Acompañantes (solo si asiste) */}
          {attending === 'yes' && (
            <div className="space-y-3 pt-1 border-t border-sage-200/50">
              <div>
                <label className="block text-xs text-sage-600 uppercase tracking-wider mb-1 font-medium">
                  Cantidad de acompañantes (0 a 10)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={guestCount}
                  onChange={(e) => handleGuestCountChange(parseInt(e.target.value) || 0)}
                  className={inputClasses}
                />
              </div>

              {guestCount > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs text-sage-600 uppercase tracking-wider font-medium">
                    Nombres de los acompañantes
                  </label>
                  {guestNames.map((name, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={100}
                      placeholder={`Acompañante ${idx + 1}`}
                      value={name}
                      onChange={(e) => handleGuestNameChange(idx, e.target.value)}
                      className={inputClasses}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mensaje */}
          <div>
            <label className="block text-xs text-sage-600 uppercase tracking-wider mb-1 font-medium">
              Observaciones o mensaje
            </label>
            <textarea
              rows={3}
              maxLength={500}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${inputClasses} resize-none`}
            />
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded p-2.5 text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-sage-200 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-sage-300 text-sage-700 hover:bg-sage-50 rounded font-serif text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-forest text-white hover:bg-forest/90 rounded font-serif text-xs uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
