import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { I18nProvider } from '@core/i18n/i18n-provider';
import { createTranslator } from '@core/i18n/translate';
import { DICTIONARIES } from '@core/i18n/translations/dictionaries';
import { ReaderCategory } from '@shared/models/reader-category';
import { toCategoryRows } from './category-rows';
import { ChartTooltip } from './chart-tooltip';
import { CHART_PALETTE, tickInterval, toChartData } from './chart-types';

const t = createTranslator(DICTIONARIES.uz);

describe('toCategoryRows', () => {
  it('should list every category sorted by count when some are missing', () => {
    const rows = toCategoryRows(
      [
        { category: ReaderCategory.Student, count: 3 },
        { category: ReaderCategory.PhD, count: 5 },
      ],
      'count',
      t,
    );

    expect(rows).toHaveLength(7);
    expect(rows.slice(0, 3).map((row) => [row.label, row.values.count])).toEqual([
      ['PhD', 5],
      ['Talaba', 3],
      ["O'quvchi", 0],
    ]);
  });
});

describe('chart helpers', () => {
  it.each([
    [5, 0],
    [30, 2],
    [365, 36],
  ])('should show about ten ticks when there are %i rows', (rows, expected) => {
    expect(tickInterval(rows)).toBe(expected);
  });

  it('should flatten rows for Recharts when chart data is built', () => {
    expect(
      toChartData([{ key: 'a', label: '01.09', values: { reception: 1, selfService: 2 } }]),
    ).toEqual([{ label: '01.09', reception: 1, selfService: 2 }]);
  });
});

describe('ChartTooltip', () => {
  it('should show the period and each series value when a column is hovered', () => {
    render(
      <I18nProvider>
        <ChartTooltip
          active
          label="26.09"
          payload={[
            { dataKey: 'reception', name: 'Resepshn', value: 1200 },
            { dataKey: 'selfService', name: 'QR anketa', value: 3 },
          ]}
          series={[
            { id: 'reception', label: 'Resepshn', ...CHART_PALETTE[0] },
            { id: 'selfService', label: 'QR anketa', ...CHART_PALETTE[1] },
          ]}
        />
      </I18nProvider>,
    );

    expect(screen.getByText('26.09')).toBeInTheDocument();
    expect(screen.getByText('Resepshn').parentElement).toHaveTextContent('1 200');
    expect(screen.getByText('QR anketa').parentElement).toHaveTextContent('3');
  });
});
