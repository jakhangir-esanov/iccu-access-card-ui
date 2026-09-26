import { useTable, type RowData, type SortingState, type Updater } from '@tanstack/react-table';
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react';
import type { Sorting } from '@core/http/paging';
import { useT } from '@core/i18n/use-i18n';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table';
import { cn } from 'cn';
import {
  dataTableFeatures,
  toSorting,
  toSortingState,
  type DataTableColumns,
} from './data-table-columns';

interface DataTableProps<TRow extends RowData> {
  readonly columns: DataTableColumns<TRow>;
  readonly rows: TRow[];
  readonly getRowId: (row: TRow) => string;
  readonly sorting: Sorting | null;
  readonly onSortingChange: (sorting: Sorting | null) => void;
  readonly isLoading: boolean;
  readonly onRowClick?: (row: TRow) => void;
}

const SORT_ICONS = { asc: ArrowUpIcon, desc: ArrowDownIcon, none: ArrowUpDownIcon } as const;
const ARIA_SORT = { asc: 'ascending', desc: 'descending', none: 'none' } as const;

export function DataTable<TRow extends RowData>(props: DataTableProps<TRow>) {
  const { columns, rows, getRowId, sorting, onSortingChange, isLoading, onRowClick } = props;
  const t = useT();
  const sortingState = toSortingState(sorting);
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data: rows,
    getRowId,
    manualSorting: true,
    enableSortingRemoval: false,
    state: { sorting: sortingState },
    onSortingChange: (updater: Updater<SortingState>) => {
      onSortingChange(toSorting(typeof updater === 'function' ? updater(sortingState) : updater));
    },
  });

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border bg-card transition-opacity',
        isLoading && 'opacity-60',
      )}
      aria-busy={isLoading}
    >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => {
                const direction = header.column.getIsSorted() || 'none';
                const Icon = SORT_ICONS[direction];
                return (
                  <TableHead
                    key={header.id}
                    aria-sort={header.column.getCanSort() ? ARIA_SORT[direction] : undefined}
                  >
                    {header.column.getCanSort() ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 uppercase hover:text-foreground"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <table.FlexRender header={header} />
                        <Icon className="size-3.5" aria-hidden />
                      </button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className={cn(onRowClick && 'cursor-pointer')}
              onClick={
                onRowClick &&
                (() => {
                  onRowClick(row.original);
                })
              }
            >
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-40 text-center text-muted-foreground"
              >
                {t(isLoading ? 'common.loading' : 'table.empty')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
