import { PencilIcon, RefreshCwIcon, Trash2Icon } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@core/auth/use-auth';
import { AppPath, readerEditPath } from '@core/config/app-paths';
import { useConfirm } from '@core/feedback/use-confirm';
import { useNotify } from '@core/feedback/use-notify';
import { formatDateOnly } from '@core/i18n/date-format';
import { useT } from '@core/i18n/use-i18n';
import { Button } from '@shared/ui/button';
import { useDeleteReader, useRenewReader } from '../api/readers.queries';
import type { Reader } from '../models/reader';

export function ReaderActions({ reader }: { readonly reader: Reader }) {
  const t = useT();
  const navigate = useNavigate();
  const notify = useNotify();
  const confirm = useConfirm();
  const { isAdmin } = useAuth();
  const renew = useRenewReader(reader.id);
  const remove = useDeleteReader(reader.id);
  const params = { name: reader.fullName };

  const renewCard = async () => {
    if (!(await confirm({ description: 'readers.renewConfirm', params }))) {
      return;
    }
    renew.mutate(undefined, {
      onSuccess: (validity) => {
        notify.success('readers.renewed', { date: formatDateOnly(validity.expiresOn) });
      },
      onError: notify.failure,
    });
  };

  const deleteReader = async () => {
    const confirmed = await confirm({
      description: 'readers.deleteConfirm',
      params,
      confirmLabel: 'readers.actions.delete',
      destructive: true,
    });
    if (!confirmed) {
      return;
    }
    remove.mutate(undefined, {
      onSuccess: () => {
        notify.success('readers.deleted');
        void navigate(AppPath.readers);
      },
      onError: notify.failure,
    });
  };

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {isAdmin && (
        <Button
          variant="destructive"
          disabled={remove.isPending}
          onClick={() => void deleteReader()}
        >
          <Trash2Icon aria-hidden />
          {t('readers.actions.delete')}
        </Button>
      )}
      <Button variant="outline" disabled={renew.isPending} onClick={() => void renewCard()}>
        <RefreshCwIcon aria-hidden />
        {t('readers.actions.renew')}
      </Button>
      <Button asChild>
        <Link to={readerEditPath(reader.id)}>
          <PencilIcon aria-hidden />
          {t('readers.actions.edit')}
        </Link>
      </Button>
    </div>
  );
}
