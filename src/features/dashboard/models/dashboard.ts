import type { Citizenship } from '@shared/models/citizenship';
import type { Gender } from '@shared/models/gender';
import type { ReaderCategory } from '@shared/models/reader-category';

export interface DashboardTotals {
  readonly total: number;
  readonly active: number;
  readonly expired: number;
  readonly expiringSoon: number;
  readonly registeredToday: number;
  readonly registeredThisMonth: number;
}

export interface CategoryCount {
  readonly category: ReaderCategory;
  readonly count: number;
}

export interface GenderCount {
  readonly gender: Gender | null;
  readonly count: number;
}

export interface CitizenshipCount {
  readonly citizenship: Citizenship | null;
  readonly count: number;
}

export interface DayCount {
  readonly day: string;
  readonly count: number;
}

export interface Dashboard {
  readonly totals: DashboardTotals;
  readonly pendingRequests: number;
  readonly byCategory: readonly CategoryCount[];
  readonly byGender: readonly GenderCount[];
  readonly byCitizenship: readonly CitizenshipCount[];
  readonly lastDays: readonly DayCount[];
}
