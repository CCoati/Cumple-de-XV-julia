'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import type { User } from 'firebase/auth';
import type { RSVPDocument, RSVPFormData } from '@/types/rsvp';
import {
  getConfirmations,
  updateConfirmation,
  deleteConfirmation,
  subscribeToConfirmations,
} from '@/lib/firebase/rsvp';
import { signOutAdmin } from '@/lib/firebase/auth';
import ConfirmationDetailModal from './ConfirmationDetailModal';
import ConfirmationEditModal from './ConfirmationEditModal';
import ConfirmationDeleteModal from './ConfirmationDeleteModal';
import { exportConfirmationsToCsv } from '@/lib/exportCsv';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

type FilterStatus = 'all' | 'yes' | 'no';
type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'guests-desc';

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [confirmations, setConfirmations] = useState<RSVPDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [realtimeMode, setRealtimeMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Filtros y ordenamiento
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  // Modales
  const [selectedDetail, setSelectedDetail] = useState<RSVPDocument | null>(null);
  const [selectedEdit, setSelectedEdit] = useState<RSVPDocument | null>(null);
  const [selectedDelete, setSelectedDelete] = useState<RSVPDocument | null>(null);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    setErrorMessage('');
    try {
      const data = await getConfirmations();
      setConfirmations(data);
    } catch (err: unknown) {
      console.error('Error actualizando confirmaciones:', err);
      const fireErr = err as { code?: string };
      if (fireErr.code === 'permission-denied') {
        setErrorMessage(
          `Acceso denegado (403): Tu cuenta (${user.email}) no tiene autorización de administrador en Firestore. Para acceder, creá en Firebase Console el documento /admins/${user.uid} con el campo role: "admin".`
        );
      } else {
        setErrorMessage(
          'No se pudieron cargar las confirmaciones. Verificá tu conexión y permisos en Firebase.'
        );
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (!realtimeMode) {
      getConfirmations()
        .then((data) => {
          if (isMounted) {
            setConfirmations(data);
            setLoading(false);
          }
        })
        .catch((err: unknown) => {
          if (isMounted) {
            console.error('Error cargando confirmaciones:', err);
            const fireErr = err as { code?: string };
            if (fireErr.code === 'permission-denied') {
              setErrorMessage(
                `Acceso denegado (403): Tu cuenta (${user.email}) no tiene autorización de administrador en Firestore. Para acceder, creá en Firebase Console el documento /admins/${user.uid} con el campo role: "admin".`
              );
            } else {
              setErrorMessage(
                'No se pudieron cargar las confirmaciones. Verificá tu conexión y permisos en Firebase.'
              );
            }
            setLoading(false);
          }
        });

      return () => {
        isMounted = false;
      };
    }

    // Modo tiempo real opcional
    const unsubscribe = subscribeToConfirmations(
      (data) => {
        if (isMounted) {
          setConfirmations(data);
          setLoading(false);
        }
      },
      (error) => {
        if (isMounted) {
          console.error('Error en tiempo real:', error);
          setErrorMessage('Error de sincronización en tiempo real.');
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [realtimeMode, user.email, user.uid]);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleLogout = async () => {
    try {
      await signOutAdmin();
      onLogout();
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  const handleSaveEdit = async (id: string, updatedData: Partial<RSVPFormData>) => {
    await updateConfirmation(id, updatedData);
    setConfirmations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
    if (selectedDetail && selectedDetail.id === id) {
      setSelectedDetail((prev) => (prev ? { ...prev, ...updatedData } : null));
    }
    showFeedback('Confirmación actualizada con éxito.');
  };

  const handleConfirmDelete = async (id: string) => {
    await deleteConfirmation(id);
    setConfirmations((prev) => prev.filter((c) => c.id !== id));
    if (selectedDetail && selectedDetail.id === id) {
      setSelectedDetail(null);
    }
    showFeedback('Registro eliminado correctamente.');
  };

  // Cálculo de estadísticas y métricas generales
  const metrics = useMemo(() => {
    const totalResponses = confirmations.length;
    const attendingResponses = confirmations.filter((c) => c.attending === 'yes');
    const notAttendingResponses = confirmations.filter((c) => c.attending === 'no');

    // Total de personas asistentes = titulares confirmados + cantidad de acompañantes de cada uno
    const totalAttendingGuests = attendingResponses.reduce(
      (sum, c) => sum + 1 + (Number(c.guestCount) || 0),
      0
    );

    const totalCompanions = attendingResponses.reduce(
      (sum, c) => sum + (Number(c.guestCount) || 0),
      0
    );

    return {
      totalResponses,
      confirmedCount: attendingResponses.length,
      declinedCount: notAttendingResponses.length,
      totalAttendingGuests,
      totalCompanions,
    };
  }, [confirmations]);

  // Filtrado y ordenamiento en memoria (0 lecturas adicionales a Firestore)
  const filteredAndSortedList = useMemo(() => {
    let result = [...confirmations];

    // Filtro por estado
    if (statusFilter !== 'all') {
      result = result.filter((item) => item.attending === statusFilter);
    }

    // Búsqueda por nombre o teléfono
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.fullName.toLowerCase().includes(query) ||
          item.phone.toLowerCase().includes(query) ||
          item.guestNames?.some((name) => name.toLowerCase().includes(query))
      );
    }

    // Ordenamiento
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return timeB - timeA;
      }
      if (sortBy === 'date-asc') {
        const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return timeA - timeB;
      }
      if (sortBy === 'name-asc') {
        return a.fullName.localeCompare(b.fullName);
      }
      if (sortBy === 'name-desc') {
        return b.fullName.localeCompare(a.fullName);
      }
      if (sortBy === 'guests-desc') {
        const totalA = a.attending === 'yes' ? 1 + (a.guestCount || 0) : 0;
        const totalB = b.attending === 'yes' ? 1 + (b.guestCount || 0) : 0;
        return totalB - totalA;
      }
      return 0;
    });

    return result;
  }, [confirmations, statusFilter, searchTerm, sortBy]);

  const formatDateDisplay = (raw: unknown): string => {
    if (!raw) return '—';
    try {
      const rawObj = raw as { toDate?: () => Date };
      const date = typeof rawObj.toDate === 'function' ? rawObj.toDate() : new Date(raw as string | number);
      return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '—';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-forest pb-16 font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-sage-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-forest hover:text-sage-600 transition-colors flex items-center gap-2 group"
              title="Ir a la web pública"
            >
              <span className="font-serif text-xl sm:text-2xl font-medium tracking-tight">
                Julia XV
              </span>
              <span className="hidden sm:inline-block text-xs font-serif text-sage-500 uppercase tracking-widest px-2 py-0.5 bg-sage-50 border border-sage-200 rounded">
                Admin
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden md:inline-block font-serif text-xs text-sage-600">
              {user.email}
            </span>
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-serif text-sage-600 hover:text-forest transition-colors px-2.5 py-1.5 border border-sage-300 rounded"
            >
              Ver Invitación
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 border border-sage-300 hover:border-forest text-forest text-xs font-serif uppercase tracking-wider rounded transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Banner de feedback temporal */}
        {feedbackMessage && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-md font-serif text-xs tracking-wide flex items-center justify-between animate-fadeIn shadow-sm">
            <span>{feedbackMessage}</span>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-emerald-600 hover:text-emerald-900 ml-4 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Encabezado y Controles Rápidos */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-forest font-medium tracking-tight">
              Gestión de Confirmaciones
            </h1>
            <p className="font-serif text-sage-600 text-xs sm:text-sm mt-1 italic">
              Control general de invitados, respuestas y cálculo de cubiertos.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Botón Exportar CSV */}
            <button
              type="button"
              onClick={() => {
                if (confirmations.length === 0) {
                  showFeedback('No hay confirmaciones registradas para exportar.');
                  return;
                }
                exportConfirmationsToCsv(confirmations);
                showFeedback(
                  `Exportadas ${confirmations.length} confirmaciones a archivo CSV para Excel.`
                );
              }}
              disabled={confirmations.length === 0 || loading}
              title="Descargar todas las confirmaciones registradas en formato CSV para Excel/Sheets"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-forest hover:bg-forest/90 text-white rounded text-xs font-serif uppercase tracking-wider transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Exportar CSV</span>
            </button>

            {/* Botón Refrescar */}
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-sage-300 hover:border-forest text-forest rounded text-xs font-serif uppercase tracking-wider transition-all disabled:opacity-50 shadow-xs cursor-pointer"
            >
              <svg
                className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {refreshing ? 'Actualizando...' : 'Actualizar'}
            </button>

            {/* Toggle Tiempo Real */}
            <button
              type="button"
              onClick={() => setRealtimeMode(!realtimeMode)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded text-xs font-serif uppercase tracking-wider border transition-colors cursor-pointer ${
                realtimeMode
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-sage-300 text-sage-600 hover:text-forest'
              }`}
              title={
                realtimeMode
                  ? 'Suscripción activa en tiempo real'
                  : 'Modo manual optimizado para cuota Spark'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  realtimeMode ? 'bg-emerald-500 animate-pulse' : 'bg-sage-400'
                }`}
              />
              {realtimeMode ? 'En vivo' : 'Manual'}
            </button>
          </div>
        </div>

        {/* Tarjetas de Métricas (5 Estadísticas Requeridas) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-8">
          {/* Card 1: Cantidad total de respuestas */}
          <div className="bg-white p-4.5 rounded-md border border-sage-200/90 shadow-xs hover:border-sage-300 transition-colors">
            <p className="font-serif text-[11px] text-sage-600 uppercase tracking-widest font-medium">
              Total Respuestas
            </p>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-medium text-forest">
                {metrics.totalResponses}
              </span>
              <span className="text-[11px] text-sage-500 font-serif">recibidas</span>
            </div>
            <p className="text-[10px] text-sage-500 mt-1.5 font-serif">
              Formularios completados
            </p>
          </div>

          {/* Card 2: Invitados titulares que confirmaron */}
          <div className="bg-white p-4.5 rounded-md border border-sage-200/90 shadow-xs hover:border-emerald-300 transition-colors">
            <p className="font-serif text-[11px] text-emerald-700 uppercase tracking-widest font-medium">
              Titulares Asisten
            </p>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-medium text-emerald-800">
                {metrics.confirmedCount}
              </span>
              <span className="text-[11px] text-emerald-600 font-serif">titulares</span>
            </div>
            <p className="text-[10px] text-sage-500 mt-1.5 font-serif">
              Confirmaron asistencia
            </p>
          </div>

          {/* Card 3: Invitados que no asistirán */}
          <div className="bg-white p-4.5 rounded-md border border-sage-200/90 shadow-xs hover:border-rose-300 transition-colors">
            <p className="font-serif text-[11px] text-rose-700 uppercase tracking-widest font-medium">
              No Asistirán
            </p>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-medium text-rose-800">
                {metrics.declinedCount}
              </span>
              <span className="text-[11px] text-rose-600 font-serif">personas</span>
            </div>
            <p className="text-[10px] text-sage-500 mt-1.5 font-serif">
              Avisaron que no pueden ir
            </p>
          </div>

          {/* Card 4: Total de acompañantes confirmados */}
          <div className="bg-white p-4.5 rounded-md border border-sage-200/90 shadow-xs hover:border-sage-400 transition-colors">
            <p className="font-serif text-[11px] text-sage-700 uppercase tracking-widest font-medium">
              Acompañantes
            </p>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-medium text-forest">
                {metrics.totalCompanions}
              </span>
              <span className="text-[11px] text-sage-600 font-serif">confirmados</span>
            </div>
            <p className="text-[10px] text-sage-500 mt-1.5 font-serif">
              Familia / parejas adjuntas
            </p>
          </div>

          {/* Card 5: TOTAL DE PERSONAS QUE ASISTIRÁN (TITULARES + ACOMPAÑANTES) */}
          <div className="bg-emerald-50/80 p-4.5 rounded-md border border-emerald-300 shadow-xs col-span-2 sm:col-span-1 lg:col-span-1">
            <p className="font-serif text-[11px] text-emerald-950 uppercase tracking-widest font-bold flex items-center justify-between">
              Total Asistentes
              <span className="text-xs">🎉</span>
            </p>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-900">
                {metrics.totalAttendingGuests}
              </span>
              <span className="text-[11px] text-emerald-800 font-serif font-medium">personas</span>
            </div>
            <p className="text-[10px] text-emerald-800/80 mt-1.5 font-serif font-medium">
              Total para catering y salón
            </p>
          </div>
        </div>

        {/* Barra de Filtros, Búsqueda y Ordenamiento */}
        <div className="bg-white p-4 sm:p-5 rounded-md border border-sage-200/90 shadow-xs mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
            {/* Buscador */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por nombre, teléfono o acompañante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-sage-300 rounded px-3.5 py-2.5 pl-10 font-serif text-sm text-forest placeholder:text-sage-400 focus:outline-none focus:border-sage-500 focus:bg-white transition-all"
              />
              <svg
                className="w-4 h-4 text-sage-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-400 hover:text-forest p-0.5"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Ordenamiento */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs font-serif text-sage-600 whitespace-nowrap">
                Ordenar por:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-[#FAF8F5] border border-sage-300 rounded px-3 py-2 text-xs font-serif text-forest focus:outline-none focus:border-sage-500"
              >
                <option value="date-desc">Más recientes primero</option>
                <option value="date-asc">Más antiguas primero</option>
                <option value="name-asc">Nombre (A - Z)</option>
                <option value="name-desc">Nombre (Z - A)</option>
                <option value="guests-desc">Mayor cantidad de personas</option>
              </select>
            </div>
          </div>

          {/* Filtros por pestaña */}
          <div className="flex items-center gap-2 pt-2 border-t border-sage-200/50 flex-wrap">
            <span className="text-xs font-serif text-sage-600 mr-2">Estado:</span>
            {[
              { id: 'all', label: `Todos (${confirmations.length})` },
              { id: 'yes', label: `Asisten (${metrics.confirmedCount})` },
              { id: 'no', label: `No asisten (${metrics.declinedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id as FilterStatus)}
                className={`px-3 py-1.5 rounded text-xs font-serif uppercase tracking-wider transition-colors cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-forest text-white font-medium shadow-xs'
                    : 'bg-[#FAF8F5] text-sage-700 hover:bg-sage-100/70 border border-sage-300/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error general */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6 font-serif text-xs">
            {errorMessage}
          </div>
        )}

        {/* Tabla en Desktop / Lista de Tarjetas en Mobile */}
        <div className="bg-white rounded-md border border-sage-200/90 shadow-xs overflow-hidden">
          {loading ? (
            /* Skeleton Loading State */
            <div className="p-8 space-y-4">
              <div className="h-6 bg-sage-100 rounded w-1/4 animate-pulse" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="h-12 bg-sage-50 rounded animate-pulse" />
                ))}
              </div>
            </div>
          ) : filteredAndSortedList.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center">
              <div className="w-12 h-12 mx-auto mb-3 text-sage-300">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg text-forest font-medium">
                {confirmations.length === 0
                  ? 'Aún no se han recibido confirmaciones'
                  : 'No se encontraron resultados'}
              </h3>
              <p className="font-serif text-xs text-sage-600 mt-1 max-w-sm mx-auto">
                {confirmations.length === 0
                  ? 'Cuando los invitados completen el formulario de la invitación, aparecerán aquí automáticamente.'
                  : 'Probá ajustando el término de búsqueda o cambiando los filtros seleccionados.'}
              </p>
            </div>
          ) : (
            <>
              {/* VISTA DESKTOP: TABLA COMPLETA */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left font-serif text-xs">
                  <thead className="bg-[#FAF8F5] text-sage-700 uppercase tracking-wider text-[11px] border-b border-sage-200">
                    <tr>
                      <th className="py-3.5 px-4 font-medium">Invitado</th>
                      <th className="py-3.5 px-3 font-medium">Estado</th>
                      <th className="py-3.5 px-3 font-medium">Acompañantes</th>
                      <th className="py-3.5 px-3 font-medium">Total Personas</th>
                      <th className="py-3.5 px-3 font-medium">Fecha</th>
                      <th className="py-3.5 px-3 font-medium">Mensaje</th>
                      <th className="py-3.5 px-4 font-medium text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage-200/60">
                    {filteredAndSortedList.map((item) => {
                      const isAttending = item.attending === 'yes';
                      const totalPeople = isAttending ? 1 + (item.guestCount || 0) : 0;
                      const cleanPhone = item.phone.replace(/[^0-9]/g, '');

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-[#FAF8F5]/80 transition-colors group"
                        >
                          {/* Nombre y teléfono */}
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-forest text-sm">
                              {item.fullName}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-sage-600 text-xs font-sans">
                              <span>{item.phone}</span>
                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/${cleanPhone}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 hover:text-emerald-800"
                                  title="Enviar WhatsApp"
                                >
                                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                                  </svg>
                                </a>
                              )}
                            </div>
                          </td>

                          {/* Estado */}
                          <td className="py-3.5 px-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                              {isAttending ? 'Asiste' : 'No asiste'}
                            </span>
                          </td>

                          {/* Acompañantes */}
                          <td className="py-3.5 px-3 text-sage-700">
                            {isAttending ? (
                              <span>
                                {item.guestCount || 0}{' '}
                                {item.guestCount === 1 ? 'acomp.' : 'acomp.'}
                              </span>
                            ) : (
                              <span className="text-sage-400">—</span>
                            )}
                          </td>

                          {/* Total Personas */}
                          <td className="py-3.5 px-3 font-medium text-forest text-sm">
                            {isAttending ? (
                              <span className="inline-flex items-center gap-1 font-semibold text-emerald-900">
                                {totalPeople} {totalPeople === 1 ? 'persona' : 'personas'}
                              </span>
                            ) : (
                              <span className="text-stone-400">0</span>
                            )}
                          </td>

                          {/* Fecha */}
                          <td className="py-3.5 px-3 text-sage-600 text-[11px] whitespace-nowrap">
                            {formatDateDisplay(item.createdAt)}
                          </td>

                          {/* Mensaje */}
                          <td className="py-3.5 px-3 text-sage-600 max-w-xs truncate">
                            {item.message ? `"${item.message}"` : <span className="text-sage-300">—</span>}
                          </td>

                          {/* Acciones */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              {/* Ver Detalle */}
                              <button
                                type="button"
                                onClick={() => setSelectedDetail(item)}
                                className="p-1.5 text-sage-600 hover:text-forest hover:bg-sage-100 rounded transition-colors"
                                title="Ver detalles"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>

                              {/* Editar */}
                              <button
                                type="button"
                                onClick={() => setSelectedEdit(item)}
                                className="p-1.5 text-sage-600 hover:text-forest hover:bg-sage-100 rounded transition-colors"
                                title="Editar"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>

                              {/* Eliminar */}
                              <button
                                type="button"
                                onClick={() => setSelectedDelete(item)}
                                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title="Eliminar"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* VISTA MOBILE: LISTA DE TARJETAS RESPONSIVE */}
              <div className="md:hidden divide-y divide-sage-200">
                {filteredAndSortedList.map((item) => {
                  const isAttending = item.attending === 'yes';
                  const totalPeople = isAttending ? 1 + (item.guestCount || 0) : 0;
                  const cleanPhone = item.phone.replace(/[^0-9]/g, '');

                  return (
                    <div key={item.id} className="p-4 space-y-3 font-serif">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-medium text-forest">
                            {item.fullName}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-sage-600 mt-0.5">
                            <span>{item.phone}</span>
                            {cleanPhone && (
                              <a
                                href={`https://wa.me/${cleanPhone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-600 font-sans"
                              >
                                [WhatsApp]
                              </a>
                            )}
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isAttending
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {isAttending ? 'Asiste' : 'No asiste'}
                        </span>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-[#FAF8F5] p-2.5 rounded border border-sage-200/50">
                        <div>
                          <span className="text-sage-500 uppercase text-[10px]">Total personas:</span>
                          <p className="font-semibold text-forest mt-0.5">
                            {isAttending ? `${totalPeople} personas` : '0 personas'}
                          </p>
                        </div>
                        <div>
                          <span className="text-sage-500 uppercase text-[10px]">Acompañantes:</span>
                          <p className="text-forest mt-0.5">{isAttending ? item.guestCount || 0 : 0}</p>
                        </div>
                      </div>

                      {item.message && (
                        <p className="text-xs text-sage-700 italic bg-[#FAF8F5] p-2 rounded border border-sage-200/40">
                          &ldquo;{item.message}&rdquo;
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-sage-200/40 text-xs">
                        <span className="text-sage-400 text-[11px]">
                          {formatDateDisplay(item.createdAt)}
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedDetail(item)}
                            className="px-2.5 py-1 text-xs border border-sage-300 rounded text-forest"
                          >
                            Detalle
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedEdit(item)}
                            className="px-2.5 py-1 text-xs border border-sage-300 rounded text-forest"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedDelete(item)}
                            className="px-2.5 py-1 text-xs border border-red-300 text-red-600 rounded"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modales */}
      {selectedDetail && (
        <ConfirmationDetailModal
          confirmation={selectedDetail}
          onClose={() => setSelectedDetail(null)}
          onEdit={(c) => {
            setSelectedDetail(null);
            setSelectedEdit(c);
          }}
          onDelete={(c) => {
            setSelectedDetail(null);
            setSelectedDelete(c);
          }}
        />
      )}

      {selectedEdit && (
        <ConfirmationEditModal
          confirmation={selectedEdit}
          onClose={() => setSelectedEdit(null)}
          onSave={handleSaveEdit}
        />
      )}

      {selectedDelete && (
        <ConfirmationDeleteModal
          confirmation={selectedDelete}
          onClose={() => setSelectedDelete(null)}
          onConfirmDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
}
