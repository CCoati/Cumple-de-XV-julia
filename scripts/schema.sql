-- Esquema para la gestión de confirmaciones de Julia XV en Supabase

CREATE TABLE IF NOT EXISTS public.confirmaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  cedula TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL,
  attending TEXT NOT NULL DEFAULT 'yes',
  guest_count INTEGER NOT NULL DEFAULT 0,
  guest_names TEXT[] NOT NULL DEFAULT '{}',
  message TEXT DEFAULT '',
  dietary_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Si la tabla ya fue creada previamente, añadir las columnas que falten:
ALTER TABLE public.confirmaciones ADD COLUMN IF NOT EXISTS cedula TEXT DEFAULT '';
ALTER TABLE public.confirmaciones ADD COLUMN IF NOT EXISTS dietary_notes TEXT DEFAULT '';

-- Índices de búsqueda y orden
CREATE INDEX IF NOT EXISTS idx_confirmaciones_created_at ON public.confirmaciones (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_confirmaciones_attending ON public.confirmaciones (attending);

-- Activar Row Level Security (RLS)
ALTER TABLE public.confirmaciones ENABLE ROW LEVEL SECURITY;

-- Borrar políticas previas si ya existen
DROP POLICY IF EXISTS "Permitir insertar confirmaciones publicamente" ON public.confirmaciones;
DROP POLICY IF EXISTS "Permitir acceso completo a usuarios autenticados" ON public.confirmaciones;

-- Permitir que invitados inserten sus confirmaciones desde la web
CREATE POLICY "Permitir insertar confirmaciones publicamente"
  ON public.confirmaciones
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Permitir al administrador (usuario logueado en Supabase Auth) ver, modificar y borrar confirmaciones
CREATE POLICY "Permitir acceso completo a usuarios autenticados"
  ON public.confirmaciones
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Habilitar Realtime para suscripción a confirmaciones en vivo
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'confirmaciones'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.confirmaciones;
  END IF;
END
$$;
