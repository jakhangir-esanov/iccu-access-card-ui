export const AppSegment = {
  publicRegistration: 'royxat',
  admin: 'admin',
  login: 'login',
  forbidden: 'forbidden',
  password: 'password',
  registrationRequests: 'requests',
  readers: 'readers',
  reports: 'reports',
  users: 'users',
} as const;

const admin = `/${AppSegment.admin}`;

export const AppPath = {
  root: '/',
  publicRegistration: `/${AppSegment.publicRegistration}`,
  admin,
  login: `${admin}/${AppSegment.login}`,
  forbidden: `${admin}/${AppSegment.forbidden}`,
  password: `${admin}/${AppSegment.password}`,
  registrationRequests: `${admin}/${AppSegment.registrationRequests}`,
  readers: `${admin}/${AppSegment.readers}`,
  reports: `${admin}/${AppSegment.reports}`,
  users: `${admin}/${AppSegment.users}`,
} as const;

export const ANY_PATH = '*';
