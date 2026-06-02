# Doména cez WebSupport → Vercel (CNAME)

Najjednoduchší spôsob: aplikácia zostáva na **Verceli**, doména sa spravuje v **WebSupport**.

Cieľová adresa: **`kurzy.mamymimodavu.sk`**

---

## 1. Pridaj doménu vo Verceli

1. Otvor [Vercel → video-kurz-platforma → Settings → Domains](https://vercel.com/melodramatique/video-kurz-platforma/settings/domains)
2. Klikni **Add** a zadaj `kurzy.mamymimodavu.sk`
3. Vercel ukáže požadovaný **DNS záznam** — pre `mapa.mamymimodavu.sk` už používate:

| Typ | Názov (host) | Hodnota (cieľ) |
|-----|--------------|----------------|
| **CNAME** | `kurzy` | `edc0921f296abe7d.vercel-dns-017.com` |

> Presná hodnota môže byť aj iná (napr. `216.150.1.1` alebo project-specific) — **vždy kopíruj to, čo ukáže Vercel** pri pridávaní domény.

Po overení DNS Vercel vystaví **SSL** automaticky (pár minút až hodina).

---

## 2. DNS v WebSupport

1. Prihlás sa do [WebSupport administrácie](https://admin.websupport.sk)
2. **Domény** → `mamymimodavu.sk` → **DNS záznamy** / **Správa zón**
3. **Zmaž** starý **A záznam** `kurzy` → `37.9.175.34` (WebSupport holding / „vlastná webstránka“)
4. **Zmaž** prípadnú WebSupport „webstránku“ alebo holding pre subdoménu `kurzy`
5. Pridaj alebo nechaj len CNAME záznam:

```
Typ:      CNAME
Host:     kurzy
Cieľ:     edc0921f296abe7d.vercel-dns-017.com
TTL:      3600 (alebo predvolené)
```

6. Ulož a počkaj na propagáciu (5–60 min)

Overenie:

```bash
dig kurzy.mamymimodavu.sk CNAME +short
dig kurzy.mamymimodavu.sk A +short
```

`A` by mal vrátiť Vercel IP (nie `37.9.175.34`).

---

## 3. Env premenná na Verceli

Po aktivácii domény nastav produkčnú URL:

```bash
cd video-kurz-platforma
./node_modules/.bin/vercel env rm NEXT_PUBLIC_APP_URL production --yes
./node_modules/.bin/vercel env add NEXT_PUBLIC_APP_URL production \
  --value 'https://kurzy.mamymimodavu.sk' --yes
./node_modules/.bin/vercel deploy --prod --yes
```

Táto premenná ovplyvňuje Stripe redirecty, emaily a OAuth callback URL.

---

## 4. Aktualizuj integrácie

| Služba | Kam | Čo pridať |
|--------|-----|-----------|
| **Supabase** | Authentication → URL Configuration | Site URL: `https://kurzy.mamymimodavu.sk` |
| | | Redirect URLs: `https://kurzy.mamymimodavu.sk/**` |
| **Stripe** | Webhooks | Endpoint: `https://kurzy.mamymimodavu.sk/api/stripe/webhook` |
| **Google Cloud** | OAuth → JavaScript origins | `https://kurzy.mamymimodavu.sk` |
| **Google Cloud** | OAuth → redirect URIs | *bez zmeny* (Supabase callback ostáva) |

---

## 5. Hotovo

Otvor `https://kurzy.mamymimodavu.sk` — mala by sa zobraziť rovnaká appka ako na `video-kurz-platforma.vercel.app`.

Starú Vercel URL môžeš nechať ako zálohu, alebo ju vo Verceli presmeruj na novú doménu (Settings → Domains → Redirect).

---

## Ak doména neoverí

- Skontroluj, či CNAME smeruje presne podľa Vercelu (bez `https://`, bez lomítka na konci)
- V WebSupport nesmie byť duplicitný **A záznam** pre `kurzy` (WebSupport holding) súčasne s CNAME na Vercel
- Po zmene DNS chvíľu počkaj a vo Verceli klikni **Refresh** pri doméne
