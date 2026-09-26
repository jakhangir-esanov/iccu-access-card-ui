# ICCU UI — arxitektura

Qoidalarning qisqa ro'yxati `CLAUDE.md` da. Bu hujjat ularning sabablarini va kelishilgan qarorlarni yozadi. Backend shartnomasi: [backend-contract.md](backend-contract.md).

---

## 1. Maqsad

Bitta ilovada ikki zona:

| Zona | Kim uchun | Qurilma | Tarmoq |
|---|---|---|---|
| `/royxat` | Tashrif buyuruvchi (QR orqali) | Telefon, mobilga moslangan | Internetdan ochiq (`/api/public/*`) |
| `/admin` | Receptionist va Admin | Kutubxona kompyuteri | API faqat kutubxona tarmog'idan |

Admin panelda: arizalar navbati (real vaqtda), kitobxonlar (qidirish, yaratish, tahrirlash, uzaytirish, karta chop etish), dashboard va hisobotlar, foydalanuvchilar va Excel eksport (faqat Admin).

---

## 2. Texnologiyalar

| Vazifa | Tanlov | Izoh |
|---|---|---|
| Asos | React 19, Vite 8, TypeScript 6 (`strict`) | TS 7 (native) hali typescript-eslint bilan mos emas |
| UI | Tailwind CSS 4, shadcn/ui (`radix-nova`) | Komponentlar `src/shared/ui` da. `cn` — shadcn'ning rasmiy paketi (clsx + tailwind-merge o'rnida) |
| Server holati | TanStack Query | tofan-ui'dagi signal store'lar o'rnida |
| Jadval | TanStack Table | Server tomonda sahifalash va tartiblash |
| Forma | React Hook Form + Zod 4 | Zod sxemalari backend qoidalarini takrorlaydi |
| Marshrut | React Router 8 | Data router, lazy feature route'lari |
| Real vaqt | `@microsoft/signalr` | Arizalar hub'i |
| Grafik | Recharts | Dashboard, hisobot |
| Rasm kesish | react-easy-crop | 3:4 |
| Toast | sonner | shadcn'ning toast komponenti, faqat `core/feedback` orqali |
| Test | Vitest, Testing Library, jsdom | Ikki loyiha: `app` (jsdom), `scripts` (node) |
| Sifat | ESLint (typescript-eslint strict, type-checked), Prettier, Sheriff | Sheriff — import chegaralari |

Ataylab ishlatilmaydi (YAGNI): OpenAPI codegen, axios, global state kutubxonasi, mock backend, Clean Architecture qatlam papkalari, dark mode (kerak bo'lganda qo'shiladi).

---

## 3. Tuzilma va bog'lanish yo'nalishi

Tuzilma va jadval `CLAUDE.md` 3-bo'limida. Ikki joyda tekshiriladi:

- **Sheriff** (`sheriff.config.ts`) — haqiqiy import grafini `src/main.tsx` dan yuradi. Har bir modulning barcha teglari importga ruxsat berishi kerak, shuning uchun `core:<area>` teglari uchun `anyTag` qoidasi bor: ular faqat nishon sifatida (`shared` → `core:http`) ishlatiladi.
- **ESLint `no-restricted-imports`** — alias'lar (`@features/*`, `@core/*`, `@shared/*`) bo'yicha, test fayllarida ham va editor'da darhol ko'rinadi.

Sabab: feature'lar bir-biridan mustaqil qoladi, feature'ni o'chirish faqat uning route'i va menyu bandini buzadi.

---

## 4. Asosiy qarorlar

