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
  roles: {
    receptionist: 'Receptionist',
    admin: 'Administrator',
  },
  nav: {
    dashboard: 'Home',
    registrationRequests: 'Requests',
    readers: 'Readers',
    reports: 'Reports',
    users: 'Users',
  },
  layout: {
    language: 'Language',
    changePassword: 'Change password',
    signOut: 'Sign out',
  },
  auth: {
    login: {
      title: 'Sign in',
      subtitle: 'Reader registration and access cards',
      username: 'Username',
      password: 'Password',
      submit: 'Sign in',
    },
    password: {
      title: 'Change password',
      hint: 'After the change every session on every device is closed and you need to sign in again.',
      current: 'Current password',
      next: 'New password',
      confirm: 'Repeat the new password',
      submit: 'Change',
      changed: 'Password changed. Sign in with the new password.',
    },
    forbidden: {
      title: 'No access',
      description: 'This page is for administrators only.',
    },
  },
  dashboard: {
    welcome: 'Welcome, {name}',
  },
  notFound: {
    title: 'Page not found',
    description: 'This page does not exist or has moved.',
    home: 'Back to home',
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
    password: '8-128 characters with at least one letter and one digit.',
    passwordsMismatch: 'The passwords do not match.',
    invalid: 'The value is invalid.',
  },
};
