const ENCODED_FILE_NAME = /filename\*\s*=\s*[^']*''([^;]+)/i;
const PLAIN_FILE_NAME = /filename\s*=\s*"?([^";]+)"?/i;

export function fileNameFrom(contentDisposition: string | null): string | null {
  if (contentDisposition === null) {
    return null;
  }
  const encoded = ENCODED_FILE_NAME.exec(contentDisposition)?.[1];
  if (encoded !== undefined) {
    return decodeURIComponent(encoded.trim());
  }
  return PLAIN_FILE_NAME.exec(contentDisposition)?.[1]?.trim() ?? null;
}
