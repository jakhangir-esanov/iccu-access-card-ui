import { useCallback, useEffect, useState } from 'react';

export function useObjectUrl(): readonly [string | null, (blob: Blob | null) => void] {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(
    () => () => {
      if (url !== null) {
        URL.revokeObjectURL(url);
      }
    },
    [url],
  );

  const replace = useCallback((blob: Blob | null) => {
    setUrl(blob === null ? null : URL.createObjectURL(blob));
  }, []);

  return [url, replace];
}

export async function canDecodeImage(file: Blob, decode: (url: string) => Promise<unknown>) {
  const url = URL.createObjectURL(file);
  try {
    await decode(url);
    return true;
  } catch {
    return false;
  } finally {
    URL.revokeObjectURL(url);
  }
}
