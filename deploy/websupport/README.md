# Nasadenie na WebSupport (VPS)

Táto aplikácia je **Next.js s Node.js serverom**. Na klasický PHP webhosting (len FTP) **nejde** nasadiť.

Potrebujete **VPS** alebo **VPS so Správou servera** od WebSupportu so SSH prístupom.

## Čo zostáva mimo servera (cloud služby)

Tieto služby môžu ostať ako teraz — server len hostuje web:

- **Supabase** — prihlásenie
- **Neon/Supabase Postgres** — databáza (`DATABASE_URL`)
- **Stripe** — platby (zmeňte webhook URL na novú doménu)
- **Mux** — videá
- **Vercel Blob** — PDF prílohy (`BLOB_READ_WRITE_TOKEN` funguje aj mimo Vercelu)

## Rýchly postup

### 1. DNS

V WebSupport administrácii nasmerujte doménu (napr. `kurz.mamymimodavu.sk`) na **IP VPS**.

### 2. SSH na VPS

```bash
ssh root@IP_VPS
```

### 3. Spustite setup skript

```bash
git clone https://github.com/MelodramatiqueCode/video-kurz-platforma.git
cd video-kurz-platforma
cp deploy/websupport/env.production.example .env
nano .env   # skopírujte hodnoty z lokálneho .env / Vercelu
bash deploy/websupport/setup-server.sh kurz.vasadomena.sk
```

Ak `.env` ešte nie je vyplnený, skript skončí s výzvou — doplňte ho a spustite znova.

### 4. Po nasadení aktualizujte integrácie

| Služba | Čo zmeniť |
|--------|-----------|
| **Stripe** | Webhook: `https://VAŠA-DOMÉNA/api/stripe/webhook` |
| **Supabase** | Site URL + Redirect URLs na novú doménu |
| **Google Cloud** | JavaScript origin: `https://VAŠA-DOMÉNA` |
| **Vercel env** | `NEXT_PUBLIC_APP_URL=https://VAŠA-DOMÉNA` (v `.env` na serveri) |

## Manuálny update

```bash
cd /var/www/video-kurz-platforma
git pull
npm ci
npm run build
pm2 restart video-kurz-platforma
```

## Bez VPS — alternatíva

Ak máte len **klasický webhosting**, nechajte aplikáciu na **Verceli** a na WebSupport nasmerujte **doménu** CNAME záznamom na Vercel. To je najjednoduchšia cesta bez správy servera.
