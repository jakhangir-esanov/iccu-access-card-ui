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

Ataylab ishlatilmaydi (YAGNI): OpenAPI codegen, axios, global state kutubxonasi, mock backend, Clean Architecture qatlam papkalari.

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
9. **Karta chop etish** (`/admin/readers/:id/card`):
    - O'lcham **85,6 × 54 mm** (standart ID-1/CR80 plastik karta). Figma freymlari shu nisbatda; loyiha hujjatidagi 85 × 55 taxminiy edi.
    - Dizayn Figma'dan (nusxa fayl `vIGJqyDGxD56mrkKoeECDy`, old `1019:119`, orqa `1019:30`) Figma MCP orqali aniq qiymatlarda ko'chirilgan: 856 × 540 px freym = 85,6 × 54 mm, 10 px = 1 mm. Ranglar `#00703c` (yashil), `#eeeeee` (fon), `#045533` (toifa). Shrift Instrument Sans (`@fontsource-variable/instrument-sans`, faqat karta sahifasida yuklanadi). Render qilingan geometriya Figma'dan 0,06 mm ichida tekshirilgan. Karta matni doim inglizcha, toifa `en` lug'atidan katta harflarda. Raqam prefikssiz, 7 xonali. 30 va undan uzun F.I.Sh. 2,5 mm shriftda chiqadi.
    - Dizayn rahbariyat tasdiqlagan standart: Figma'dagi freymlardan chetga chiqilmaydi. 2026-09-27 dagi "Temuriy" qayta dizayn shu sababli bekor qilingan.
    - Chop etish: nomlangan `@page id-card` (85,6 × 54 mm, hoshiyasiz), har tomon alohida sahifa (`break-after: page`), `print-color-adjust: exact`. Admin layout va sahifa boshqaruvlari `print:hidden`. Ekranda karta `zoom: 2.2` bilan ko'rsatiladi.
    - Shtrix-kod: `jsbarcode`, Code 128, karta raqamini kodlaydi (SVG, `viewBox` bilan mm o'lchamga moslanadi).
    - Emblema: `src/shared/assets/iccu-emblem.png` — Figma'dagi asset (1024 × 1024, shaffof fon), old tomonda 11,5 × 11,8 mm, orqa tomonda 40,1 × 40,5 mm.
    - Figma'dagi 1 px qora ramka chizilmaydi: u kanvasda ko'rinish uchun, PVC kartada chetda chiziq bo'lib qoladi.
    - Chop etish tugmasi rasm yuklangandan keyin yoqiladi. `afterprint` dan keyin xodim "chop etildi" deb tasdiqlasa `POST /readers/{id}/prints` chaqiriladi.
10. **Tillar**: uz / ru / en, typed kalitlar. Yetishmagan tarjima build'ni buzadi.
11. **Izohsiz kod**: ESLint qoidasi (`iccu/no-comments`) va `scripts/check-no-comments.mjs` (JSON, CSS, Dockerfile va boshqalar).
12. **Sessiya** (`core/auth`): bitta `SessionStore` (oddiy TS klass, React'dan tashqarida), `useSyncExternalStore` bilan o'qiladi. Sabablari:
    - Refresh token har ishlatilganda almashadi va eski token qayta kelsa backend **barcha** sessiyalarni bekor qiladi. Shuning uchun refresh qat'iy bitta bo'lishi kerak: `restore()` va `refresh()` umumiy promise qaytaradi, StrictMode'dagi ikki marta effekt ham bitta so'rov yuboradi.
    - `apiClient` 401 da shu store'ning `refresh()` ini chaqiradi, shuning uchun store React daraxtidan oldin, modul darajasida ulanadi (`session.ts`).
    - Sessiya faqat admin route'iga kirilganda tiklanadi. `/royxat` internetdan ochiladi va u yerda `/api/auth/*` nginx'da yopiq.
    - Chiqishda `queryClient.clear()` qilinadi (boshqa xodim oldingi ma'lumotni ko'rmasin). "Chiqish" bosilganda qaytish yo'li saqlanmaydi, sessiya o'zi tugaganda saqlanadi.
13. **Rasm oqimi** (`shared/components/photo`): galereya yoki kamera (`capture="user"`) → brauzer rasmni ocha olishini tekshirish → `react-easy-crop` bilan 3:4 kesish → canvas orqali **600 × 800 JPEG (sifat 0.9)** → yuklash → `photoFileId`. Rasm har doim qayta kodlanadi, shuning uchun brauzer ocha oladigan har qanday format ishlaydi va hajm 8 MB chegarasidan ancha kichik bo'ladi. Yuklash funksiyasi prop sifatida beriladi: QR anketa `/public/files`, admin panel `/files` ishlatadi.
14. **PersonDetails** (`shared/person-details`): Zod sxemasi backend'dagi `PersonDetailsValidator` va normalizatsiyani takrorlaydi (telefon `+998...`, hujjat raqami katta harf va ajratgichlarsiz). Forma qiymatlari satr (select), sxema chiqishi esa backend DTO'si bilan bir xil turda. "Bugun" Toshkent sanasi bo'yicha, parametr sifatida beriladi.
15. **Grafiklar** (`shared/components/charts`, Recharts): ustun (bitta yoki stacked seriya), gorizontal bar, `ChartCard` (grafik/jadval almashtirgich — rangga suyanmaydigan ko'rinish), `StatTile`. Mark qoidalari: ustun qalinligi ≤ 24 px, uchi 4 px yumaloq, stacked segmentlar orasida 2 px fon rangli bo'shliq, gridline bitta rang, X o'qida ~10 belgi. Ikki seriyali ranglar (`--chart-1` lojuvard `#335aa6`, `--chart-2` feruza `#209993`) dataviz validatori bilan tekshirilgan (CVD ΔE 18,9, kontrast ≥ 3:1); shu sababli `--chart-1` oklch L 0,40 dan 0,48 ga ko'tarildi. Matn hech qachon seriya rangida emas. Oy nomlari Intl'dan emas, lug'atdan (`months.*`), chunki ba'zi brauzerlarda o'zbekcha ICU ma'lumoti yo'q.
16. **Foydalanuvchilar** (faqat Admin, `RequireAdmin` guard'i + backend `Policies.Admin`): yaratish, tahrirlash (rol, faollik), parolni tiklash dialoglari faqat ochilganda mount qilinadi (har safar toza forma). Maydonga bog'lanmagan backend xatosi dialog ichida ko'rsatiladi, `User.UsernameTaken` login maydoniga tushadi. Admin o'zini tahrirlaganda rol va faollik maydonlari umuman chiqmaydi (RHF'da `disabled` input qiymati submit'da yo'qoladi). Parol qoidasi `shared/validation/password.ts` da, auth va users uchun umumiy.
17. **Route'lar**: har feature o'z `*.routes.ts` faylida route obyektlarini beradi, sahifalar `lazy: { Component }` bilan alohida chunk bo'lib yuklanadi. Yo'llar `core/config/app-paths.ts` da.
18. **Dizayn tizimi — "Temuriy kutubxona"**. Markaz binosining uslubidan olingan: lojuvard gumbaz, peshtoq arkasi, girih, oltin. Arab yozuvi va diniy matn ishlatilmaydi, faqat geometriya.
    - **Ranglar** faqat `src/index.css` tokenlarida, kungi va tungi rejim uchun: lojuvard (`primary`, `deep`), tungi osmon (`sidebar`), feruza (`turquoise`), oltin (`gold`; matn uchun `gold-ink`, fon uchun `gold-soft`), marmar (`background`), qog'oz (`card`), terrakota (`destructive`). Holat belgilari `Badge` variantlarida: `success`, `warning`, `destructive`, `muted`.
    - **Shriftlar**: sarlavhalar Cormorant Garamond (`font-display`), matn va raqamlar Manrope (`font-sans`). `@fontsource-variable` paketlari, `main.tsx` da ulanadi. Kutubxona tarmog'ida internet cheklangan bo'lishi mumkin, shuning uchun Google Fonts emas. Ikkalasida kirill ham bor.
    - **Naqshlar**: `ornament-girih` (8 qirrali yulduzli girih, `::before` va CSS `mask`; rang tokendan, zichlik `--ornament-opacity` bilan), `ornament-strip` (hoshiya chizig'i), `KhatamStar` va `PortalArch` (`shared/components/ornaments`). SVG fayllar faqat shaklni beradi, rangni emas, shuning uchun tungi rejimda ham ishlaydi.
    - **O'lchamlar**: tugma va input 44 px (`h-11`), login maydonlari 52 px, jadval sarlavhasi 48 px, karta radiusi 20 px (`rounded-2xl`), sidebar 288 px, header 80 px + hoshiya, kontent `max-w-[90rem]` markazda.
    - **Admin shell**: sidebar menyusi guruhlarga bo'lingan (`menuSectionsFor`), aktiv band oltin yulduz bilan belgilanadi, jonli aloqa belgisi sidebar pastida. Header'da sana, til va akkaunt menyusi turadi. Akkaunt menyusida profil, parolni almashtirish, mavzu (kungi / tungi / tizim) va chiqish bor.
    - **Sahifalar**: sarlavha `shared/components/page-header`, filtrlar `shared/components/filter-panel` ichida. Dashboard'da salomlashuv paneli (kutilayotgan arizalar va "Yangi kitobxon") va 3 × 2 statistika kartalari.
    - Header'dagi hafta kuni ham oy nomlari kabi lug'atdan olinadi (`weekdays.*`), Intl'dan emas.
    - **Select**: native `<select>` qoladi (RHF `register`, testlar, klaviatura o'zgarmaydi), ochiladigan ro'yxati `appearance: base-select` bilan mavzu ranglarida bezatilgan (`index.css`, qatlamsiz, chunki `appearance-none` utility'sini bosishi kerak). Qo'llab-quvvatlamaydigan brauzerlarda tizim ro'yxati mavzu ranglarida qoladi.
    - **Sana tanlash** (`shared/components/form/date-picker.tsx`): barcha sana maydonlari (tug'ilgan sana, kitobxon filtri, hisobot davri) `<input type="date">` o'rniga Popover ichidagi `Calendar` (`shared/ui/calendar.tsx`, `react-day-picker`) bilan. Oy va yil tanlash o'sha bezatilgan select orqali, lokal `react-day-picker/locale` dan (`uz`, `ru`, `enGB`), hafta dushanbadan. Qiymat doim `YYYY-MM-DD` satr (`toLocalDate` / `fromLocalDate`), `min`/`max` dan tashqaridagi kunlar yopiq. Tug'ilgan sanada yillar eng yangisidan boshlanadi.
    - Kartochka ma'lumotlari `DetailList` da: ikki ustun, yorliq ustida kichik bosh harflar. `PersonDetailsFields` container query bilan keng joyda (`@2xl`) ikki ustunga o'tadi: kitobxon formasi va ariza dialogida ikki ustun, mobil anketada bitta.
    - shadcn `radix-nova` komponentlari `data-open`, `data-active`, `data-horizontal` kabi variantlarni ishlatadi, Radix esa `data-state` va `data-orientation` beradi. Shuning uchun ular `index.css` da `@custom-variant` bilan Radix atributlariga bog'langan (tablarning aktiv holati, dialog va menyu animatsiyalari shunga ishlaydi).

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
