import { ArrowLeftIcon, CheckIcon, PencilIcon, TriangleAlertIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AppPath, readerPath } from '@core/config/app-paths';
import { useConfirm } from '@core/feedback/use-confirm';
import { useNotify } from '@core/feedback/use-notify';
import { useT } from '@core/i18n/use-i18n';
import { AuthorizedImage } from '@shared/components/authorized-image';
import type { PersonDetails } from '@shared/person-details/person-details.schema';
import { Alert, AlertDescription, AlertTitle } from '@shared/ui/alert';
import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';
import {
  useApproveRegistrationRequest,
  useRegistrationRequest,
  useRejectRegistrationRequest,
  useUpdateRegistrationRequest,
} from '../api/registration-requests.queries';
import { EditRequestDialog } from '../components/edit-request-dialog';
import { RejectRequestDialog } from '../components/reject-request-dialog';
import { RequestDetails } from '../components/request-details';
import { RequestStatusBadge } from '../components/request-status-badge';
import { canApprove, isOpenForReview } from '../models/registration-request';

export function RequestPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const t = useT();
  const notify = useNotify();
  const confirm = useConfirm();
  const [isEditing, setIsEditing] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const requestQuery = useRegistrationRequest(id);
  const updateMutation = useUpdateRegistrationRequest(id);
  const approveMutation = useApproveRegistrationRequest(id);
  const rejectMutation = useRejectRegistrationRequest(id);

  if (requestQuery.isLoading) {
    return <p className="text-muted-foreground">{t('common.loading')}</p>;
  }

  const request = requestQuery.data;
  if (requestQuery.isError || request === undefined) {
    return (
      <div className="grid gap-4">
        <Button
          variant="ghost"
          className="w-fit"
          onClick={() => void navigate(AppPath.registrationRequests)}
        >
          <ArrowLeftIcon className="size-4" /> {t('requests.back')}
        </Button>
        <p className="text-destructive">{t('requests.notFound')}</p>
      </div>
    );
  }

  const now = new Date();
  const openForReview = isOpenForReview(request, now);
  const approvable = canApprove(request, now);

  const handleApprove = async () => {
    const ok = await confirm({
      title: 'confirm.title',
      description: 'requests.approveConfirm',
      params: { name: request.fullName },
    });
    if (!ok) return;
    approveMutation.mutate(undefined, {
      onSuccess: (approval) => {
        notify.success('requests.approved', { cardNumber: approval.cardNumber });
        void navigate(readerPath(approval.readerId));
      },
      onError: notify.failure,
    });
  };

  const handleReject = async (reason: string) => {
    await rejectMutation.mutateAsync(reason);
    notify.success('requests.reject.done');
    setIsRejecting(false);
  };

  const handleSave = async (details: PersonDetails) => {
    await updateMutation.mutateAsync(details);
    notify.success('requests.edit.saved');
    setIsEditing(false);
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => void navigate(AppPath.registrationRequests)}
          >
            <ArrowLeftIcon className="size-4" />
            <span className="sr-only">{t('requests.back')}</span>
          </Button>
          <h1 className="text-2xl font-semibold">
            {t('requests.detail.title', { code: request.code })}
          </h1>
        </div>
        <RequestStatusBadge status={request.status} />
      </div>

      {request.registeredReader !== null && (
        <Alert variant="destructive">
          <TriangleAlertIcon className="size-4" />
          <AlertTitle>
            {t('requests.duplicate', { cardNumber: request.registeredReader.cardNumber })}
          </AlertTitle>
          <AlertDescription className="mt-2 flex flex-wrap items-center justify-between gap-4">
            <span>{t('requests.duplicateHint')}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void navigate(`${AppPath.readers}/${request.registeredReader?.id}`)}
            >
              {t('requests.openReader')}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!openForReview && (
        <Alert>
          <AlertTitle>{t('requests.detail.closed')}</AlertTitle>
          {request.readerId !== null && (
            <AlertDescription className="mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => void navigate(`${AppPath.readers}/${request.readerId}`)}
              >
                {t('requests.openReader')}
              </Button>
            </AlertDescription>
          )}
        </Alert>
      )}

      <Card className="p-6">
        <div className="grid gap-6 md:grid-cols-[180px_1fr]">
          <div className="flex justify-center md:justify-start">
            <AuthorizedImage
              fileId={request.photoFileId}
              alt={request.fullName}
              className="aspect-[3/4] w-44 rounded-lg border shadow-xs"
            />
          </div>
          <RequestDetails request={request} />
        </div>
      </Card>

      {openForReview && (
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setIsEditing(true);
            }}
          >
            <PencilIcon className="size-4" />
            {t('requests.actions.edit')}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setIsRejecting(true);
            }}
          >
            <XIcon className="size-4" />
            {t('requests.actions.reject')}
          </Button>
          <Button
            disabled={!approvable || approveMutation.isPending}
            onClick={() => void handleApprove()}
          >
            <CheckIcon className="size-4" />
            {t('requests.actions.approve')}
          </Button>
        </div>
      )}

      <EditRequestDialog
        request={request}
        open={isEditing}
        onOpenChange={setIsEditing}
        onSave={handleSave}
        isPending={updateMutation.isPending}
      />
      <RejectRequestDialog
        open={isRejecting}
        onOpenChange={setIsRejecting}
        onReject={handleReject}
        isPending={rejectMutation.isPending}
      />
    </div>
  );
}
