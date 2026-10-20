import { supabase, isSupabaseConfigured } from './client';
import type { RSVPFormData, RSVPDocument } from '@/types/rsvp';

export interface SaveRSVPResult {
  success: boolean;
  id?: string;
  error?: string;
}

interface SupabaseConfirmationRow {
  id: string;
  full_name: string;
  phone: string;
  attending: string;
  guest_count: number;
  guest_names: string[] | null;
  message: string | null;
  created_at: string;
  updated_at?: string;
}

function mapRowToDocument(row: SupabaseConfirmationRow): RSVPDocument {
  const createdDate = new Date(row.created_at);
  return {
    id: row.id,
    fullName: row.full_name || '',
    phone: row.phone || '',
    attending: row.attending === 'yes' ? 'yes' : 'no',
    guestCount: Number(row.guest_count) || 0,
    guestNames: Array.isArray(row.guest_names) ? row.guest_names : [],
    message: row.message || '',
    createdAt: {
      toDate: () => createdDate,
      seconds: Math.floor(createdDate.getTime() / 1000),
      nanoseconds: (createdDate.getTime() % 1000) * 1e6,
    },
  };
}

/**
 * Guarda una confirmación de asistencia en Supabase dentro de la tabla 'confirmaciones'.
 */
export async function saveRSVPToSupabase(data: RSVPFormData): Promise<SaveRSVPResult> {
  if (!isSupabaseConfigured) {
    console.warn('Supabase no está configurado. Faltan variables de entorno.');
    return {
      success: false,
      error: 'La base de datos de Supabase no está configurada.',
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

    const payload = {
      full_name: trimmedName,
      phone: trimmedPhone,
      attending: data.attending,
      guest_count: guestCount,
      guest_names: cleanedGuestNames,
      message: (data.message || '').trim().slice(0, 500),
    };

    const { error } = await supabase
      .from('confirmaciones')
      .insert(payload);

    if (error) {
      console.error('Error insertando en Supabase:', error);
      return {
        success: false,
        error: error.message || 'Error al guardar la confirmación en Supabase.',
      };
    }

    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error('Error guardando confirmación en Supabase:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Error al guardar la confirmación en Supabase';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Obtiene el listado completo de confirmaciones (para el panel de administración).
 */
export async function getConfirmations(): Promise<RSVPDocument[]> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase no está configurado.');
  }

  const { data, error } = await supabase
    .from('confirmaciones')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener confirmaciones de Supabase:', error);
    throw error;
  }

  return (data || []).map((row) => mapRowToDocument(row as SupabaseConfirmationRow));
}

/**
 * Escucha cambios en tiempo real en la tabla 'confirmaciones' mediante Supabase Realtime.
 */
export function subscribeToConfirmations(
  onSuccess: (data: RSVPDocument[]) => void,
  onError?: (err: Error) => void
): () => void {
  if (!isSupabaseConfigured) {
    if (onError) onError(new Error('Supabase no está configurado.'));
    return () => {};
  }

  // Carga inicial
  getConfirmations()
    .then(onSuccess)
    .catch((err) => {
      if (onError) onError(err);
    });

  // Suscripción a cambios
  const channel = supabase
    .channel('realtime:confirmaciones')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'confirmaciones',
      },
      () => {
        // Al ocurrir cualquier cambio (insert, update, delete), refrescamos los datos
        getConfirmations()
          .then(onSuccess)
          .catch((err) => {
            if (onError) onError(err);
          });
      }
    )
    .subscribe((status, err) => {
      if (err && onError) {
        onError(err);
      }
    });

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Actualiza los datos de una confirmación existente (edición desde admin).
 */
export async function updateConfirmation(
  id: string,
  updatedData: Partial<RSVPFormData>
): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase no está configurado.');
  }

  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updatedData.fullName !== undefined) {
    payload.full_name = updatedData.fullName.trim();
  }
  if (updatedData.phone !== undefined) {
    payload.phone = updatedData.phone.trim();
  }
  if (updatedData.attending !== undefined) {
    payload.attending = updatedData.attending;
    if (updatedData.attending === 'no') {
      payload.guest_count = 0;
      payload.guest_names = [];
    }
  }
  if (updatedData.guestCount !== undefined && updatedData.attending !== 'no') {
    payload.guest_count = Math.max(0, Math.min(10, Number(updatedData.guestCount) || 0));
  }
  if (updatedData.guestNames !== undefined && updatedData.attending !== 'no') {
    payload.guest_names = updatedData.guestNames
      .map((n) => (n || '').trim())
      .filter(Boolean);
  }
  if (updatedData.message !== undefined) {
    payload.message = updatedData.message.trim();
  }

  const { error } = await supabase
    .from('confirmaciones')
    .update(payload)
    .eq('id', id);

  if (error) {
    console.error('Error actualizando confirmación:', error);
    throw error;
  }
}

/**
 * Elimina una confirmación de la base de datos (con confirmación previa).
 */
export async function deleteConfirmation(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase no está configurado.');
  }

  const { error } = await supabase
    .from('confirmaciones')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error eliminando confirmación:', error);
    throw error;
  }
}
