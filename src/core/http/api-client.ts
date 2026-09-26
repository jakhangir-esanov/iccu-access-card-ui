import { ApiError, HttpErrorCode } from './api-error';
import type { PagedList, QueryParams } from './api-types';
import { fileNameFrom } from './content-disposition';
import { buildUrl } from './query-string';
import { errorFromResponse, readBody } from './response-body';
import { unwrapResult } from './result-envelope';

export interface SessionBridge {
  readonly accessToken: () => string | null;
  readonly refresh: () => Promise<boolean>;
  readonly expire: () => void;
}

export interface RequestOptions {
  readonly query?: QueryParams;
  readonly retryOnUnauthorized?: boolean;
  readonly signal?: AbortSignal;
}

export interface DownloadedFile {
  readonly blob: Blob;
  readonly fileName: string | null;
}

export type Send = (url: string, init: RequestInit) => Promise<Response>;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface Call {
  readonly method: HttpMethod;
  readonly path: string;
  readonly body?: unknown;
  readonly options?: RequestOptions;
}

const UNAUTHORIZED_STATUS = 401;
const NETWORK_FAILURE_STATUS = 0;
const ABORT_ERROR_NAME = 'AbortError';
const JSON_CONTENT_TYPE = 'application/json';

export class ApiClient {
  readonly #send: Send;
  #session: SessionBridge | null = null;
  #refreshing: Promise<boolean> | null = null;

  constructor(send: Send) {
    this.#send = send;
  }

  connectSession(session: SessionBridge): () => void {
    this.#session = session;
    return () => {
      if (this.#session === session) {
        this.#session = null;
      }
    };
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return unwrapResult(await this.#json({ method: 'GET', path, options })) as T;
  }

  async getPage<T>(path: string, options?: RequestOptions): Promise<PagedList<T>> {
    return (await this.#json({ method: 'GET', path, options })) as PagedList<T>;
  }

  async post<T = void>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return unwrapResult(await this.#json({ method: 'POST', path, body, options })) as T;
  }

  async put<T = void>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return unwrapResult(await this.#json({ method: 'PUT', path, body, options })) as T;
  }

  async delete<T = void>(path: string, options?: RequestOptions): Promise<T> {
    return unwrapResult(await this.#json({ method: 'DELETE', path, options })) as T;
  }

  async getFile(path: string, options?: RequestOptions): Promise<DownloadedFile> {
    const response = await this.#successful({ method: 'GET', path, options });
    return {
      blob: await response.blob(),
      fileName: fileNameFrom(response.headers.get('Content-Disposition')),
    };
  }

  async #json(call: Call): Promise<unknown> {
    return readBody(await this.#successful(call));
  }

  async #successful(call: Call): Promise<Response> {
    const response = await this.#execute(call);
    if (!response.ok) {
      throw await errorFromResponse(response);
    }
    return response;
  }

  async #execute(call: Call): Promise<Response> {
    const response = await this.#fetch(call);
    const session = this.#session;
    const mayRetry = call.options?.retryOnUnauthorized !== false;
    if (response.status !== UNAUTHORIZED_STATUS || !mayRetry || session === null) {
      return response;
    }
    if (!(await this.#refreshOnce(session))) {
      session.expire();
      return response;
    }
    return this.#fetch(call);
  }

  #refreshOnce(session: SessionBridge): Promise<boolean> {
    this.#refreshing ??= session.refresh().finally(() => {
      this.#refreshing = null;
    });
    return this.#refreshing;
  }

  async #fetch({ method, path, body, options }: Call): Promise<Response> {
    const headers = new Headers();
    const token = this.#session?.accessToken() ?? null;
    if (token !== null) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    const init: RequestInit = { method, headers, body: encodeBody(body, headers) };
    if (options?.signal !== undefined) {
      init.signal = options.signal;
    }
    try {
      return await this.#send(buildUrl(path, options?.query), init);
    } catch (error) {
      throw isAbort(error) ? error : networkUnavailable();
    }
  }
}

function encodeBody(body: unknown, headers: Headers): BodyInit | null {
  if (body === undefined) {
    return null;
  }
  if (body instanceof FormData) {
    return body;
  }
  headers.set('Content-Type', JSON_CONTENT_TYPE);
  return JSON.stringify(body);
}

function isAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === ABORT_ERROR_NAME;
}

function networkUnavailable(): ApiError {
  return new ApiError({
    status: NETWORK_FAILURE_STATUS,
    code: HttpErrorCode.NetworkUnavailable,
  });
}

export const apiClient = new ApiClient((url, init) => fetch(url, init));
