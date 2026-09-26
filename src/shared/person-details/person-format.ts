const UZ_PHONE = /^\+998(\d{2})(\d{3})(\d{2})(\d{2})$/;

export interface PersonName {
  readonly lastName: string;
  readonly firstName: string;
  readonly middleName: string | null;
}

export function formatFullName({ lastName, firstName, middleName }: PersonName): string {
  return [lastName, firstName, middleName ?? ''].filter((part) => part !== '').join(' ');
}

export function formatPhone(phone: string): string {
  const match = UZ_PHONE.exec(phone);
  if (match === null) {
    return phone;
  }
  const [, operator, first, second, third] = match;
  return `+998 ${operator ?? ''} ${first ?? ''} ${second ?? ''} ${third ?? ''}`;
}
