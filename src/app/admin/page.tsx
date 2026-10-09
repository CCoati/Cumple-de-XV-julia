'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { User } from 'firebase/auth';
import { onAdminAuthStateChanged, checkAdminRole, signOutAdmin } from '@/lib/firebase/auth';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import dynamic from 'next/dynamic';
import AdminLogin from '@/components/admin/AdminLogin';

// Optimización: Carga diferida (lazy loading) del dashboard para reducir el bundle inicial
const AdminDashboard = dynamic(() => import('@/components/admin/AdminDashboard'), {
  loading: () => (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-full border-2 border-sage-300 border-t-forest animate-spin mb-4" />
      <h2 className="font-serif text-lg text-forest font-medium">
        Cargando panel de administración...
      </h2>
      <p className="font-serif text-xs text-sage-600 mt-1 italic">
        Cumple Julia XV
      </p>
    </div>
  ),
});

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(isFirebaseConfigured);
  const [checkingRole, setCheckingRole] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);

  const verifyUserRole = useCallback(async (currentUser: User) => {
    setCheckingRole(true);
    try {
      const authorized = await checkAdminRole(currentUser.uid);
      setIsAdmin(authorized);
    } catch {
      setIsAdmin(false);
    } finally {
      setCheckingRole(false);
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return;
    }

    const unsubscribe = onAdminAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);

      if (currentUser) {
        await verifyUserRole(currentUser);
      } else {
        setIsAdmin(null);
        setCheckingRole(false);
      }
    });

    return () => unsubscribe();
  }, [verifyUserRole]);

  const handleCopyUid = (uid: string) => {
    navigator.clipboard.writeText(uid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2500);
  };

  const handleLogout = async () => {
    try {
      await signOutAdmin();
      setUser(null);
      setIsAdmin(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  // 1. Pantalla de carga mientras se verifica la sesión o el rol
  if (checkingAuth || checkingRole) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-sage-300 border-t-forest animate-spin mb-4" />
        <h2 className="font-serif text-lg text-forest font-medium">
          {checkingRole ? 'Verificando permisos de administrador...' : 'Verificando sesión...'}
        </h2>
        <p className="font-serif text-xs text-sage-600 mt-1 italic">
          Cumple Julia XV — Panel de Control
        </p>
      </div>
    );
  }

  // 2. Si Firebase no está configurado en las variables de entorno
  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-4 text-xl font-bold">
          !
        </div>
        <h2 className="font-serif text-2xl text-forest font-medium mb-2">
          Firebase no configurado
        </h2>
        <p className="font-serif text-sm text-sage-700 leading-relaxed mb-6">
          Para habilitar el panel de administración, es necesario configurar las variables de entorno{' '}
          <code className="bg-sage-100 text-forest px-1.5 py-0.5 rounded text-xs font-mono">
            NEXT_PUBLIC_FIREBASE_*
          </code>{' '}
          en tu archivo <code className="font-mono text-xs">.env.local</code> o en Netlify.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 bg-forest text-white rounded font-serif text-xs uppercase tracking-wider hover:bg-forest/90 transition-colors"
        >
          Volver a la invitación
        </Link>
      </div>
    );
  }

  // 3. Si no hay usuario autenticado: mostrar formulario de login
  if (!user) {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          // El listener onAdminAuthStateChanged se encargará de verificar el rol
        }}
      />
    );
  }

  // 4. Usuario autenticado pero SIN rol de administrador en Firestore: PANTALLA DE ACCESO DENEGADO
  // NO se ejecuta ninguna consulta a 'confirmaciones' ni se cargan datos privados
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="w-full max-w-md bg-white border border-rose-200/90 rounded-md p-6 sm:p-8 shadow-xl text-center relative z-10">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <span className="inline-block px-2.5 py-0.5 bg-rose-100 text-rose-800 text-[11px] font-serif uppercase tracking-widest rounded-full font-medium mb-2">
            Error 403 — Acceso Restringido
          </span>

          <h2 className="font-serif text-2xl text-forest font-medium mb-2">
            Cuenta no autorizada
          </h2>

          <p className="font-serif text-xs text-sage-600 leading-relaxed mb-5">
            Tu cuenta (<strong className="text-forest font-medium">{user.email}</strong>) ha iniciado
            sesión correctamente, pero <span className="underline decoration-rose-400">no posee permisos de administrador</span> en Cloud Firestore.
          </p>

          {/* Caja con el UID para copiar y configurar en Firebase */}
          <div className="bg-[#FAF8F5] border border-sage-200 rounded p-3 text-left mb-5">
            <p className="text-[11px] font-serif text-sage-600 uppercase tracking-wider mb-1 font-medium">
              Tu Identificador UID en Firebase:
            </p>
            <div className="flex items-center justify-between gap-2 bg-white px-2.5 py-1.5 rounded border border-sage-300">
              <code className="text-[11px] text-forest font-mono break-all select-all">
                {user.uid}
              </code>
              <button
                type="button"
                onClick={() => handleCopyUid(user.uid)}
                className="px-2 py-1 text-[11px] font-serif text-sage-700 hover:text-forest bg-sage-50 border border-sage-200 rounded whitespace-nowrap transition-colors"
              >
                {copiedUid ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>
            <p className="text-[10px] font-serif text-sage-500 mt-2 leading-relaxed">
              Para habilitar esta cuenta, se debe crear el documento con este UID exacto dentro de la colección <code className="font-mono text-[10px]">admins</code> con el campo <code className="font-mono text-[10px]">role: &quot;admin&quot;</code> en Firebase Console.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
            <button
              type="button"
              onClick={() => verifyUserRole(user)}
              className="py-2.5 px-4 bg-forest text-white rounded font-serif text-xs uppercase tracking-wider hover:bg-forest/90 transition-colors shadow-xs"
            >
              Reintentar comprobación
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="py-2.5 px-4 border border-sage-300 text-sage-700 rounded font-serif text-xs uppercase tracking-wider hover:bg-sage-50 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>

          <div className="mt-5 pt-4 border-t border-sage-200/50">
            <Link
              href="/"
              className="text-xs font-serif text-sage-500 hover:text-forest transition-colors"
            >
              ← Volver a la página principal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 5. Usuario autenticado Y verificado con rol de administrador en Firestore: RENDERIZAR DASHBOARD
  return (
    <AdminDashboard
      user={user}
      onLogout={() => {
        setUser(null);
        setIsAdmin(null);
      }}
    />
  );
}
