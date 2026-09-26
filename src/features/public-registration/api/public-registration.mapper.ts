import type { RegistrationFormValues } from '../models/registration-form.schema';
import type { RegistrationReceipt } from '../models/registration-receipt';
import type {
  SubmitRegistrationRequestDto,
  SubmitRegistrationResponseDto,
} from './public-registration.dto';

export function toSubmitRegistrationRequest(
  values: RegistrationFormValues,
): SubmitRegistrationRequestDto {
  return {
    category: values.category,
    lastName: values.lastName,
    firstName: values.firstName,
    middleName: values.middleName,
    birthDate: values.birthDate,
    phone: values.phone,
    documentType: values.documentType,
    documentNumber: values.documentNumber,
    photoFileId: values.photoFileId,
    consentGiven: values.consentGiven,
  };
}

export function toRegistrationReceipt(dto: SubmitRegistrationResponseDto): RegistrationReceipt {
  return { code: dto.code, expiresAt: dto.expiresAt };
}
