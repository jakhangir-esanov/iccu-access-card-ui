import { CameraIcon, Loader2Icon } from 'lucide-react';
import { useRef, useState } from 'react';
import { useT } from '@core/i18n/use-i18n';
import { Button } from '@shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/dialog';
import { CAMERA_FAILURE_MESSAGE } from './camera';
import { captureFrame } from './crop-image';
import { useWebcam, type WebcamState } from './use-webcam';

interface WebcamDialogProps {
  readonly onCancel: () => void;
  readonly onCapture: (frame: Blob) => void;
  readonly onError: (error: unknown) => void;
}

export function WebcamDialog({ onCancel, onCapture, onError }: WebcamDialogProps) {
  const t = useT();
  const webcam = useWebcam();
  const video = useRef<HTMLVideoElement>(null);
  const [isReady, setReady] = useState(false);

  const capture = () => {
    if (video.current === null) {
      return;
    }
    captureFrame(video.current).then(onCapture, onError);
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
      }}
    >
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('photo.cameraTitle')}</DialogTitle>
          <DialogDescription>{t('photo.cameraHint')}</DialogDescription>
        </DialogHeader>
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-foreground/90">
          {webcam.status === 'live' ? (
            <video
              ref={(element) => {
                video.current = element;
                if (element !== null && element.srcObject !== webcam.stream) {
                  element.srcObject = webcam.stream;
                }
              }}
              autoPlay
              playsInline
              muted
              className="size-full -scale-x-100 object-cover"
              onLoadedData={() => {
                setReady(true);
              }}
            />
          ) : (
            <WebcamStatus webcam={webcam} />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button disabled={webcam.status !== 'live' || !isReady} onClick={capture}>
            <CameraIcon aria-hidden />
            {t('photo.capture')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function WebcamStatus({ webcam }: Readonly<{ webcam: WebcamState }>) {
  const t = useT();

  if (webcam.status === 'failed') {
    return (
      <p role="alert" className="px-6 text-center text-sm text-background">
        {t(CAMERA_FAILURE_MESSAGE[webcam.failure])}
      </p>
    );
  }
  return (
    <p role="status" className="flex items-center gap-2 text-sm text-background">
      <Loader2Icon className="size-4 animate-spin" aria-hidden />
      {t('photo.cameraStarting')}
    </p>
  );
}
