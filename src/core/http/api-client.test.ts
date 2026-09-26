import { describe, expect, it, vi } from 'vitest';
import { ApiClient, type SessionBridge, type Send } from './api-client';
import { HttpErrorCode } from './api-error';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const empty = (status: number) => new Response(null, { status });

const envelope = (payload: unknown) => json({ data: payload, isSuccess: true, isFailure: false });

function sessionWith(tokens: string[], refreshResult = true) {
  let current = tokens.shift() ?? null;
  const session = {
    accessToken: vi.fn(() => current),
    refresh: vi.fn(async () => {
      await Promise.resolve();
      current = tokens.shift() ?? null;
      return refreshResult;
    }),
    expire: vi.fn(),
  } satisfies SessionBridge;
  return session;
}

const authorizationOf = (send: ReturnType<typeof vi.fn<Send>>, call: number) =>
  new Headers(send.mock.calls[call]?.[1].headers).get('Authorization');

describe('ApiClient', () => {
  it('should attach the bearer token and unwrap data when the request succeeds', async () => {
    const send = vi.fn<Send>().mockResolvedValue(envelope({ id: 'r1' }));
    const client = new ApiClient(send);
    client.connectSession(sessionWith(['token-1']));

    const result = await client.get<{ id: string }>('/readers/r1');

    expect(result).toEqual({ id: 'r1' });
    expect(send.mock.calls[0]?.[0]).toBe('/api/readers/r1');
    expect(authorizationOf(send, 0)).toBe('Bearer token-1');
  });

  it('should send JSON with a content type when the body is an object', async () => {
    const send = vi.fn<Send>().mockResolvedValue(envelope(undefined));
    const client = new ApiClient(send);

    await client.post('/auth/login', { username: 'admin', password: 'x' });

    const init = send.mock.calls[0]?.[1];
    expect(init?.method).toBe('POST');
    expect(init?.body).toBe('{"username":"admin","password":"x"}');
    expect(new Headers(init?.headers).get('Content-Type')).toBe('application/json');
  });

  it('should leave the content type to the browser when the body is FormData', async () => {
    const send = vi.fn<Send>().mockResolvedValue(envelope('file-id'));
    const client = new ApiClient(send);
    const form = new FormData();

    const id = await client.post<string>('/files', form);

    expect(id).toBe('file-id');
    expect(send.mock.calls[0]?.[1].body).toBe(form);
    expect(new Headers(send.mock.calls[0]?.[1].headers).has('Content-Type')).toBe(false);
  });

  it('should return the paged list as is when a page is requested', async () => {
    const page = { data: [{ id: 'u1' }], totalCount: 1 };
    const send = vi.fn<Send>().mockResolvedValue(json(page));

    const result = await new ApiClient(send).getPage('/users', { query: { first: 0, rows: 10 } });

    expect(result).toEqual(page);
    expect(send.mock.calls[0]?.[0]).toBe('/api/users?first=0&rows=10');
  });

  it('should throw an ApiError with the backend code when the response is ProblemDetails', async () => {
    const problem = { title: 'Reader.NotFound', status: 404 };
    const send = vi.fn<Send>().mockResolvedValue(json(problem, 404));

    await expect(new ApiClient(send).get('/readers/x')).rejects.toMatchObject({
      status: 404,
      code: 'Reader.NotFound',
    });
  });

  it('should refresh once and retry with the new token when the token expired', async () => {
    const send = vi
      .fn<Send>()
      .mockResolvedValueOnce(empty(401))
      .mockResolvedValueOnce(envelope({ ok: true }));
    const session = sessionWith(['old', 'new']);
    const client = new ApiClient(send);
    client.connectSession(session);

    await expect(client.get('/dashboard')).resolves.toEqual({ ok: true });
    expect(session.refresh).toHaveBeenCalledTimes(1);
    expect(authorizationOf(send, 1)).toBe('Bearer new');
  });

  it('should share one refresh when several requests get 401 at the same time', async () => {
    const send = vi.fn<Send>((_url, init) =>
      Promise.resolve(
        new Headers(init.headers).get('Authorization') === 'Bearer new'
          ? envelope('ok')
          : empty(401),
      ),
    );
    const session = sessionWith(['old', 'new']);
    const client = new ApiClient(send);
    client.connectSession(session);

    const results = await Promise.all([client.get('/a'), client.get('/b'), client.get('/c')]);

    expect(results).toEqual(['ok', 'ok', 'ok']);
    expect(session.refresh).toHaveBeenCalledTimes(1);
  });

  it('should expire the session and throw Unauthorized when the refresh fails', async () => {
    const send = vi.fn<Send>().mockResolvedValue(empty(401));
    const session = sessionWith(['old'], false);
    const client = new ApiClient(send);
    client.connectSession(session);

    await expect(client.get('/dashboard')).rejects.toMatchObject({
      code: HttpErrorCode.Unauthorized,
    });
    expect(session.expire).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('should not refresh when the caller disables the retry', async () => {
    const send = vi.fn<Send>().mockResolvedValue(empty(401));
    const session = sessionWith(['old']);
    const client = new ApiClient(send);
    client.connectSession(session);

    await expect(
      client.post('/auth/refresh', undefined, { retryOnUnauthorized: false }),
    ).rejects.toMatchObject({ code: HttpErrorCode.Unauthorized });
    expect(session.refresh).not.toHaveBeenCalled();
  });

  it('should throw NetworkUnavailable when the server cannot be reached', async () => {
    const send = vi.fn<Send>().mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(new ApiClient(send).get('/health')).rejects.toMatchObject({
      status: 0,
      code: HttpErrorCode.NetworkUnavailable,
    });
  });

  it('should return the blob and file name when a file is downloaded', async () => {
    const response = new Response('xlsx-bytes', {
      headers: { 'Content-Disposition': 'attachment; filename=kitobxonlar-20260926.xlsx' },
    });
    const send = vi.fn<Send>().mockResolvedValue(response);

    const file = await new ApiClient(send).getFile('/readers/export');

    expect(file.fileName).toBe('kitobxonlar-20260926.xlsx');
    expect(await file.blob.text()).toBe('xlsx-bytes');
  });

  it('should stop sending the token when the session is disconnected', async () => {
    const send = vi.fn<Send>().mockResolvedValue(envelope(null));
    const client = new ApiClient(send);
    const disconnect = client.connectSession(sessionWith(['token-1']));

    disconnect();
    await client.get('/auth/me');

    expect(authorizationOf(send, 0)).toBeNull();
  });
});
