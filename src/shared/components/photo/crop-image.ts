import type { Area } from 'react-easy-crop';

export const PHOTO_ASPECT = 3 / 4;
export const PHOTO_OUTPUT_WIDTH = 600;
export const PHOTO_OUTPUT_HEIGHT = 800;

const JPEG_TYPE = 'image/jpeg';
const JPEG_QUALITY = 0.9;

export function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject(new Error('The image cannot be decoded'));
    };
    image.src = source;
  });
}

export async function cropToJpeg(source: string, area: Area): Promise<Blob> {
  const image = await loadImage(source);
  const canvas = document.createElement('canvas');
  canvas.width = PHOTO_OUTPUT_WIDTH;
  canvas.height = PHOTO_OUTPUT_HEIGHT;
  const context = drawingContext(canvas);
  context.imageSmoothingQuality = 'high';
  context.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    PHOTO_OUTPUT_WIDTH,
    PHOTO_OUTPUT_HEIGHT,
  );
  return toJpegBlob(canvas);
}

export async function captureFrame(video: HTMLVideoElement): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  drawingContext(canvas).drawImage(video, 0, 0);
  return toJpegBlob(canvas);
}

function drawingContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext('2d');
  if (context === null) {
    throw new Error('Canvas 2D context is not available');
  }
  return context;
}

function toJpegBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob === null) {
          reject(new Error('The photo cannot be encoded'));
          return;
        }
        resolve(blob);
      },
      JPEG_TYPE,
      JPEG_QUALITY,
    );
  });
}
