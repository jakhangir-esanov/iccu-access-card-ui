# ICCU UI — yo'l xaritasi

Har bosqich: kod, testlar, `npm run lint` + `npm test` + `npm run build` o'tadi, API'ga tegadigan bosqich haqiqiy backend bilan tekshiriladi (backend'dagi "kutubxonada bir kun" ssenariysi). Commit faqat foydalanuvchi so'raganda.

| # | Bosqich | Natija | Holat |
|---|---|---|---|
| 0 | **Poydevor** | Vite + React + TS strict, Tailwind + shadcn/ui, tema, ESLint + Prettier + Sheriff + izoh tekshiruvi, Vitest, `@core` / `@shared` / `@features` alias'lari, Vite proxy, `CLAUDE.md`, `docs/`, README | Tayyor |
| 1 | **core** | `http` (api-client, ApiError, paging), `i18n` (uz/ru/en typed), `feedback` (toast, confirm) va ularning testlari | Tayyor |
| 2 | **Auth va shell** | login, sessiyani tiklash, 401 → refresh, rol guard'i, chiqish, parolni almashtirish, admin layout va rolga qarab menyu, 403/404 sahifalari | Tayyor |
| 3 | **QR anketa `/royxat`** | mobil forma, galereya/kamera, 3:4 kesish, anonim yuklash, rozilik, kod ekrani, rate limit va validatsiya xabarlari | Tayyor |
| 4 | **Arizalar navbati** | ro'yxat (status, qidiruv), SignalR (toast, ovoz, yangilash), kartochka va rasm, tahrirlash, tasdiqlash → kitobxonga o'tish, rad etish, "hujjat allaqachon bor" ogohlantirishi | Tayyor |
| 5 | **Kitobxonlar** | jadval (server paging/sort, filtrlar, qidiruv), kartochka, yaratish/tahrirlash rasm bilan, uzaytirish, o'chirish va eksport (Admin) | Tayyor |
| 6 | **Karta chop etish** | 85,6 × 54 mm (CR80) print sahifasi (Figma `A4-13` old, `A4-11` orqa), Code 128 shtrix-kod, chop etishni tasdiqlab qayd qilish | Tayyor |
| 7 | **Dashboard va hisobot** | kartochkalar, 30 kunlik grafik, toifalar; davr, kun/oy, manba va xodim kesimi | |
| 8 | **Foydalanuvchilar** | ro'yxat, yaratish, tahrirlash (rol, faollik), parolni tiklash | |
| 9 | **Deploy** | `iccu-web` nginx image, backend `deploy/` dagi edge nginx va stack o'zgarishlari, to'liq ssenariy | |

---

## Kelishilgan javoblar (2026-09-26)

- **Tillar**: uz / ru / en boshidanoq.
- **Deploy**: alohida nginx Docker image ([architecture.md](architecture.md), 5-bo'lim).
- **Figma**: `https://www.figma.com/design/JVNOC1Q89vSuBRoA1wqkPx/Untitled`. `A4-13` — kartaning old tomoni, `A4-11` — orqa tomoni. Figma MCP `alibaba.esanov@gmail.com` hisobi bilan ishlaydi, fayl shu hisobga (edit huquqi bilan) ulashilishi kerak.
- **Karta chop etish (6-bosqich)**: dizayn Figma'dan aniq ko'chiriladi; shtrix-kod yoki QR faqat Figma'da bo'lsa qo'shiladi. Chop etish backend'da (`POST /readers/{id}/prints`) print oynasi yopilgach xodim "chop etildi" deb tasdiqlagandan keyin qayd qilinadi, chunki brauzer bekor qilinganini bilmaydi.

## Eslatmalar

- **Dashboard**: hozircha `/admin` da faqat salomlashish sahifasi. To'liq dashboard 7-bosqichda.
- **Menyu**: arizalar, kitobxonlar, hisobotlar va foydalanuvchilar bandlari bor, lekin sahifalari tegishli bosqichlarda qo'shiladi (hozir admin layout ichida 404).
- **`RequireAdmin`**: 8-bosqichda (foydalanuvchilar) qo'shiladi, 403 sahifasi tayyor.
- **Bundle**: asosiy chunk ~517 kB (gzip ~165 kB), Vite ogohlantiradi. 9-bosqichda vendor chunk'larga bo'linadi.
- **Rozilik matni**: "Shaxsiy ma'lumotlarim kutubxona kartasini rasmiylashtirish uchun qayta ishlanishiga roziman." (uz/ru/en). Yuridik matn kutubxona bilan tasdiqlanishi kerak.
- **Lokal test arizasi**: 3-bosqich tekshiruvida `0001` kodli ariza yaratildi (Karimova Gulnoza, Talaba). 4-bosqichda navbatni sinash uchun ishlatiladi.
- **Lokal test kitobxoni**: 5-bosqich tekshiruvida `0000002` (Toshmatov Botir) yaratilib, o'chirildi. Karta raqamlari qayta berilmagani uchun lokal bazada keyingi kitobxon `0000003` oladi.
- **Karta holati**: ro'yxat va kartochkada `cardStatusOf(expiresOn, bugun)` bilan hisoblanadi (backend qoidasi: `expires_on < bugun` — muddati o'tgan, 30 kun ichida — tez orada tugaydi).
- **Printer kalibrovkasi**: Canon modeli ma'lum bo'lgach haqiqiy kartada tekshiriladi (hoshiya, chetsiz chop etish, ikki tomonlama tartib).
- **Lokal seed**: lokal bazada faqat `admin` bor edi. `resepshn` / `Resep12345` (Receptionist) 2026-09-26 da `POST /users` orqali qo'shildi.

## Ochiq savollar

1. **Figma**: karta Figma MCP orqali nusxa fayldan (`vIGJqyDGxD56mrkKoeECDy`) ko'chirildi. Admin panel ekranlari ham Figma'da bormi?
2. **Printer**: Canon'ning aniq modeli. Chetsiz chop etish, hoshiyalar va ikki tomonlama tartib shunga bog'liq.
3. **Brauzerlar**: kutubxona kompyuterlarida qaysi brauzer bor (Chrome/Edge)? Karta sahifasi nomlangan `@page` ishlatadi (Chrome/Edge 85+).
4. **Ovozli bildirishnoma**: hozir yangi ariza kelganda qisqa signal chalinadi (WebAudio). Kerak bo'lmasa o'chiriladi.
