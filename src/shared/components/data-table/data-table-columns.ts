import {
  createColumnHelper,
  rowSortingFeature,
  tableFeatures,
  type ColumnHelper,
  type RowData,
  type SortingState,
} from '@tanstack/react-table';
import { SortOrder, type Sorting } from '@core/http/paging';

export const dataTableFeatures = tableFeatures({ rowSortingFeature });

export type DataTableFeatures = typeof dataTableFeatures;

export type DataTableColumns<TRow extends RowData> = ReturnType<
  ColumnHelper<DataTableFeatures, TRow>['columns']
>;

export function createDataTableColumnHelper<TRow extends RowData>(): ColumnHelper<
  DataTableFeatures,
  TRow
> {
  return createColumnHelper<DataTableFeatures, TRow>();
}

export function toSortingState(sorting: Sorting | null): SortingState {
  return sorting === null
    ? []
    : [{ id: sorting.field, desc: sorting.order === SortOrder.Descending }];
}

export function toSorting(state: SortingState): Sorting | null {
  const [first] = state;
  if (first === undefined) {
    return null;
  }
  return { field: first.id, order: first.desc ? SortOrder.Descending : SortOrder.Ascending };
}
