import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

/**
 * Inicia sesión con correo y contraseña para el panel de administración.
 */
export async function signInAdmin(email: string, password: string): Promise<User> {
  if (!auth) {
    throw new Error('Firebase Auth no está inicializado.');
  }
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Cierra la sesión activa.
 */
export async function signOutAdmin(): Promise<void> {
  if (!auth) {
    throw new Error('Firebase Auth no está inicializado.');
  }
  await signOut(auth);
}

/**
 * Escucha cambios en el estado de autenticación (para proteger rutas de administración).
 */
export function onAdminAuthStateChanged(callback: (user: User | null) => void): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

/**
 * Obtiene el usuario actual autenticado.
 */
export function getCurrentAdminUser(): User | null {
  return auth?.currentUser || null;
}

/**
 * Envía un correo de recuperación de contraseña al administrador.
 */
export async function resetAdminPassword(email: string): Promise<void> {
  if (!auth) {
    throw new Error('Firebase Auth no está inicializado.');
  }
  await sendPasswordResetEmail(auth, email);
}

/**
 * Comprueba si el usuario autenticado tiene rol de administrador en /admins/{uid}.
 */
export async function checkAdminRole(uid: string): Promise<boolean> {
  if (!db) return false;
  try {
    const adminDocRef = doc(db, 'admins', uid);
    const docSnap = await getDoc(adminDocRef);
    return docSnap.exists() && docSnap.data()?.role === 'admin';
  } catch (err) {
    console.warn('Error verificando rol de administrador:', err);
    return false;
  }
}

