import type { Locale } from '../locale';
import type { Dictionary } from './dictionary';
import { en } from './en';
import { ru } from './ru';
import { uz } from './uz';

export const DICTIONARIES: Readonly<Record<Locale, Dictionary>> = { uz, ru, en };
