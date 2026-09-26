import type { LocalizedMessages } from './api-types';

export type JsonRecord = Readonly<Record<string, unknown>>;

export function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function readString(record: JsonRecord, key: string): string | null {
  const value = record[key];
  return typeof value === 'string' && value.length > 0 ? value : null;
}

export function readMessages(value: unknown): LocalizedMessages | null {
  if (!isRecord(value)) {
    return null;
  }
  const messages: LocalizedMessages = {
    en: readString(value, 'en') ?? '',
    uz: readString(value, 'uz') ?? '',
    ru: readString(value, 'ru') ?? '',
  };
  const isEmpty = messages.en === '' && messages.uz === '' && messages.ru === '';
  return isEmpty ? null : messages;
}
