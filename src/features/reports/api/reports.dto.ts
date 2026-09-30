export interface PeriodTotalsDto {
  readonly period: string;
  readonly total: number;
  readonly reception: number;
  readonly selfService: number;
}

export interface CategoryTotalDto {
  readonly category: number;
  readonly count: number;
}

export interface GenderTotalDto {
  readonly gender: number | null;
  readonly count: number;
}

export interface CitizenshipTotalDto {
  readonly citizenship: number | null;
  readonly count: number;
}

export interface EmployeeTotalDto {
  readonly userId: string;
  readonly fullName: string;
  readonly count: number;
}

export interface RegistrationReportDto {
  readonly from: string;
  readonly to: string;
  readonly groupBy: number;
  readonly total: number;
  readonly byPeriod: readonly PeriodTotalsDto[];
  readonly byCategory: readonly CategoryTotalDto[];
  readonly byGender: readonly GenderTotalDto[];
  readonly byCitizenship: readonly CitizenshipTotalDto[];
  readonly byUser: readonly EmployeeTotalDto[];
}
