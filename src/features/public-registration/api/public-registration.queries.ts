import { useMutation } from '@tanstack/react-query';
import type { RegistrationFormValues } from '../models/registration-form.schema';
import { toRegistrationReceipt, toSubmitRegistrationRequest } from './public-registration.mapper';
import { submitRegistration, uploadPublicPhoto } from './public-registration.service';

export function useUploadPublicPhotoMutation() {
  return useMutation({ mutationFn: (photo: Blob) => uploadPublicPhoto(photo) });
}

export function useSubmitRegistrationMutation() {
  return useMutation({
    mutationFn: async (values: RegistrationFormValues) =>
      toRegistrationReceipt(await submitRegistration(toSubmitRegistrationRequest(values))),
  });
}
