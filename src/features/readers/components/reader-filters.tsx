import { SearchIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useT } from '@core/i18n/use-i18n';
import { CARD_STATUS_LABELS, CARD_STATUSES } from '@shared/models/card-status';
import { READER_CATEGORIES, READER_CATEGORY_LABELS } from '@shared/models/reader-category';
import {
  REGISTRATION_SOURCE_LABELS,
  REGISTRATION_SOURCES,
} from '@shared/models/registration-source';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { useDebouncedCallback } from '@shared/utils/use-debounced-callback';
import {
  ReaderFilterParam,
  hasActiveFilter,
  type ReaderFilter,
  type ReaderFilterName,
} from '../models/reader-filter';
import { ReaderFilterSelect } from './reader-filter-select';

const SEARCH_DELAY_MS = 300;

interface ReaderFiltersProps {
  readonly filter: ReaderFilter;
  readonly onChange: (name: ReaderFilterName, value: string) => void;
  readonly onClear: () => void;
}

export function ReaderFilters({ filter, onChange, onClear }: ReaderFiltersProps) {
  const t = useT();
  const [search, setSearch] = useState(filter.search);
  const applySearch = useDebouncedCallback((value: string) => {
    onChange(ReaderFilterParam.search, value);
  }, SEARCH_DELAY_MS);
  const change = (name: ReaderFilterName) => (value: string) => {
    onChange(name, value);
  };

  return (
    <div className="grid gap-3">
      <div className="relative max-w-md">
        <SearchIcon
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={search}
          aria-label={t('common.search')}
          placeholder={t('readers.search')}
          className="pl-8"
          onChange={(event) => {
            setSearch(event.target.value);
            applySearch(event.target.value);
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-[repeat(5,minmax(0,1fr))_auto] xl:items-end">
        <ReaderFilterSelect
          id="filter-category"
          label="readers.filters.category"
          value={filter.category}
          options={READER_CATEGORIES}
          labels={READER_CATEGORY_LABELS}
          onChange={change(ReaderFilterParam.category)}
        />
        <ReaderFilterSelect
          id="filter-source"
          label="readers.filters.source"
          value={filter.source}
          options={REGISTRATION_SOURCES}
          labels={REGISTRATION_SOURCE_LABELS}
          onChange={change(ReaderFilterParam.source)}
        />
        <ReaderFilterSelect
          id="filter-status"
          label="readers.filters.status"
          value={filter.status}
          options={CARD_STATUSES}
          labels={CARD_STATUS_LABELS}
          onChange={change(ReaderFilterParam.status)}
        />
        <div className="grid gap-1.5">
          <Label htmlFor="filter-from">{t('readers.filters.registeredFrom')}</Label>
          <Input
            id="filter-from"
            type="date"
            value={filter.registeredFrom}
            max={filter.registeredTo || undefined}
            onChange={(event) => {
              onChange(ReaderFilterParam.registeredFrom, event.target.value);
            }}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="filter-to">{t('readers.filters.registeredTo')}</Label>
          <Input
            id="filter-to"
            type="date"
            value={filter.registeredTo}
            min={filter.registeredFrom || undefined}
            onChange={(event) => {
              onChange(ReaderFilterParam.registeredTo, event.target.value);
            }}
          />
        </div>
        {hasActiveFilter(filter) && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch('');
              onClear();
            }}
          >
            <XIcon aria-hidden />
            {t('readers.filters.clear')}
          </Button>
        )}
      </div>
    </div>
  );
}
