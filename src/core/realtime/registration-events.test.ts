import { describe, expect, it } from 'vitest';
import { toRegistrationSubmittedNotice } from './registration-events';

describe('toRegistrationSubmittedNotice', () => {
  it('should read the notice when the hub sends every field', () => {
    const payload = {
      id: 'req-1',
      code: '0427',
      fullName: 'Karimova Gulnoza',
      submittedAt: '2026-09-26T14:00:00Z',
    };

    expect(toRegistrationSubmittedNotice(payload)).toEqual(payload);
  });

  it.each([null, 'text', { id: 'req-1', code: 427, fullName: 'x', submittedAt: 'y' }, {}])(
    'should ignore the payload when it is %j',
    (payload) => {
      expect(toRegistrationSubmittedNotice(payload)).toBeNull();
    },
  );
});
