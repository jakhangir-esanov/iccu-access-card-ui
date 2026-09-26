import type { Dictionary, TranslationKey } from './translations/dictionary';

export type TranslationParams = Readonly<Record<string, string | number>>;

export type Translate = (key: TranslationKey, params?: TranslationParams) => string;

const PLACEHOLDER = /\{(\w+)\}/g;

type DictionaryNode = Readonly<Record<string, unknown>>;

function isDictionaryNode(value: unknown): value is DictionaryNode {
  return typeof value === 'object' && value !== null;
}

export function flattenDictionary(dictionary: Dictionary): ReadonlyMap<string, string> {
  const entries = new Map<string, string>();
  const visit = (node: DictionaryNode, prefix: string) => {
    for (const [name, value] of Object.entries(node)) {
      const path = `${prefix}${name}`;
      if (typeof value === 'string') {
        entries.set(path, value);
      } else if (isDictionaryNode(value)) {
        visit(value, `${path}.`);
      }
    }
  };
  visit(dictionary, '');
  return entries;
}

export function interpolate(text: string, params: TranslationParams | undefined): string {
  if (params === undefined) {
    return text;
  }
  return text.replace(PLACEHOLDER, (placeholder, name: string) =>
    String(params[name] ?? placeholder),
  );
}

export function createTranslator(dictionary: Dictionary): Translate {
  const entries = flattenDictionary(dictionary);
  return (key, params) => interpolate(entries.get(key) ?? key, params);
}
