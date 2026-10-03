import { useEffect, useState } from 'react';
import { toCameraFailure, type CameraFailure } from './camera';

const CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  audio: false,
  video: { width: { ideal: 1280 }, height: { ideal: 960 } },
};

export type WebcamState =
  | { readonly status: 'starting' }
  | { readonly status: 'live'; readonly stream: MediaStream }
  | { readonly status: 'failed'; readonly failure: CameraFailure };

const STARTING: WebcamState = { status: 'starting' };

export function useWebcam(): WebcamState {
  const [state, setState] = useState<WebcamState>(STARTING);

  useEffect(() => startWebcam(setState), []);

  return state;
}

function startWebcam(report: (state: WebcamState) => void): () => void {
  let stream: MediaStream | null = null;
  let isStopped = false;
  openCamera().then(
    (opened) => {
      if (isStopped) {
        stopStream(opened);
        return;
      }
      stream = opened;
      report({ status: 'live', stream: opened });
    },
    (error: unknown) => {
      if (!isStopped) {
        report({ status: 'failed', failure: toCameraFailure(error) });
      }
    },
  );
  return () => {
    isStopped = true;
    if (stream !== null) {
      stopStream(stream);
    }
  };
}

async function openCamera(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);
}

function stopStream(stream: MediaStream) {
  for (const track of stream.getTracks()) {
    track.stop();
  }
}
