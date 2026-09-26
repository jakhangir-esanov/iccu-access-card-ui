import { useNavigate, useParams } from 'react-router';
import { AppPath, readerPath } from '@core/config/app-paths';
import { useNotify } from '@core/feedback/use-notify';
import { useT } from '@core/i18n/use-i18n';
import { AuthorizedImage } from '@shared/components/authorized-image';
import { PageHeader } from '@shared/components/page-header';
import { useCreateReader, useReader, useUpdateReader } from '../api/readers.queries';
import { ReaderForm } from '../components/reader-form';
import { EMPTY_READER_FORM, toReaderFormInput } from '../models/reader-form.schema';

export function NewReaderPage() {
  const t = useT();
  const navigate = useNavigate();
  const notify = useNotify();
  const create = useCreateReader();
  return (
    <section className="grid gap-6">
      <PageHeader title={t('readers.form.createTitle')} />
      <ReaderForm
        initialValues={EMPTY_READER_FORM}
        isPending={create.isPending}
        onCancel={() => void navigate(AppPath.readers)}
        onSubmit={async (values) => {
          const created = await create.mutateAsync(values);
          notify.success('readers.form.created', { cardNumber: created.cardNumber });
          await navigate(readerPath(created.id));
        }}
      />
    </section>
  );
}

export function EditReaderPage() {
  const { id = '' } = useParams<{ id: string }>();
  const t = useT();
  const navigate = useNavigate();
  const notify = useNotify();
  const reader = useReader(id);
  const update = useUpdateReader(id);
  if (reader.isPending) {
    return <p className="text-muted-foreground">{t('common.loading')}</p>;
  }
  if (reader.isError) {
    return <p className="text-destructive">{t('readers.notFound')}</p>;
  }
  return (
    <section className="grid gap-6">
      <PageHeader title={t('readers.form.editTitle')} description={reader.data.fullName} />
      <ReaderForm
        initialValues={toReaderFormInput(reader.data)}
        currentPhoto={
          <AuthorizedImage
            fileId={reader.data.photoFileId}
            alt={reader.data.fullName}
            className="size-full"
          />
        }
        isPending={update.isPending}
        onCancel={() => void navigate(readerPath(id))}
        onSubmit={async (values) => {
          await update.mutateAsync(values);
          notify.success('readers.form.saved');
          await navigate(readerPath(id));
        }}
      />
    </section>
  );
}
