'use client';

import { useState } from 'react';
import type { RSVPDocument } from '@/types/rsvp';

interface DeleteModalProps {
  confirmation: RSVPDocument | null;
  onClose: () => void;
  onConfirmDelete: (id: string) => Promise<void>;
}

export default function ConfirmationDeleteModal({
  confirmation,
  onClose,
  onConfirmDelete,
}: DeleteModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!confirmation) return null;

  const handleDelete = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      await onConfirmDelete(confirmation.id);
      onClose();
    } catch (err: unknown) {
      console.error('Error eliminando confirmación:', err);
      const message = err instanceof Error ? err.message : 'No se pudo eliminar el registro en Firestore.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-md border border-red-200 max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 className="font-serif text-lg text-forest font-medium">
              Eliminar Confirmación
            </h3>
            <p className="font-serif text-xs text-sage-600">
              Esta acción es irreversible
            </p>
          </div>
        </div>

        <p className="font-serif text-sm text-forest/90 mb-4 leading-relaxed">
          ¿Estás seguro de que deseás eliminar el registro de{' '}
          <strong className="text-forest font-semibold">{confirmation.fullName}</strong>?
          Se borrará permanentemente de Cloud Firestore.
        </p>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded p-2.5 mb-4 text-xs font-serif text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end gap-2.5 pt-2 border-t border-sage-200/50">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-sage-300 text-sage-700 hover:bg-sage-50 rounded font-serif text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-serif text-xs uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading ? 'Eliminando...' : 'Eliminar Registro'}
          </button>
        </div>
      </div>
    </div>
  );
}
