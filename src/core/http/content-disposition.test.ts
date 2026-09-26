import { describe, expect, it } from 'vitest';
import { fileNameFrom } from './content-disposition';

describe('fileNameFrom', () => {
  it('should read a plain file name when the header has one', () => {
    expect(fileNameFrom('attachment; filename=kitobxonlar-20260926.xlsx')).toBe(
      'kitobxonlar-20260926.xlsx',
    );
  });

  it('should read a quoted file name when the header quotes it', () => {
    expect(fileNameFrom('attachment; filename="report.xlsx"')).toBe('report.xlsx');
  });

  it('should prefer the encoded file name when both forms are present', () => {
    const header = "attachment; filename=a.xlsx; filename*=UTF-8''kitobxonlar%20ro%CA%BByxati.xlsx";

    expect(fileNameFrom(header)).toBe('kitobxonlar roʻyxati.xlsx');
  });

  it('should return null when the header is missing', () => {
    expect(fileNameFrom(null)).toBeNull();
  });
});
