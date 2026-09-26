import type { uz } from './uz';

type DictionaryShape<T> = {
  readonly [K in keyof T]: T[K] extends string ? string : DictionaryShape<T[K]>;
};

type LeafPaths<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : LeafPaths<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type Dictionary = DictionaryShape<typeof uz>;

export type TranslationKey = LeafPaths<typeof uz>;
