import { describe, expect, it } from 'vitest';
import { toReader } from '../api/readers.mapper';
import { READER_DTO } from '../test/reader-fixtures';
import { EMPTY_READER_FORM, createReaderFormSchema, toReaderFormInput } from './reader-form.schema';

const schema = createReaderFormSchema('2026-09-26');

describe('createReaderFormSchema', () => {
  it('should accept a loaded reader when it is saved without changes', () => {
    const result = schema.safeParse(toReaderFormInput(toReader(READER_DTO)));

    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({ phone: '+998905551234', photoFileId: 'photo-1' });
  });

  it('should require a photo when a new reader is created', () => {
    const result = schema.safeParse(EMPTY_READER_FORM);
    const photoIssue = result.error?.issues.find((issue) => issue.path[0] === 'photoFileId');

    expect(photoIssue?.message).toBe('validation.photoRequired');
  });
});
