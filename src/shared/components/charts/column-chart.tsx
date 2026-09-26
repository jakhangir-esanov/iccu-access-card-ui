import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { cn } from 'cn';
import { ChartTooltip } from './chart-tooltip';
import {
  BAR_MAX_THICKNESS,
  BAR_RADIUS,
  CHART_AXIS_TICK,
  CHART_GRID_STROKE,
  CHART_SURFACE,
  tickInterval,
  toChartData,
  type ChartRow,
  type ChartSeries,
} from './chart-types';

const DEFAULT_HEIGHT = 260;
const STACK_ID = 'stack';
const SEGMENT_GAP = 2;
const Y_AXIS_WIDTH = 36;

interface ColumnChartProps {
  readonly rows: readonly ChartRow[];
  readonly series: readonly ChartSeries[];
  readonly height?: number;
}

function topRadius(isTop: boolean): [number, number, number, number] {
  return isTop ? [BAR_RADIUS, BAR_RADIUS, 0, 0] : [0, 0, 0, 0];
}

export function ColumnChart({ rows, series, height = DEFAULT_HEIGHT }: ColumnChartProps) {
  const isStacked = series.length > 1;
  return (
    <div className="grid gap-3">
      {isStacked && (
        <ul className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          {series.map((item) => (
            <li key={item.id} className="flex items-center gap-2">
              <span className={cn('size-2.5 rounded-sm', item.swatchClass)} aria-hidden />
              {item.label}
            </li>
          ))}
        </ul>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={toChartData(rows)} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={CHART_GRID_STROKE} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={{ stroke: CHART_GRID_STROKE }}
            tick={CHART_AXIS_TICK}
            interval={tickInterval(rows.length)}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={Y_AXIS_WIDTH}
            tick={CHART_AXIS_TICK}
          />
          <Tooltip
            cursor={{ fill: 'var(--color-muted)' }}
            content={({ active, label, payload }) => (
              <ChartTooltip active={active} label={label} payload={payload} series={series} />
            )}
          />
          {series.map((item, index) => (
            <Bar
              key={item.id}
              dataKey={item.id}
              name={item.label}
              fill={item.color}
              maxBarSize={BAR_MAX_THICKNESS}
              stackId={isStacked ? STACK_ID : undefined}
              radius={topRadius(index === series.length - 1)}
              stroke={isStacked ? CHART_SURFACE : undefined}
              strokeWidth={isStacked ? SEGMENT_GAP : 0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
