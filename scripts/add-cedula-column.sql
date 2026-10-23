-- Ejecutá esta consulta en el SQL Editor de tu panel de Supabase
-- para añadir la columna 'cedula' a la tabla 'confirmaciones':

ALTER TABLE public.confirmaciones 
ADD COLUMN IF NOT EXISTS cedula TEXT DEFAULT '';
