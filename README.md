# Video kurz platforma

Denný video program s prístupom po platbe, progress checkboxmi, PDF prílohami a admin CMS.

## Stack

- Next.js 16 App Router
- Prisma + PostgreSQL (Neon)
- Supabase Auth
- Stripe Checkout
- Mux video streaming
- Vercel Blob pre PDF

## Rýchly setup produkcie

### 1. Základné env premenné (hotové)
Na Verceli sú už nastavené:
- `DATABASE_URL` (Supabase, samostatná schéma `video_kurz`)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `ADMIN_EMAILS`
- `BLOB_READ_WRITE_TOKEN`

Synchronizácia z lokálnych projektov:

```bash
node scripts/sync-vercel-env.mjs
```

### 2. Supabase Auth (potrebné dokončiť)
1. Otvorte [Supabase API settings](https://supabase.com/dashboard/project/rdulzfcijhjlgxmkmqse/settings/api)
2. Skopírujte **anon public** kľúč
3. Nastavte ho:

```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..." node scripts/sync-vercel-env.mjs
```

4. V Supabase → Authentication → URL Configuration pridajte:
   - Site URL: `https://video-kurz-platforma.vercel.app`
   - Redirect URLs: `https://video-kurz-platforma.vercel.app/**`, `http://localhost:3000/**`
   - Callback pre Google: `https://video-kurz-platforma.vercel.app/auth/callback`

5. V Supabase → Authentication → Providers zapnite **Google** a uložte Client ID/Secret z Google Cloud Console.

### 3. Stripe
1. Vytvorte Product + Price v [Stripe dashboarde](https://dashboard.stripe.com/test/products)
2. `price_...` ID vložte v `/admin`
3. Pridajte env premenné:

```bash
STRIPE_SECRET_KEY="sk_test_..." STRIPE_WEBHOOK_SECRET="whsec_..." node scripts/sync-vercel-env.mjs
```

4. Webhook endpoint: `https://video-kurz-platforma.vercel.app/api/stripe/webhook`
   - Event: `checkout.session.completed`

### 4. Mux (videá)
1. Vytvorte Access Token v [Mux dashboarde](https://dashboard.mux.com/settings/access-tokens)
2. Nastavte:

```bash
MUX_TOKEN_ID="..." MUX_TOKEN_SECRET="..." node scripts/sync-vercel-env.mjs
```

### 5. Redeploy po doplnení kľúčov

```bash
./node_modules/.bin/vercel deploy --prod --yes
```

## Lokálny štart

1. Skopírujte `.env.example` do `.env` a vyplňte hodnoty.
2. V Supabase vytvorte projekt a zapnite email auth.
3. V Stripe vytvorte Product + Price a `price_...` ID vložte v admin sekcii.
4. Spustite databázu a migráciu:

```bash
npm install
npx prisma db push
npm run dev
```

5. Otvorte `/admin`, nastavte program, pridajte dni a lekcie.
6. Pre test prístupu bez platby použite „Manuálne udeliť prístup“ v admin sekcii.

## Deploy na Vercel

1. Importujte repozitár do Vercel.
2. Pridajte všetky env premenné z `.env.example`.
3. V Stripe nastavte webhook na `https://VASE-DOMENA/api/stripe/webhook` pre event `checkout.session.completed`.
4. V Mux povolte signed playback policy (už nastavené pri direct upload).
5. V Supabase pridajte production URL do redirect URLs.

## Hlavné URL

- `/` predajná stránka
- `/prihlasenie` login / registrácia
- `/program` dashboard študenta
- `/program/den/[slug]` deň s videom a prílohami
- `/admin` správa obsahu
