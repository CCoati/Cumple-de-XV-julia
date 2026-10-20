'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signInAdmin, resetAdminPassword } from '@/lib/supabase/auth';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Estados para recuperación de contraseña
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Por favor, ingresá tu correo y contraseña.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await signInAdmin(email.trim(), password);
      onLoginSuccess();
    } catch (error: unknown) {
      console.error('Error al iniciar sesión:', error);
      const authError = error as { message?: string; status?: number };
      const msg = authError.message || '';
      if (msg.toLowerCase().includes('invalid login credentials')) {
        setErrorMessage('Correo o contraseña incorrectos.');
      } else if (msg.toLowerCase().includes('email not confirmed')) {
        setErrorMessage('El correo aún no ha sido confirmado en Supabase.');
      } else if (msg.toLowerCase().includes('too many requests')) {
        setErrorMessage('Demasiados intentos fallidos. Por favor aguardá unos minutos.');
      } else if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('fetch')) {
        setErrorMessage('Error de conexión a internet o con Supabase. Verificá tu red.');
      } else {
        setErrorMessage(msg || 'Ocurrió un error al ingresar. Verificá tus credenciales.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setResetMessage({ type: 'error', text: 'Por favor, ingresá tu correo electrónico.' });
      return;
    }

    setResetLoading(true);
    setResetMessage(null);

    try {
      await resetAdminPassword(resetEmail.trim());
      setResetMessage({
        type: 'success',
        text: 'Se envió un correo con instrucciones para restablecer tu contraseña. Revisá tu casilla (incluyendo spam).',
      });
    } catch (error: unknown) {
      console.error('Error recuperando contraseña:', error);
      const authError = error as { code?: string };
      if (authError.code === 'auth/user-not-found') {
        setResetMessage({
          type: 'error',
          text: 'No se encontró ninguna cuenta asociada a este correo.',
        });
      } else {
        setResetMessage({
          type: 'error',
          text: 'No pudimos procesar la solicitud en este momento. Intentá nuevamente.',
        });
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative overflow-hidden">
      {/* Elementos decorativos de fondo sutiles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sage-200/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sage-300/15 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="w-full max-w-md relative z-10">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sage-600 hover:text-forest text-xs font-serif tracking-[0.2em] uppercase transition-colors mb-4 group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a la invitación
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-forest tracking-tight font-medium">
            Panel de Control
          </h1>
          <p className="font-serif text-sage-600 text-sm mt-1.5 italic">
            Cumple Julia XV — Gestión de Confirmaciones
          </p>
        </div>

        {/* Tarjeta de Inicio de Sesión */}
        <div className="bg-white/90 backdrop-blur-sm border border-sage-300/50 rounded-md p-6 sm:p-8 shadow-lg shadow-forest/5">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="block font-serif text-forest text-xs tracking-[0.15em] uppercase mb-2 font-medium"
              >
                Correo Electrónico
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ejemplo.com"
                className="w-full bg-[#FAF8F5]/80 border border-sage-300/60 rounded px-4 py-3 font-serif text-forest text-sm placeholder:text-sage-400 focus:outline-none focus:border-sage-500 focus:bg-white focus:ring-1 focus:ring-sage-400/30 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="admin-password"
                  className="block font-serif text-forest text-xs tracking-[0.15em] uppercase font-medium"
                >
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setResetMessage(null);
                    setIsResetOpen(true);
                  }}
                  className="font-serif text-xs text-sage-600 hover:text-forest transition-colors underline underline-offset-2"
                >
                  ¿La olvidaste?
                </button>
              </div>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#FAF8F5]/80 border border-sage-300/60 rounded px-4 py-3 font-serif text-forest text-sm placeholder:text-sage-400 focus:outline-none focus:border-sage-500 focus:bg-white focus:ring-1 focus:ring-sage-400/30 transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-500 hover:text-forest p-1 focus:outline-none"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="bg-red-50/80 border border-red-200 rounded p-3 text-center animate-fadeIn">
                <p className="font-serif text-xs text-red-600 font-medium">{errorMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-forest text-[#FAF8F5] font-serif text-xs tracking-[0.2em] uppercase rounded shadow hover:bg-forest/90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <span>Ingresar al Panel</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-sage-200/50 text-center">
            <p className="font-serif text-[11px] text-sage-500 leading-relaxed">
              Acceso restringido para administradores autorizados.
              <br />
              Las cuentas se gestionan en Supabase Authentication.
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Recuperación de Contraseña */}
      {isResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-md border border-sage-300 max-w-sm w-full p-6 shadow-xl relative">
            <button
              onClick={() => setIsResetOpen(false)}
              className="absolute top-4 right-4 text-sage-400 hover:text-forest transition-colors p-1"
              aria-label="Cerrar modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-serif text-lg text-forest font-medium mb-1.5">
              Restablecer Contraseña
            </h3>
            <p className="font-serif text-xs text-sage-600 mb-4 leading-relaxed">
              Ingresá tu correo electrónico para recibir un enlace oficial de recuperación de Supabase.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="admin@ejemplo.com"
                className="w-full bg-[#FAF8F5] border border-sage-300 rounded px-3.5 py-2.5 font-serif text-forest text-sm placeholder:text-sage-400 focus:outline-none focus:border-sage-500"
              />

              {resetMessage && (
                <div
                  className={`p-3 rounded text-xs font-serif ${
                    resetMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {resetMessage.text}
                </div>
              )}

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setIsResetOpen(false)}
                  className="flex-1 py-2.5 border border-sage-300 text-sage-700 rounded font-serif text-xs uppercase tracking-wider hover:bg-sage-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 py-2.5 bg-forest text-white rounded font-serif text-xs uppercase tracking-wider hover:bg-forest/90 transition-colors disabled:opacity-50"
                >
                  {resetLoading ? 'Enviando...' : 'Enviar enlace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
