const MAX_INITIALS = 2;
const LETTER = /\p{L}/u;

export function userInitials(fullName: string): string {
  return fullName
    .split(/\s+/)
    .map((word) => LETTER.exec(word)?.[0] ?? '')
    .filter((letter) => letter !== '')
    .slice(0, MAX_INITIALS)
    .join('')
    .toLocaleUpperCase();
}
