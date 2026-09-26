export const uz = {
  app: {
    name: 'ICCU',
    fullName: "O'zbekiston Islom sivilizatsiyasi markazi kutubxonasi",
  },
  locale: {
    uz: "O'zbekcha",
    ru: 'Русский',
    en: 'English',
  },
  common: {
    cancel: 'Bekor qilish',
    confirm: 'Tasdiqlash',
    close: 'Yopish',
    save: 'Saqlash',
    delete: "O'chirish",
    retry: 'Qayta urinish',
    loading: 'Yuklanmoqda...',
  },
  confirm: {
    title: 'Ishonchingiz komilmi?',
  },
  errors: {
    unexpected: "Kutilmagan xato yuz berdi. Keyinroq qayta urinib ko'ring.",
    network: "Server bilan aloqa yo'q. Internet yoki tarmoqni tekshiring.",
    unauthorized: 'Sessiya tugadi. Qaytadan kiring.',
    forbidden: "Bu amal uchun ruxsatingiz yo'q.",
    outsideLibraryNetwork: "Admin panel faqat kutubxona tarmog'idan ishlaydi.",
    tooManyRequests: "So'rovlar juda ko'p. Birozdan keyin qayta urinib ko'ring.",
    duplicateKey: "Bu yozuv hozirgina boshqa so'rov bilan saqlandi. Sahifani yangilang.",
    validation: "Bir yoki bir nechta maydon noto'g'ri to'ldirilgan.",
  },
  validation: {
    required: "Maydon to'ldirilishi shart.",
    tooLong: 'Qiymat juda uzun.',
    tooShort: 'Qiymat juda qisqa.',
    invalidLength: "Qiymat uzunligi noto'g'ri.",
    invalid: "Qiymat noto'g'ri.",
  },
} as const;
