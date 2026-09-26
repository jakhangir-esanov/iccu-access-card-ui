import type { PersonDetails, PersonDetailsFormInput } from './person-details.schema';

const PHONE_COUNTRY_PREFIX = '+998';

export function toPersonDetailsFormInput(details: PersonDetails): PersonDetailsFormInput {
  return {
    category: String(details.category),
    lastName: details.lastName,
    firstName: details.firstName,
    middleName: details.middleName ?? '',
    birthDate: details.birthDate,
    phone: details.phone.startsWith(PHONE_COUNTRY_PREFIX)
      ? details.phone.slice(PHONE_COUNTRY_PREFIX.length)
      : details.phone,
    documentType: String(details.documentType),
    documentNumber: details.documentNumber,
  };
}
