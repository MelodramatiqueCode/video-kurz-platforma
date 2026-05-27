# Video kurz platforma

Denný video program s prístupom po platbe, progress checkboxmi, PDF prílohami a admin CMS.

## Stack

- Next.js 16 App Router
- Prisma + PostgreSQL (Neon)
- Supabase Auth
- Stripe Checkout
- Mux video streaming
- Vercel Blob pre PDF

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
