import { SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { useT } from '@core/i18n/use-i18n';
import { FilterPanel } from '@shared/components/filter-panel';
import { USER_ROLE_LABELS, USER_ROLES } from '@shared/models/user-role';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { NativeSelect, NativeSelectOption } from '@shared/ui/native-select';
import { useDebouncedCallback } from '@shared/utils/use-debounced-callback';
import { ActiveFilter, UserFilterParam, type UserFilter } from '../models/user-filter';

const SEARCH_DELAY_MS = 300;

interface UserFiltersProps {
  readonly filter: UserFilter;
  readonly onChange: (name: string, value: string) => void;
}

export function UserFilters({ filter, onChange }: UserFiltersProps) {
  const t = useT();
  const [search, setSearch] = useState(filter.search);
  const applySearch = useDebouncedCallback((value: string) => {
    onChange(UserFilterParam.search, value);
  }, SEARCH_DELAY_MS);

  return (
    <FilterPanel className="flex flex-wrap items-end gap-4">
      <div className="relative w-full max-w-sm">
        <SearchIcon
          className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={search}
          aria-label={t('common.search')}
          placeholder={t('users.search')}
          className="pl-10"
          onChange={(event) => {
            setSearch(event.target.value);
            applySearch(event.target.value);
          }}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="users-role">{t('users.filters.role')}</Label>
        <NativeSelect
          id="users-role"
          value={filter.role === null ? '' : String(filter.role)}
          onChange={(event) => {
            onChange(UserFilterParam.role, event.target.value);
          }}
        >
          <NativeSelectOption value="">{t('users.filters.all')}</NativeSelectOption>
          {USER_ROLES.map((role) => (
            <NativeSelectOption key={role} value={role}>
              {t(USER_ROLE_LABELS[role])}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="users-status">{t('users.filters.status')}</Label>
        <NativeSelect
          id="users-status"
          value={filter.isActive ?? ''}
          onChange={(event) => {
            onChange(UserFilterParam.isActive, event.target.value);
          }}
        >
          <NativeSelectOption value="">{t('users.filters.all')}</NativeSelectOption>
          <NativeSelectOption value={ActiveFilter.Active}>
            {t('users.filters.active')}
          </NativeSelectOption>
          <NativeSelectOption value={ActiveFilter.Inactive}>
            {t('users.filters.inactive')}
          </NativeSelectOption>
        </NativeSelect>
      </div>
    </FilterPanel>
  );
}
