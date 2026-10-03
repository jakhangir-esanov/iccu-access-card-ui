import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CameraFailure } from './camera';
import { useWebcam } from './use-webcam';

function fakeStream() {
  const stop = vi.fn();
  const stream = { getTracks: () => [{ stop }] };
  return { stream, stop };
}

function stubCamera(getUserMedia: () => Promise<unknown>) {
  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    value: { getUserMedia },
  });
}

describe('useWebcam', () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'mediaDevices');
  });

  it('should go live and stop the tracks when it unmounts', async () => {
    const { stream, stop } = fakeStream();
    stubCamera(() => Promise.resolve(stream));

    const { result, unmount } = renderHook(() => useWebcam());

    await waitFor(() => {
      expect(result.current).toEqual({ status: 'live', stream });
    });
    unmount();
    expect(stop).toHaveBeenCalledOnce();
  });

  it('should report denied when the user blocks the camera', async () => {
    stubCamera(() => Promise.reject(new DOMException('blocked', 'NotAllowedError')));

    const { result } = renderHook(() => useWebcam());

    await waitFor(() => {
      expect(result.current).toEqual({ status: 'failed', failure: CameraFailure.Denied });
    });
  });

  it('should stop a late stream when it unmounts before the camera opens', async () => {
    const { stream, stop } = fakeStream();
    let open: (value: unknown) => void = () => undefined;
    stubCamera(
      () =>
        new Promise((resolve) => {
          open = resolve;
        }),
    );

    const { unmount } = renderHook(() => useWebcam());
    unmount();
    open(stream);

    await waitFor(() => {
      expect(stop).toHaveBeenCalledOnce();
    });
  });
});
