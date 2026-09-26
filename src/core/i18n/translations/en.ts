import type { Dictionary } from './dictionary';

export const en: Dictionary = {
  app: {
    name: 'ICCU',
    fullName: 'Library of the Center for Islamic Civilization in Uzbekistan',
  },
  locale: {
    uz: "O'zbekcha",
    ru: 'Русский',
    en: 'English',
  },
  common: {
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    save: 'Save',
    delete: 'Delete',
    retry: 'Try again',
    loading: 'Loading...',
  },
  confirm: {
    title: 'Are you sure?',
  },
  errors: {
    unexpected: 'Something went wrong. Please try again later.',
    network: 'Cannot reach the server. Check the internet or the network.',
    unauthorized: 'Your session has ended. Please sign in again.',
    forbidden: 'You do not have permission for this action.',
    outsideLibraryNetwork: 'The admin panel works only from the library network.',
    tooManyRequests: 'Too many requests. Please try again in a moment.',
    duplicateKey: 'This record was just saved by another request. Refresh the page.',
    validation: 'One or more fields are filled in incorrectly.',
  },
  validation: {
    required: 'This field is required.',
    tooLong: 'The value is too long.',
    tooShort: 'The value is too short.',
    invalidLength: 'The value has the wrong length.',
    invalid: 'The value is invalid.',
  },
};
