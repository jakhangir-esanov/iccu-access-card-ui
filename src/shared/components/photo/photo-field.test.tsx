import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@test/render-with-providers';
import { CameraFailure, PhotoCamera } from './camera';
import { PhotoField } from './photo-field';
import { useWebcam, type WebcamState } from './use-webcam';

vi.mock('./use-webcam', () => ({ useWebcam: vi.fn() }));

function renderField(camera: PhotoCamera, webcam: WebcamState = { status: 'starting' }) {
  vi.mocked(useWebcam).mockReturnValue(webcam);
  renderWithProviders(
    <PhotoField id="photo" camera={camera} upload={vi.fn()} onChange={vi.fn()} />,
  );
}

describe('PhotoField', () => {
  it('should open the webcam dialog when the camera is pressed in webcam mode', async () => {
    renderField(PhotoCamera.Webcam);

    await userEvent.click(screen.getByRole('button', { name: 'Kamera' }));

    expect(screen.getByRole('dialog', { name: 'Kameradan rasmga olish' })).toBeInTheDocument();
    expect(screen.getByText('Kamera yoqilmoqda...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Rasmga olish' })).toBeDisabled();
  });

  it('should explain the failure when the webcam cannot be opened', async () => {
    renderField(PhotoCamera.Webcam, { status: 'failed', failure: CameraFailure.NotFound });

    await userEvent.click(screen.getByRole('button', { name: 'Kamera' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Kamera topilmadi.');
  });

  it('should close the webcam dialog when it is cancelled', async () => {
    renderField(PhotoCamera.Webcam);

    await userEvent.click(screen.getByRole('button', { name: 'Kamera' }));
    await userEvent.click(screen.getByRole('button', { name: 'Bekor qilish' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should not open the webcam dialog when the device camera is used', async () => {
    renderField(PhotoCamera.Device);

    await userEvent.click(screen.getByRole('button', { name: 'Kamera' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(useWebcam).not.toHaveBeenCalled();
  });
});
