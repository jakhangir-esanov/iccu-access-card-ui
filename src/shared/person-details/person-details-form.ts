import { Citizenship } from '@shared/models/citizenship';
import type { Gender } from '@shared/models/gender';
import type { ReaderCategory } from '@shared/models/reader-category';
import type { PersonDetailsFormInput } from './person-details.schema';

const PHONE_COUNTRY_PREFIX = '+998';

export interface SavedPersonDetails {
  readonly category: ReaderCategory;
  readonly lastName: string;
  readonly firstName: string;
  readonly middleName: string | null;
  readonly birthDate: string;
  readonly gender: Gender | null;
  readonly citizenship: Citizenship | null;
  readonly phone: string;
}

function toOptionValue(value: number | null): string {
  return value === null ? '' : String(value);
}

function toPhoneInput(phone: string, citizenship: Citizenship | null): string {
  const isForeign = citizenship === Citizenship.Foreign;
  if (isForeign || !phone.startsWith(PHONE_COUNTRY_PREFIX)) {
    return phone;
  }
  return phone.slice(PHONE_COUNTRY_PREFIX.length);
}

export function toPersonDetailsFormInput(details: SavedPersonDetails): PersonDetailsFormInput {
  return {
    category: String(details.category),
    lastName: details.lastName,
    firstName: details.firstName,
    middleName: details.middleName ?? '',
    birthDate: details.birthDate,
    gender: toOptionValue(details.gender),
    citizenship: toOptionValue(details.citizenship),
    phone: toPhoneInput(details.phone, details.citizenship),
  };
}
