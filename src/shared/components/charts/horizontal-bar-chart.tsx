import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartTooltip } from './chart-tooltip';
import {
  BAR_MAX_THICKNESS,
  BAR_RADIUS,
  CHART_AXIS_TICK,
  toChartData,
  type ChartRow,
  type ChartSeries,
} from './chart-types';

const ROW_HEIGHT = 36;
const CHART_PADDING = 16;
const LABEL_WIDTH = 120;
const VALUE_LABEL_OFFSET = 6;
const VALUE_LABEL_SPACE = 40;

interface HorizontalBarChartProps {
  readonly rows: readonly ChartRow[];
  readonly series: ChartSeries;
}

export function HorizontalBarChart({ rows, series }: HorizontalBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={rows.length * ROW_HEIGHT + CHART_PADDING}>
      <BarChart
        data={toChartData(rows)}
        layout="vertical"
        margin={{ top: 0, right: VALUE_LABEL_SPACE, left: 0, bottom: 0 }}
      >
        <XAxis type="number" hide allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="label"
          width={LABEL_WIDTH}
          tickLine={false}
          axisLine={false}
          tick={CHART_AXIS_TICK}
        />
        <Tooltip
          cursor={{ fill: 'var(--color-muted)' }}
          content={({ active, label, payload }) => (
            <ChartTooltip active={active} label={label} payload={payload} series={[series]} />
          )}
        />
        <Bar
          dataKey={series.id}
          name={series.label}
          fill={series.color}
          maxBarSize={BAR_MAX_THICKNESS}
          radius={[0, BAR_RADIUS, BAR_RADIUS, 0]}
        >
          <LabelList
            dataKey={series.id}
            position="right"
            offset={VALUE_LABEL_OFFSET}
            className="fill-foreground text-xs font-medium"
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
