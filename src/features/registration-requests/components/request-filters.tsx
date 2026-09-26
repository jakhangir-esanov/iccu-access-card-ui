import { SearchIcon } from 'lucide-react';
import { useState } from 'react';
import type { TranslationKey } from '@core/i18n/translations/dictionary';
import { useT } from '@core/i18n/use-i18n';
import {
  REGISTRATION_REQUEST_STATUS_LABELS,
  REGISTRATION_REQUEST_STATUSES,
} from '@shared/models/registration-request-status';
import { useDebouncedCallback } from '@shared/utils/use-debounced-callback';
import { Input } from '@shared/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@shared/ui/tabs';
import {
  ALL_STATUSES,
  parseStatusFilter,
  type RequestFilter,
  type StatusFilter,
} from '../models/request-filter';

const SEARCH_DELAY_MS = 300;

const STATUS_TABS: readonly { readonly value: StatusFilter; readonly label: TranslationKey }[] = [
  ...REGISTRATION_REQUEST_STATUSES.map((status) => ({
    value: status,
    label: REGISTRATION_REQUEST_STATUS_LABELS[status],
  })),
  { value: ALL_STATUSES, label: 'requests.status.all' },
];

interface RequestFiltersProps {
  readonly filter: RequestFilter;
  readonly onStatusChange: (status: StatusFilter) => void;
  readonly onSearchChange: (search: string) => void;
}

export function RequestFilters({ filter, onStatusChange, onSearchChange }: RequestFiltersProps) {
  const t = useT();
  const [search, setSearch] = useState(filter.search);
  const applySearch = useDebouncedCallback(onSearchChange, SEARCH_DELAY_MS);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Tabs
        value={String(filter.status)}
        onValueChange={(value) => {
          onStatusChange(parseStatusFilter(value));
        }}
      >
        <TabsList>
          {STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={String(tab.value)}>
              {t(tab.label)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="relative w-full max-w-xs">
        <SearchIcon
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={search}
          aria-label={t('common.search')}
          placeholder={t('requests.search')}
          className="pl-8"
          onChange={(event) => {
            setSearch(event.target.value);
            applySearch(event.target.value);
          }}
        />
      </div>
    </div>
  );
}
