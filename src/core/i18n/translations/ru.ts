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
    invalid: 'Неверное значение.',
  },
};
