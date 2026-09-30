import { describe, expect, it } from 'vitest';
import { createTranslator } from '@core/i18n/translate';
import { DICTIONARIES } from '@core/i18n/translations/dictionaries';
import { ReportGrouping } from '@shared/models/report-grouping';
import { toRegistrationReport } from '../api/reports.mapper';
import { fillPeriods, toPeriodRows } from './report-periods';
import { parseReportQuery, reportRangeError } from './report-query';

const TODAY = '2026-09-27';
const reading =
  (values: Record<string, string>) =>
  (name: string): string =>
    values[name] ?? '';

describe('parseReportQuery', () => {
  it('should default to this month by day when the URL is empty', () => {
    expect(parseReportQuery(reading({}), TODAY)).toEqual({
      from: '2026-09-01',
      to: TODAY,
      groupBy: ReportGrouping.Day,
    });
  });

  it('should ignore values when they are not dates or groupings', () => {
    const query = parseReportQuery(reading({ from: 'yesterday', groupBy: '7' }), TODAY);

    expect(query).toMatchObject({ from: '2026-09-01', groupBy: ReportGrouping.Day });
  });
});

describe('reportRangeError', () => {
  it.each([
    ['2026-09-27', '2026-09-01', 'reports.invalidRange'],
    ['2023-01-01', '2026-01-04', 'reports.tooLong'],
    ['2023-09-27', '2026-09-27', null],
  ])('should check %s..%s as %s', (from, to, expected) => {
    expect(reportRangeError({ from, to, groupBy: ReportGrouping.Day })).toBe(expected);
  });
});

describe('fillPeriods', () => {
  it('should fill every day with zeros when the backend returns only days with data', () => {
    const filled = fillPeriods(
      { from: '2026-09-25', to: '2026-09-27', groupBy: ReportGrouping.Day },
      [{ period: '2026-09-26', total: 1, reception: 0, selfService: 1 }],
    );

    expect(filled.map((row) => [row.period, row.total])).toEqual([
      ['2026-09-25', 0],
      ['2026-09-26', 1],
      ['2026-09-27', 0],
    ]);
  });

  it('should list month starts when the report is grouped by month', () => {
    const filled = fillPeriods(
      { from: '2025-11-15', to: '2026-02-03', groupBy: ReportGrouping.Month },
      [],
    );

    expect(filled.map((row) => row.period)).toEqual([
      '2025-11-01',
      '2025-12-01',
      '2026-01-01',
      '2026-02-01',
    ]);
  });
});

describe('toPeriodRows', () => {
  it('should name months from the dictionary when grouped by month', () => {
    const rows = toPeriodRows(
      [{ period: '2026-09-01', total: 3, reception: 1, selfService: 2 }],
      ReportGrouping.Month,
      createTranslator(DICTIONARIES.ru),
    );

    expect(rows).toEqual([
      { key: '2026-09-01', label: 'сен 2026', values: { reception: 1, selfService: 2 } },
    ]);
  });
});

describe('toRegistrationReport', () => {
  it('should sort employees by count when the report is mapped', () => {
    const report = toRegistrationReport({
      from: '2026-09-01',
      to: TODAY,
      groupBy: 0,
      total: 3,
      byPeriod: [],
      byCategory: [],
      byGender: [],
      byCitizenship: [],
      byUser: [
        { userId: 'a', fullName: 'Ali', count: 1 },
        { userId: 'b', fullName: 'Vali', count: 2 },
      ],
    });

    expect(report.byUser.map((row) => row.fullName)).toEqual(['Vali', 'Ali']);
  });
});
