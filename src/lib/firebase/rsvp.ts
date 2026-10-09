import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './config';
import type { RSVPFormData, RSVPDocument } from '@/types/rsvp';

export interface SaveRSVPResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Guarda una confirmación de asistencia en Cloud Firestore
 * dentro de la colección 'confirmaciones'.
 */
export async function saveRSVPToFirestore(data: RSVPFormData): Promise<SaveRSVPResult> {
  if (!db) {
    console.warn('Firestore no está inicializado. Faltan variables de entorno.');
    return {
      success: false,
      error: 'La base de datos de Firebase no está configurada.',
    };
  }

  // Validaciones de seguridad y consistencia en el payload
  const trimmedName = data.fullName.trim();
  const trimmedPhone = data.phone.trim();

  if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
    return {
      success: false,
      error: 'El nombre debe tener entre 2 y 100 caracteres.',
    };
  }

  if (!trimmedPhone || trimmedPhone.length < 6 || trimmedPhone.length > 30) {
    return {
      success: false,
      error: 'El teléfono debe tener entre 6 y 30 caracteres.',
    };
  }

  try {
    const isAttending = data.attending === 'yes';
    const guestCount = isAttending ? Math.max(0, Math.min(10, Number(data.guestCount) || 0)) : 0;

    const cleanedGuestNames: string[] = [];
    if (isAttending && guestCount > 0) {
      for (let i = 0; i < guestCount; i++) {
        const rawName = Array.isArray(data.guestNames) ? data.guestNames[i] : '';
        cleanedGuestNames.push((rawName || '').trim().slice(0, 100));
      }
    }

    const confirmationPayload = {
      fullName: trimmedName,
      phone: trimmedPhone,
      attending: data.attending,
      guestCount,
      guestNames: cleanedGuestNames,
      message: (data.message || '').trim().slice(0, 500),
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'confirmaciones'), confirmationPayload);

    return {
      success: true,
      id: docRef.id,
    };
  } catch (error: unknown) {
    console.error('Error guardando confirmación en Firestore:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Error al guardar la confirmación en Firestore';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Obtiene el listado completo de confirmaciones (para el panel de administración).
 * Consulta optimizada para minimizar lecturas en el plan Spark.
 */
export async function getConfirmations(): Promise<RSVPDocument[]> {
  if (!db) {
    throw new Error('Firestore no está inicializado.');
  }

  const q = query(collection(db, 'confirmaciones'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      fullName: data.fullName || '',
      phone: data.phone || '',
      attending: data.attending || 'no',
      guestCount: Number(data.guestCount) || 0,
      guestNames: Array.isArray(data.guestNames) ? data.guestNames : [],
      message: data.message || '',
      createdAt: data.createdAt,
    };
  });
}

/**
 * Escucha cambios en tiempo real en la colección 'confirmaciones'.
 */
export function subscribeToConfirmations(
  onSuccess: (data: RSVPDocument[]) => void,
  onError?: (err: Error) => void
): () => void {
  if (!db) {
    if (onError) onError(new Error('Firestore no está inicializado.'));
    return () => {};
  }

  const q = query(collection(db, 'confirmaciones'), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: RSVPDocument[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          fullName: data.fullName || '',
          phone: data.phone || '',
          attending: data.attending || 'no',
          guestCount: Number(data.guestCount) || 0,
          guestNames: Array.isArray(data.guestNames) ? data.guestNames : [],
          message: data.message || '',
          createdAt: data.createdAt,
        };
      });
      onSuccess(items);
    },
    (error) => {
      console.error('Error en suscripción de confirmaciones:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Actualiza los datos de una confirmación existente (edición desde admin).
 */
export async function updateConfirmation(
  id: string,
  updatedData: Partial<RSVPFormData>
): Promise<void> {
  if (!db) {
    throw new Error('Firestore no está inicializado.');
  }

  const docRef = doc(db, 'confirmaciones', id);
  const payload: Record<string, unknown> = {};

  if (updatedData.fullName !== undefined) {
    payload.fullName = updatedData.fullName.trim();
  }
  if (updatedData.phone !== undefined) {
    payload.phone = updatedData.phone.trim();
  }
  if (updatedData.attending !== undefined) {
    payload.attending = updatedData.attending;
    if (updatedData.attending === 'no') {
      payload.guestCount = 0;
      payload.guestNames = [];
    }
  }
  if (updatedData.guestCount !== undefined && updatedData.attending !== 'no') {
    payload.guestCount = Math.max(0, Math.min(10, Number(updatedData.guestCount) || 0));
  }
  if (updatedData.guestNames !== undefined && updatedData.attending !== 'no') {
    payload.guestNames = updatedData.guestNames
      .map((n) => (n || '').trim())
      .filter(Boolean);
  }
  if (updatedData.message !== undefined) {
    payload.message = updatedData.message.trim();
  }

  await updateDoc(docRef, payload);
}

/**
 * Elimina una confirmación de la base de datos (con confirmación previa).
 */
export async function deleteConfirmation(id: string): Promise<void> {
  if (!db) {
    throw new Error('Firestore no está inicializado.');
  }
  const docRef = doc(db, 'confirmaciones', id);
  await deleteDoc(docRef);
}
