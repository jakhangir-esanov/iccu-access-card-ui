# ICCU Access Card UI

O'zbekiston Islom sivilizatsiyasi markazi kutubxonasi uchun kitobxonlarni ro'yxatga olish va kirish kartasini chop etish tizimining frontend'i.

- `/royxat` — QR orqali ochiladigan ochiq anketa (telefon uchun).
- `/admin` — receptionist va administrator paneli.

Backend: `iccu-access-card` repo'si (.NET 10). API shartnomasi: [docs/backend-contract.md](docs/backend-contract.md).

## Ishga tushirish

Talablar: Node.js 24+, npm, lokal ishlab turgan backend (`http://localhost:5080`).

```bash
npm install
npm run dev
```

Ilova `http://localhost:5173` da ochiladi. `/api` so'rovlari Vite proxy orqali backend'ga ketadi (refresh cookie shu tufayli ishlaydi). Lokal foydalanuvchilar: [docs/backend-contract.md](docs/backend-contract.md), 9-bo'lim.

## Buyruqlar

| Buyruq | Vazifa |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | tip tekshiruvi va production build (`dist/`) |
| `npm test` | Vitest |
| `npm run lint` | ESLint, izoh tekshiruvi, Sheriff chegaralari, Prettier |
| `npm run format` | Prettier bilan formatlash |

## Hujjatlar

- [CLAUDE.md](CLAUDE.md) — kod qoidalari
- [docs/architecture.md](docs/architecture.md) — tuzilma va qarorlar
- [docs/roadmap.md](docs/roadmap.md) — bosqichlar va ochiq savollar
