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
  roles: {
    receptionist: 'Resepshn',
    admin: 'Administrator',
  },
  nav: {
    dashboard: 'Bosh sahifa',
    registrationRequests: 'Arizalar',
    readers: 'Kitobxonlar',
    reports: 'Hisobotlar',
    users: 'Foydalanuvchilar',
  },
  layout: {
    language: 'Til',
    changePassword: "Parolni o'zgartirish",
    signOut: 'Chiqish',
  },
  auth: {
    login: {
      title: 'Tizimga kirish',
      subtitle: "Kitobxonlarni ro'yxatga olish va kirish kartalari",
      username: 'Login',
      password: 'Parol',
      submit: 'Kirish',
    },
    password: {
      title: "Parolni o'zgartirish",
      hint: "Parol o'zgargach barcha qurilmalardagi sessiyalar yopiladi va qaytadan kirishingiz kerak bo'ladi.",
      current: 'Joriy parol',
      next: 'Yangi parol',
      confirm: 'Yangi parolni takrorlang',
      submit: "O'zgartirish",
      changed: "Parol o'zgartirildi. Yangi parol bilan kiring.",
    },
    forbidden: {
      title: "Ruxsat yo'q",
      description: 'Bu sahifa faqat administratorlar uchun.',
    },
  },
  dashboard: {
    welcome: 'Xush kelibsiz, {name}',
  },
  notFound: {
    title: 'Sahifa topilmadi',
    description: "Bunday sahifa yo'q yoki u ko'chirilgan.",
    home: 'Bosh sahifaga qaytish',
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
    password: "8-128 belgi, kamida bitta harf va bitta raqam bo'lishi kerak.",
    passwordsMismatch: 'Parollar bir xil emas.',
    invalid: "Qiymat noto'g'ri.",
  },
} as const;
