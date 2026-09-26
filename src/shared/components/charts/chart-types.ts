export interface ChartSeries {
  readonly id: string;
  readonly label: string;
  readonly color: string;
  readonly swatchClass: string;
}

export interface ChartRow {
  readonly key: string;
  readonly label: string;
  readonly values: Readonly<Record<string, number>>;
}

export const CHART_PALETTE = [
  { color: 'var(--color-chart-1)', swatchClass: 'bg-chart-1' },
  { color: 'var(--color-chart-2)', swatchClass: 'bg-chart-2' },
] as const;

export const CHART_AXIS_TICK = { fill: 'var(--color-muted-foreground)', fontSize: 12 } as const;

export const CHART_GRID_STROKE = 'var(--color-border)';

export const CHART_SURFACE = 'var(--color-card)';

export const BAR_MAX_THICKNESS = 24;

export const BAR_RADIUS = 4;

const MAX_X_TICKS = 10;

export function tickInterval(rowCount: number): number {
  return Math.max(Math.ceil(rowCount / MAX_X_TICKS) - 1, 0);
}

export function toChartData(rows: readonly ChartRow[]): Record<string, string | number>[] {
  return rows.map((row) => ({ label: row.label, ...row.values }));
}
