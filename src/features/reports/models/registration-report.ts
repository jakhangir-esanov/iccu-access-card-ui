import type { Citizenship } from '@shared/models/citizenship';
import type { Gender } from '@shared/models/gender';
import type { ReaderCategory } from '@shared/models/reader-category';
import type { ReportGrouping } from '@shared/models/report-grouping';

export interface PeriodTotals {
  readonly period: string;
  readonly total: number;
  readonly reception: number;
  readonly selfService: number;
}

export interface CategoryTotal {
  readonly category: ReaderCategory;
  readonly count: number;
}

export interface GenderTotal {
  readonly gender: Gender | null;
  readonly count: number;
}

export interface CitizenshipTotal {
  readonly citizenship: Citizenship | null;
  readonly count: number;
}

export interface EmployeeTotal {
  readonly userId: string;
  readonly fullName: string;
  readonly count: number;
}

export interface RegistrationReport {
  readonly from: string;
  readonly to: string;
  readonly groupBy: ReportGrouping;
  readonly total: number;
  readonly byPeriod: readonly PeriodTotals[];
  readonly byCategory: readonly CategoryTotal[];
  readonly byGender: readonly GenderTotal[];
  readonly byCitizenship: readonly CitizenshipTotal[];
  readonly byUser: readonly EmployeeTotal[];
}
