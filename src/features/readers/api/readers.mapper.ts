import { DocumentType, isDocumentType } from '@shared/models/document-type';
import { isReaderCategory, ReaderCategory } from '@shared/models/reader-category';
import { isRegistrationSource, RegistrationSource } from '@shared/models/registration-source';
import { formatFullName } from '@shared/person-details/person-format';
import type { CardValidity, CreatedReader, Reader, ReaderListItem } from '../models/reader';
import type { ReaderFormValues } from '../models/reader-form.schema';
import type {
  CreateReaderResponseDto,
  ReaderDto,
  ReaderListItemDto,
  RenewReaderResponseDto,
  SaveReaderRequestDto,
} from './readers.dto';

type SharedDto = ReaderListItemDto | ReaderDto;

function toSharedFields(dto: SharedDto) {
  return {
    id: dto.id,
    photoFileId: dto.photoFileId,
    cardNumber: dto.cardNumber,
    category: isReaderCategory(dto.category) ? dto.category : ReaderCategory.Pupil,
    lastName: dto.lastName,
    firstName: dto.firstName,
    middleName: dto.middleName,
    fullName: formatFullName(dto),
    birthDate: dto.birthDate,
    phone: dto.phone,
    documentType: isDocumentType(dto.documentType) ? dto.documentType : DocumentType.Passport,
    source: isRegistrationSource(dto.source) ? dto.source : RegistrationSource.Reception,
    issuedOn: dto.issuedOn,
    expiresOn: dto.expiresOn,
    printCount: dto.printCount,
    createdAt: dto.createdAt,
  };
}

export function toReaderListItem(dto: ReaderListItemDto): ReaderListItem {
  return { ...toSharedFields(dto), documentNumberMasked: dto.documentNumberMasked };
}

export function toReader(dto: ReaderDto): Reader {
  return {
    ...toSharedFields(dto),
    documentNumber: dto.documentNumber,
    lastPrintedAt: dto.lastPrintedAt,
    createdByName: dto.createdByName,
    updatedAt: dto.updatedAt,
  };
}

export function toSaveReaderRequest(values: ReaderFormValues): SaveReaderRequestDto {
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
  };
}

export function toCreatedReader(dto: CreateReaderResponseDto): CreatedReader {
  return { id: dto.id, cardNumber: dto.cardNumber };
}

export function toCardValidity(dto: RenewReaderResponseDto): CardValidity {
  return { issuedOn: dto.issuedOn, expiresOn: dto.expiresOn };
}
