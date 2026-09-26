import type { ApiError } from './api-error';
import { toApiError } from './problem-details';

const CONTENT_TYPE_HEADER = 'Content-Type';

export async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (text === '') {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(text);
    return parsed;
  } catch {
    return text;
  }
}

export async function errorFromResponse(response: Response): Promise<ApiError> {
  return toApiError({
    status: response.status,
    contentType: response.headers.get(CONTENT_TYPE_HEADER) ?? '',
    body: await readBody(response),
  });
}
