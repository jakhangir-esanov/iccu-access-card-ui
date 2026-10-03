import type { TranslationKey } from '@core/i18n/translations/dictionary';

export const PhotoCamera = {
  Device: 'device',
  Webcam: 'webcam',
} as const;

export type PhotoCamera = (typeof PhotoCamera)[keyof typeof PhotoCamera];

export const CameraFailure = {
  Denied: 'denied',
  NotFound: 'notFound',
  Busy: 'busy',
  Unavailable: 'unavailable',
} as const;

export type CameraFailure = (typeof CameraFailure)[keyof typeof CameraFailure];

export const CAMERA_FAILURE_MESSAGE: Readonly<Record<CameraFailure, TranslationKey>> = {
  [CameraFailure.Denied]: 'photo.cameraDenied',
  [CameraFailure.NotFound]: 'photo.cameraNotFound',
  [CameraFailure.Busy]: 'photo.cameraBusy',
  [CameraFailure.Unavailable]: 'photo.cameraUnavailable',
};

const FAILURE_BY_ERROR_NAME: ReadonlyMap<string, CameraFailure> = new Map([
  ['NotAllowedError', CameraFailure.Denied],
  ['SecurityError', CameraFailure.Denied],
  ['NotFoundError', CameraFailure.NotFound],
  ['OverconstrainedError', CameraFailure.NotFound],
  ['NotReadableError', CameraFailure.Busy],
  ['AbortError', CameraFailure.Busy],
]);

export function toCameraFailure(error: unknown): CameraFailure {
  if (!(error instanceof DOMException || error instanceof Error)) {
    return CameraFailure.Unavailable;
  }
  return FAILURE_BY_ERROR_NAME.get(error.name) ?? CameraFailure.Unavailable;
}
