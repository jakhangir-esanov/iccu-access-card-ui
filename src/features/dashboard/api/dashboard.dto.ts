export interface DashboardTotalsDto {
  readonly total: number;
  readonly active: number;
  readonly expired: number;
  readonly expiringSoon: number;
  readonly registeredToday: number;
  readonly registeredThisMonth: number;
}

export interface CategoryCountDto {
  readonly category: number;
  readonly count: number;
}

export interface GenderCountDto {
  readonly gender: number | null;
  readonly count: number;
}

export interface CitizenshipCountDto {
  readonly citizenship: number | null;
  readonly count: number;
}

export interface DayCountDto {
  readonly day: string;
  readonly count: number;
}

export interface DashboardDto {
  readonly totals: DashboardTotalsDto;
  readonly pendingRequests: number;
  readonly byCategory: readonly CategoryCountDto[];
  readonly byGender: readonly GenderCountDto[];
  readonly byCitizenship: readonly CitizenshipCountDto[];
  readonly lastDays: readonly DayCountDto[];
}
