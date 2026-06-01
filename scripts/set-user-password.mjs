import { createClient } from "@supabase/supabase-js";

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Použitie: node scripts/set-user-password.mjs <email> <heslo>");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Chýba NEXT_PUBLIC_SUPABASE_URL alebo SUPABASE_SERVICE_ROLE_KEY v .env");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error: listError } = await supabase.auth.admin.listUsers();

if (listError) {
  console.error(listError.message);
  process.exit(1);
}

const user = data.users.find((item) => item.email?.toLowerCase() === email.toLowerCase());

if (!user) {
  console.error(`Používateľ ${email} neexistuje v Supabase Auth.`);
  process.exit(1);
}

const { error } = await supabase.auth.admin.updateUserById(user.id, { password });

if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(`Heslo bolo nastavené pre ${email}`);
