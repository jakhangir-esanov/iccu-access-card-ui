import type { Dictionary } from './dictionary';

export const ru: Dictionary = {
  app: {
    name: 'ICCU',
    fullName: 'Библиотека Центра исламской цивилизации в Узбекистане',
  },
  locale: {
    uz: "O'zbekcha",
    ru: 'Русский',
    en: 'English',
  },
  common: {
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    close: 'Закрыть',
    save: 'Сохранить',
    delete: 'Удалить',
    retry: 'Повторить',
    loading: 'Загрузка...',
  },
  roles: {
    receptionist: 'Ресепшн',
    admin: 'Администратор',
  },
  nav: {
    dashboard: 'Главная',
    registrationRequests: 'Заявки',
    readers: 'Читатели',
    reports: 'Отчёты',
    users: 'Пользователи',
  },
  layout: {
    language: 'Язык',
    changePassword: 'Сменить пароль',
    signOut: 'Выйти',
  },
  auth: {
    login: {
      title: 'Вход в систему',
      subtitle: 'Регистрация читателей и читательские билеты',
      username: 'Логин',
      password: 'Пароль',
      submit: 'Войти',
    },
    password: {
      title: 'Смена пароля',
      hint: 'После смены пароля все сессии на всех устройствах будут закрыты, нужно будет войти заново.',
      current: 'Текущий пароль',
      next: 'Новый пароль',
      confirm: 'Повторите новый пароль',
      submit: 'Сменить',
      changed: 'Пароль изменён. Войдите с новым паролем.',
    },
    forbidden: {
      title: 'Нет доступа',
      description: 'Эта страница только для администраторов.',
    },
  },
  dashboard: {
    welcome: 'Добро пожаловать, {name}',
  },
  notFound: {
    title: 'Страница не найдена',
    description: 'Такой страницы нет или она была перемещена.',
    home: 'На главную',
  },
  confirm: {
    title: 'Вы уверены?',
  },
  errors: {
    unexpected: 'Произошла непредвиденная ошибка. Попробуйте позже.',
    network: 'Нет связи с сервером. Проверьте интернет или сеть.',
    unauthorized: 'Сессия истекла. Войдите снова.',
    forbidden: 'У вас нет прав на это действие.',
    outsideLibraryNetwork: 'Админ-панель работает только из сети библиотеки.',
    tooManyRequests: 'Слишком много запросов. Попробуйте чуть позже.',
    duplicateKey: 'Эта запись только что сохранена другим запросом. Обновите страницу.',
    validation: 'Одно или несколько полей заполнены неверно.',
  },
  validation: {
    required: 'Поле обязательно для заполнения.',
    tooLong: 'Значение слишком длинное.',
    tooShort: 'Значение слишком короткое.',
    invalidLength: 'Неверная длина значения.',
    password: 'От 8 до 128 символов, минимум одна буква и одна цифра.',
    passwordsMismatch: 'Пароли не совпадают.',
    invalid: 'Неверное значение.',
  },
};
