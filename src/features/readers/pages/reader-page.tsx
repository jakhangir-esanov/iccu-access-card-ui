import { ArrowLeftIcon, TriangleAlertIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { AppPath } from '@core/config/app-paths';
import { toTashkentDateOnly } from '@core/i18n/date-format';
import { useT } from '@core/i18n/use-i18n';
import { AuthorizedImage } from '@shared/components/authorized-image';
import { MessagePanel } from '@shared/components/message-panel';
import { PageHeader } from '@shared/components/page-header';
import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';
import { useReader } from '../api/readers.queries';
import { ExpiryAlert } from '../components/expiry-alert';
import { ReaderActions } from '../components/reader-actions';
import { ReaderCardPanel } from '../components/reader-card-panel';
import { ReaderDetails } from '../components/reader-details';

export function ReaderPage() {
  const { id = '' } = useParams<{ id: string }>();
  const t = useT();
  const [today] = useState(() => toTashkentDateOnly(new Date()));
  const query = useReader(id);

  if (query.isPending) {
    return <p className="text-muted-foreground">{t('common.loading')}</p>;
  }
  if (query.isError) {
    return (
      <MessagePanel
        icon={TriangleAlertIcon}
        title={t('readers.notFound')}
        description={t('notFound.description')}
        action={
          <Button asChild variant="outline">
            <Link to={AppPath.readers}>{t('readers.actions.back')}</Link>
          </Button>
        }
      />
    );
  }
  const reader = query.data;

  return (
    <div className="grid gap-6">
      <PageHeader
        title={reader.fullName}
        leading={
          <Button
            asChild
            variant="outline"
            size="icon"
            className="rounded-full"
            aria-label={t('readers.actions.back')}
          >
            <Link to={AppPath.readers}>
              <ArrowLeftIcon aria-hidden />
            </Link>
          </Button>
        }
        actions={<ReaderActions reader={reader} />}
      />
      <ExpiryAlert reader={reader} today={today} />
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_24rem]">
        <Card className="p-7">
          <div className="grid gap-8 md:grid-cols-[11rem_1fr]">
            <AuthorizedImage
              fileId={reader.photoFileId}
              alt={reader.fullName}
              className="aspect-[3/4] w-44 rounded-xl border shadow-sm"
            />
            <ReaderDetails reader={reader} />
          </div>
        </Card>
        <ReaderCardPanel reader={reader} today={today} />
      </div>
    </div>
  );
}
