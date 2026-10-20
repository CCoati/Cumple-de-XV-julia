import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './client';

/**
 * Inicia sesión con correo y contraseña para el panel de administración.
 */
export async function signInAdmin(email: string, password: string): Promise<User> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase no está configurado. Verificá las variables de entorno.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error('No se pudo autenticar el usuario.');
  }

  return data.user;
}

/**
 * Cierra la sesión activa del panel.
 */
export async function signOutAdmin(): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error al cerrar sesión en Supabase:', error);
    throw error;
  }
}

/**
 * Escucha cambios en el estado de autenticación (para proteger rutas de administración).
 */
export function onAdminAuthStateChanged(
  callback: (user: User | null) => void
): () => void {
  if (!isSupabaseConfigured) {
    callback(null);
    return () => {};
  }

  // Comprobar sesión actual inicial
  supabase.auth.getSession().then(({ data: { session } }) => {
    callback(session?.user || null);
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(
    (_event: AuthChangeEvent, session: Session | null) => {
      callback(session?.user || null);
    }
  );

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Obtiene el usuario actual autenticado.
 */
export async function getCurrentAdminUser(): Promise<User | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

/**
 * Envía un correo para restablecer la contraseña del administrador.
 */
export async function resetAdminPassword(email: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase no está configurado.');
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/admin` : undefined,
  });

  if (error) {
    throw error;
  }
}

/**
 * Comprueba si el usuario autenticado tiene acceso de administrador.
 * En Supabase, cualquier usuario creado en Auth tiene acceso por defecto,
 * o se puede verificar metadata de rol.
 */
export async function checkAdminRole(user: User): Promise<boolean> {
  if (!user) return false;
  // Si tiene app_metadata.role o user_metadata.role 'admin' o si simplemente es un usuario autenticado en auth.users
  const role = user.app_metadata?.role || user.user_metadata?.role;
  if (role === 'guest') return false;
  return true;
}
