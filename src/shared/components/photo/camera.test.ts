import { describe, expect, it } from 'vitest';
import { CameraFailure, toCameraFailure } from './camera';

function domError(name: string) {
  return new DOMException('camera', name);
}

describe('toCameraFailure', () => {
  it.each([
    ['NotAllowedError', CameraFailure.Denied],
    ['SecurityError', CameraFailure.Denied],
    ['NotFoundError', CameraFailure.NotFound],
    ['OverconstrainedError', CameraFailure.NotFound],
    ['NotReadableError', CameraFailure.Busy],
    ['AbortError', CameraFailure.Busy],
  ])('should map %s to %s when the browser rejects the camera', (name, failure) => {
    expect(toCameraFailure(domError(name))).toBe(failure);
  });

  it('should report unavailable when the browser has no camera API', () => {
    expect(toCameraFailure(new TypeError('getUserMedia is undefined'))).toBe(
      CameraFailure.Unavailable,
    );
  });

  it('should report unavailable when the error is not an Error', () => {
    expect(toCameraFailure('denied')).toBe(CameraFailure.Unavailable);
  });
});
