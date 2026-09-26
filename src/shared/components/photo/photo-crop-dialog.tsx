import { useState } from 'react';
import Cropper, { type Area, type Point } from 'react-easy-crop';
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
import { PHOTO_ASPECT } from './crop-image';

const INITIAL_CROP: Point = { x: 0, y: 0 };
const INITIAL_ZOOM = 1;
const MAX_ZOOM = 4;

interface PhotoCropDialogProps {
  readonly source: string | null;
  readonly onCancel: () => void;
  readonly onApply: (area: Area) => void;
}

export function PhotoCropDialog({ source, onCancel, onApply }: PhotoCropDialogProps) {
  const t = useT();
  const [crop, setCrop] = useState<Point>(INITIAL_CROP);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [area, setArea] = useState<Area | null>(null);

  return (
    <Dialog
      open={source !== null}
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
      }}
    >
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('photo.cropTitle')}</DialogTitle>
          <DialogDescription>{t('photo.cropHint')}</DialogDescription>
        </DialogHeader>
        <div className="relative h-80 overflow-hidden rounded-lg bg-foreground/90">
          {source !== null && (
            <Cropper
              image={source}
              crop={crop}
              zoom={zoom}
              maxZoom={MAX_ZOOM}
              aspect={PHOTO_ASPECT}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => {
                setArea(pixels);
              }}
            />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button
            disabled={area === null}
            onClick={() => {
              if (area !== null) {
                onApply(area);
              }
            }}
          >
            {t('photo.apply')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
