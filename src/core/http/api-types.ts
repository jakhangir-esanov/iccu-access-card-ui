export interface LocalizedMessages {
  readonly en: string;
  readonly uz: string;
  readonly ru: string;
}

export interface PagedList<T> {
  readonly data: readonly T[];
  readonly totalCount: number;
}

export type QueryValue = string | number | boolean | null | undefined;

export type QueryParams = Readonly<Record<string, QueryValue>>;
