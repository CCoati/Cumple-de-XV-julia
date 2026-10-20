import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer .env.local si existe
const envPath = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || '';
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[match[1]]) {
        process.env[match[1]] = value;
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no están configuradas en .env.local');
  process.exit(1);
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Uso: node scripts/create-admin-user.mjs <correo> <contraseña>');
  console.log('Ejemplo: node scripts/create-admin-user.mjs admin@julia15.com MiClaveSegura123');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  console.log(`Creando o verificando usuario admin para: ${email}...`);

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'admin' },
    app_metadata: { role: 'admin' },
  });

  if (error) {
    if (error.message.includes('already exists') || error.message.includes('unique')) {
      console.log(`El usuario ${email} ya existe en Supabase. Actualizando contraseña...`);
      // Buscar usuario por email
      const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) {
        console.error('Error al listar usuarios:', listError.message);
        process.exit(1);
      }
      const existingUser = usersData.users.find(u => u.email === email);
      if (existingUser) {
        const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
          password,
          email_confirm: true,
          user_metadata: { role: 'admin' },
          app_metadata: { role: 'admin' },
        });
        if (updateError) {
          console.error('Error al actualizar contraseña:', updateError.message);
          process.exit(1);
        }
        console.log(`✅ Contraseña del usuario ${email} actualizada con éxito.`);
        console.log(`Ya podés ingresar al panel de admin en http://localhost:3000/admin`);
        return;
      }
    }
    console.error('❌ Error al crear usuario en Supabase:', error.message);
    process.exit(1);
  }

  console.log(`✅ Usuario administrador creado con éxito!`);
  console.log(`ID: ${data.user.id}`);
  console.log(`Email: ${data.user.email}`);
  console.log(`Podés iniciar sesión en: /admin con este email y la contraseña indicada.`);
}

main();
