# Agustian Siagian Law Firm — Landing Page

Landing page resmi satu halaman untuk **Agustian Siagian Law Firm** (Malang).

## Struktur Proyek

- `index.html` — Halaman utama semantik beserta metadata SEO & Open Graph
- `src/styles/main.css` — Design system dan tata letak responsif mobile-first
- `src/main.js` — Navigasi mobile & animasi scroll halus
- `public/logo.svg` — Logo perisai resmi Agustian Siagian Law Firm
- `public/hero-soekarno.webp` & `public/hero-soekarno.jpg` — Latar ilustrasi monokrom lukisan tangan Ir. Soekarno untuk hero section
- `public/agustian-siagian.webp` & `public/agustian-siagian.jpg` — Foto resmi Advokat Agustian Anggi Siagian, S.H.
- `src/assets/fonts/Geist-Variable.woff2` — Font utama Geist Sans (self-hosted)
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
