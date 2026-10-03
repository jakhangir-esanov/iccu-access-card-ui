import { CameraIcon, ImageIcon, Loader2Icon, UserRoundIcon } from 'lucide-react';
import { useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import type { Area } from 'react-easy-crop';
import { useErrorMessage } from '@core/feedback/use-message';
import { isTranslationKey } from '@core/i18n/translation-key';
import { useT } from '@core/i18n/use-i18n';
import { Button } from '@shared/ui/button';
import { Label } from '@shared/ui/label';
import { PhotoCamera } from './camera';
import { cropToJpeg, loadImage } from './crop-image';
import { PhotoCropDialog } from './photo-crop-dialog';
import { canDecodeImage, useObjectUrl } from './use-object-url';
import { WebcamDialog } from './webcam-dialog';

const IMAGE_ACCEPT = 'image/*';
const FRONT_CAMERA = 'user';

interface PhotoFieldProps {
  readonly id: string;
  readonly onChange: (fileId: string | null) => void;
  readonly upload: (photo: Blob) => Promise<string>;
  readonly error?: string | undefined;
  readonly currentPhoto?: ReactNode;
  readonly camera?: PhotoCamera;
}

export function PhotoField({
  id,
  onChange,
  upload,
  error,
  currentPhoto,
  camera = PhotoCamera.Device,
}: PhotoFieldProps) {
  const t = useT();
  const errorMessage = useErrorMessage();
  const galleryInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const [source, setSource] = useObjectUrl();
  const [preview, setPreview] = useObjectUrl();
  const [isUploading, setUploading] = useState(false);
  const [isWebcamOpen, setWebcamOpen] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const openCamera = () => {
    if (camera === PhotoCamera.Webcam) {
      setWebcamOpen(true);
      return;
    }
    cameraInput.current?.click();
  };

  const takeFrame = (frame: Blob) => {
    setWebcamOpen(false);
    setFailure(null);
    setSource(frame);
  };

  const pick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file === undefined) {
      return;
    }
    setFailure(null);
    const isReadable = await canDecodeImage(file, loadImage);
    if (!isReadable) {
      setFailure(t('photo.unreadable'));
      return;
    }
    setSource(file);
  };

  const apply = async (area: Area) => {
    if (source === null) {
      return;
    }
    try {
      const photo = await cropToJpeg(source, area);
      setSource(null);
      setPreview(photo);
      setUploading(true);
      onChange(await upload(photo));
    } catch (uploadError) {
      onChange(null);
      setPreview(null);
      setFailure(errorMessage(uploadError));
    } finally {
      setUploading(false);
    }
  };

  const shownError = failure ?? (error !== undefined && isTranslationKey(error) ? t(error) : error);

  return (
    <div className="grid gap-2">
      <Label htmlFor={`${id}-gallery`}>{t('photo.label')}</Label>
      <div className="flex items-center gap-5">
        <div className="relative flex aspect-[3/4] w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted">
          {preview !== null ? (
            <img src={preview} alt={t('photo.preview')} className="size-full object-cover" />
          ) : (
            (currentPhoto ?? (
              <UserRoundIcon className="size-10 text-muted-foreground" aria-hidden />
            ))
          )}
          {isUploading && (
            <div
              role="status"
              className="absolute inset-0 flex items-center justify-center bg-background/70"
            >
              <Loader2Icon className="size-6 animate-spin text-primary" aria-hidden />
              <span className="sr-only">{t('photo.uploading')}</span>
            </div>
          )}
        </div>
        <div className="grid gap-2">
          <p className="text-sm text-muted-foreground">{t('photo.hint')}</p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              onClick={() => galleryInput.current?.click()}
            >
              <ImageIcon aria-hidden />
              {t(preview === null ? 'photo.fromGallery' : 'photo.change')}
            </Button>
            <Button type="button" variant="outline" disabled={isUploading} onClick={openCamera}>
              <CameraIcon aria-hidden />
              {t('photo.fromCamera')}
            </Button>
          </div>
        </div>
      </div>
      <input
        ref={galleryInput}
        id={`${id}-gallery`}
        type="file"
        accept={IMAGE_ACCEPT}
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => void pick(event)}
      />
      {camera === PhotoCamera.Device && (
        <input
          ref={cameraInput}
          type="file"
          accept={IMAGE_ACCEPT}
          capture={FRONT_CAMERA}
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(event) => void pick(event)}
        />
      )}
      {shownError !== undefined && shownError !== '' && (
        <p className="text-sm text-destructive">{shownError}</p>
      )}
      {isWebcamOpen && (
        <WebcamDialog
          onCancel={() => {
            setWebcamOpen(false);
          }}
          onCapture={takeFrame}
          onError={() => {
            setWebcamOpen(false);
            setFailure(t('photo.unreadable'));
          }}
        />
      )}
      <PhotoCropDialog
        key={source}
        source={source}
        onCancel={() => {
          setSource(null);
        }}
        onApply={(area) => void apply(area)}
      />
    </div>
  );
}
