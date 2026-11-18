# Agustian Siagian Law Firm — Landing Page

Landing page resmi satu halaman untuk **Agustian Siagian Law Firm** (Malang).

## Struktur Proyek

- `index.html` — Halaman utama semantik beserta metadata SEO & Open Graph
- `src/styles/main.css` — Design system dan tata letak responsif mobile-first
- `src/main.js` — Navigasi mobile & animasi scroll halus
- `public/logo-placeholder.svg` — Slot logo placeholder (`AS` monogram) yang dapat diganti dengan file logo resmi beresolusi tinggi
- `public/_headers` — Header keamanan dan cache untuk Cloudflare Pages

## Pengembangan Lokal

```bash
npm install
npm run dev
```

## Build Produksi & Deploy di Cloudflare Pages

- **Build command:** `npm run build`
- **Build output directory:** `dist`

```bash
npm run build
```

## Mengganti Logo Placeholder

Ganti file `public/logo-placeholder.svg` dengan file logo resmi (atau perbarui atribut `src` pada elemen `<img class="brand-logo">` di `index.html` dengan tetap mempertahankan `alt="Logo Agustian Siagian Law Firm"`).
