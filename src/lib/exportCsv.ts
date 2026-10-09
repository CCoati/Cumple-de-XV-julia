import type { RSVPDocument } from '@/types/rsvp';

/**
 * Sanitiza un valor para evitar ataques de CSV Injection (Formula Injection).
 * Si el texto comienza con caracteres de fórmula (=, +, -, @, tab, retorno),
 * se le antepone una comilla simple (') para que Excel lo trate exclusivamente como texto literal.
 */
function sanitizeCsvValue(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '""';

  let str = String(value).trim();

  // Prevención de CSV Injection
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  // Escapar comillas dobles existentes duplicándolas (" -> "")
  const escaped = str.replace(/"/g, '""');

  return `"${escaped}"`;
}

/**
 * Formatea la fecha de Firestore para el archivo CSV.
 */
function formatCsvDate(raw: unknown): string {
  if (!raw) return 'Sin fecha';
  try {
    const rawObj = raw as { toDate?: () => Date };
    const date = typeof rawObj.toDate === 'function' ? rawObj.toDate() : new Date(raw as string | number);
    return date.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Sin fecha';
  }
}

/**
 * Exporta el listado completo de confirmaciones en formato CSV compatible con
 * Microsoft Excel y Google Sheets en configuraciones regionales hispanohablantes.
 *
 * Características de seguridad y compatibilidad:
 * - Separador punto y coma (;) estándar para Excel en español.
 * - Codificación UTF-8 con BOM (\uFEFF) para visualización correcta de tildes y caracteres especiales.
 * - Sanitización contra inyección de fórmulas CSV.
 * - Nombre de archivo estandarizado con fecha actual (YYYY-MM-DD).
 */
export function exportConfirmationsToCsv(confirmations: RSVPDocument[]): void {
  const headers = [
    'Nombre completo',
    'Teléfono',
    'Asistencia',
    'Cantidad de acompañantes',
    'Nombres de acompañantes',
    'Total de personas confirmadas',
    'Mensaje',
    'Fecha de confirmación',
  ];

  const rows = confirmations.map((item) => {
    const isAttending = item.attending === 'yes';
    const totalPeople = isAttending ? 1 + (Number(item.guestCount) || 0) : 0;
    const companionNames =
      isAttending && Array.isArray(item.guestNames) && item.guestNames.length > 0
        ? item.guestNames.filter(Boolean).join(', ')
        : 'Ninguno';

    return [
      sanitizeCsvValue(item.fullName),
      sanitizeCsvValue(item.phone),
      sanitizeCsvValue(isAttending ? 'Sí, asiste' : 'No asistirá'),
      sanitizeCsvValue(isAttending ? item.guestCount || 0 : 0),
      sanitizeCsvValue(companionNames),
      sanitizeCsvValue(totalPeople),
      sanitizeCsvValue(item.message || 'Sin mensaje'),
      sanitizeCsvValue(formatCsvDate(item.createdAt)),
    ].join(';');
  });

  // Generar contenido CSV con BOM UTF-8 (\uFEFF)
  const csvContent = '\uFEFF' + [headers.map((h) => `"${h}"`).join(';'), ...rows].join('\r\n');

  // Crear Blob y enlace de descarga
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Fecha actual en formato AAAA-MM-DD
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const filename = `confirmaciones-julia-xv-${year}-${month}-${day}.csv`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
