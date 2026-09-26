import { ArrowLeftIcon, PrinterIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { readerPath } from '@core/config/app-paths';
import { useConfirm } from '@core/feedback/use-confirm';
import { useNotify } from '@core/feedback/use-notify';
import { toTashkentDateOnly } from '@core/i18n/date-format';
import { useT } from '@core/i18n/use-i18n';
import { Button } from '@shared/ui/button';
import { useReader, useRecordCardPrint } from '../api/readers.queries';
import { IdCardBack } from '../components/card/id-card-back';
import { IdCardFront } from '../components/card/id-card-front';
import { ExpiryAlert } from '../components/expiry-alert';
import { toCardFace } from '../models/card-face';
import '@fontsource-variable/instrument-sans';
import '../components/card/id-card.css';

const AFTER_PRINT_EVENT = 'afterprint';

export function ReaderCardPage() {
  const { id = '' } = useParams<{ id: string }>();
  const t = useT();
  const notify = useNotify();
  const confirm = useConfirm();
  const [today] = useState(() => toTashkentDateOnly(new Date()));
  const [isPhotoReady, setPhotoReady] = useState(false);
  const reader = useReader(id);
  const recordPrint = useRecordCardPrint(id);

  const askWhetherPrinted = async () => {
    const printed = await confirm({
      title: 'readers.card.printedTitle',
      description: 'readers.card.printedConfirm',
      confirmLabel: 'readers.card.printedYes',
    });
    if (printed) {
      recordPrint.mutate(undefined, {
        onSuccess: () => {
          notify.success('readers.card.recorded');
        },
        onError: notify.failure,
      });
    }
  };

  const print = () => {
    window.addEventListener(AFTER_PRINT_EVENT, () => void askWhetherPrinted(), { once: true });
    window.print();
  };

  if (reader.isPending) {
    return <p className="text-muted-foreground">{t('common.loading')}</p>;
  }
  if (reader.isError) {
    return <p className="text-destructive">{t('readers.notFound')}</p>;
  }

  return (
    <div className="grid gap-6 print:block">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" aria-label={t('readers.actions.back')}>
            <Link to={readerPath(id)}>
              <ArrowLeftIcon aria-hidden />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">{t('readers.card.title')}</h1>
        </div>
        <Button disabled={!isPhotoReady || recordPrint.isPending} onClick={print}>
          <PrinterIcon aria-hidden />
          {isPhotoReady ? t('readers.card.print') : t('readers.card.photoLoading')}
        </Button>
      </div>
      <div className="print:hidden">
        <ExpiryAlert reader={reader.data} today={today} />
      </div>
      <p className="text-sm text-muted-foreground print:hidden">{t('readers.card.hint')}</p>
      <div className="flex flex-wrap gap-10 print:block">
        <figure className="grid gap-2 print:block">
          <figcaption className="text-sm font-medium print:hidden">
            {t('readers.card.front')}
          </figcaption>
          <IdCardFront
            face={toCardFace(reader.data)}
            onPhotoLoad={() => {
              setPhotoReady(true);
            }}
          />
        </figure>
        <figure className="grid gap-2 print:block">
          <figcaption className="text-sm font-medium print:hidden">
            {t('readers.card.back')}
          </figcaption>
          <IdCardBack />
        </figure>
      </div>
    </div>
  );
}
