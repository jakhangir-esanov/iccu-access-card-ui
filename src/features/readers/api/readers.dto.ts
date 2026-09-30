interface ReaderPersonDto {
  readonly category: number;
  readonly lastName: string;
  readonly firstName: string;
  readonly middleName: string | null;
  readonly birthDate: string;
  readonly gender: number | null;
  readonly citizenship: number | null;
  readonly phone: string;
}

interface ReaderCardDto {
  readonly id: string;
  readonly photoFileId: string;
  readonly cardNumber: string;
  readonly source: number;
  readonly issuedOn: string;
  readonly expiresOn: string;
  readonly isExpired: boolean;
  readonly printCount: number;
  readonly createdAt: string;
}

export type ReaderListItemDto = ReaderPersonDto & ReaderCardDto;

export interface ReaderDto extends ReaderPersonDto, ReaderCardDto {
  readonly lastPrintedAt: string | null;
  readonly createdByName: string | null;
  readonly updatedAt: string | null;
}

export interface SaveReaderRequestDto {
  readonly category: number;
  readonly lastName: string;
  readonly firstName: string;
  readonly middleName: string | null;
  readonly birthDate: string;
  readonly gender: number;
  readonly citizenship: number;
  readonly phone: string;
  readonly photoFileId: string;
}

export interface CreateReaderResponseDto {
  readonly id: string;
  readonly cardNumber: string;
}

export interface RenewReaderResponseDto {
  readonly issuedOn: string;
  readonly expiresOn: string;
}