1. **Token xotirada**, refresh `HttpOnly` cookie'da (`Path=/api/auth`, `SameSite=Strict`). Shuning uchun dev'da ham API o'z origin'imiz orqali, Vite proxy bilan chaqiriladi (`vite.config.ts`).
2. **`api-client`** bitta joyda: `/api` prefiksi, Bearer header, `Result.data` ni ochish, ProblemDetails va bo'sh body'ni `ApiError` ga aylantirish, `details.` prefiksini olib tashlash.
3. **Xatolar kod bo'yicha** taniladi. Katalog kodlari uchun backend'ning `messages` matni, `*Validator` kodlari uchun o'z tarjimamiz.
4. **Rasmlar token bilan**: `authorized-image` rasmni blob qilib oladi. Yuklashdan oldin `photo-cropper` 3:4 ga kesadi.
5. **Excel**: `fetch` → blob → yuklab olish.
6. **Sana va vaqt**: backend UTC beradi, UI `Asia/Tashkent` da ko'rsatadi. `DateOnly` satr bo'lib qoladi.
7. **Enum'lar** `shared/models` da `const` obyekt, union tur va i18n yorliq kalitlari bilan.
8. **SignalR** faqat admin zonasida, login'dan keyin ulanadi.
9. **Karta chop etish**: 85 × 55 mm, CSS `@page`, alohida print sahifasi. Dizayn Figma'dagi `A4-13` (old tomoni) va `A4-11` (orqa tomoni) freymlarida.
10. **Tillar**: uz / ru / en, typed kalitlar. Yetishmagan tarjima build'ni buzadi.
11. **Izohsiz kod**: ESLint qoidasi (`iccu/no-comments`) va `scripts/check-no-comments.mjs` (JSON, CSS, Dockerfile va boshqalar).
12. **Sessiya** (`core/auth`): bitta `SessionStore` (oddiy TS klass, React'dan tashqarida), `useSyncExternalStore` bilan o'qiladi. Sabablari:
    - Refresh token har ishlatilganda almashadi va eski token qayta kelsa backend **barcha** sessiyalarni bekor qiladi. Shuning uchun refresh qat'iy bitta bo'lishi kerak: `restore()` va `refresh()` umumiy promise qaytaradi, StrictMode'dagi ikki marta effekt ham bitta so'rov yuboradi.
    - `apiClient` 401 da shu store'ning `refresh()` ini chaqiradi, shuning uchun store React daraxtidan oldin, modul darajasida ulanadi (`session.ts`).
    - Sessiya faqat admin route'iga kirilganda tiklanadi. `/royxat` internetdan ochiladi va u yerda `/api/auth/*` nginx'da yopiq.
    - Chiqishda `queryClient.clear()` qilinadi (boshqa xodim oldingi ma'lumotni ko'rmasin). "Chiqish" bosilganda qaytish yo'li saqlanmaydi, sessiya o'zi tugaganda saqlanadi.
13. **Route'lar**: har feature o'z `*.routes.ts` faylida route obyektlarini beradi, sahifalar `lazy: { Component }` bilan alohida chunk bo'lib yuklanadi. Yo'llar `core/config/app-paths.ts` da.

---

## 5. Deploy

Kelishilgan: **alohida nginx Docker image** (tofan-ui kabi), `/opt/iccu/web` ga ko'chirish emas.

```text
Internet / kutubxona tarmog'i
   |  :443
   v
[ edge nginx ]  TLS, IP allowlist (backend repo: deploy/nginx)
   |-- /api, /api/hubs  -> iccu-api:8080
   |-- /                -> iccu-web:8080   (shu repo'ning image'i)
```

- `iccu-web` image: `npm run build` natijasi + nginx, faqat statik fayllar. SPA uchun `try_files ... /index.html`, `index.html` keshlanmaydi, hash'li fayllar uzoq keshlanadi.
- API proxy va IP allowlist edge nginx'da qoladi, shuning uchun `iccu-web` ichida `/api` yo'q.
- Backend repo'sida o'zgarishi kerak: `deploy/nginx/conf.d/iccu.conf` dagi `location /` → `proxy_pass http://iccu-web:8080`, `nginx.yml` dan `/opt/iccu/web` bind mount olib tashlanadi, `iccu-web` stack'i qo'shiladi. Bu 9-bosqichda qilinadi.
