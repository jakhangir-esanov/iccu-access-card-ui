import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@test/render-with-providers';
import { DatePicker } from './date-picker';

function renderPicker(value: string, onChange = vi.fn()) {
  renderWithProviders(
    <>
      <label htmlFor="birth">Tug'ilgan sana</label>
      <DatePicker id="birth" value={value} onChange={onChange} min="1900-01-01" max="2026-09-27" />
    </>,
  );
  return onChange;
}

describe('DatePicker', () => {
  it('should show the date as day.month.year when a value is set', () => {
    renderPicker('2004-05-17');

    expect(screen.getByLabelText("Tug'ilgan sana")).toHaveTextContent('17.05.2004');
  });

  it('should ask to pick a date when the value is empty', () => {
    renderPicker('');

    expect(screen.getByLabelText("Tug'ilgan sana")).toHaveTextContent('Sanani tanlang');
  });

  it('should return a DateOnly string when a day is picked in the calendar', async () => {
    const onChange = renderPicker('2004-05-17');

    await userEvent.click(screen.getByLabelText("Tug'ilgan sana"));
    const grid = await screen.findByRole('grid');
    await userEvent.click(within(grid).getByText('20'));

    expect(onChange).toHaveBeenCalledWith('2004-05-20');
  });

  it('should open on the month of the value when the calendar is shown', async () => {
    renderPicker('2004-05-17');

    await userEvent.click(screen.getByLabelText("Tug'ilgan sana"));

    const selected = await screen.findByRole('gridcell', { selected: true });
    expect(selected).toHaveTextContent('17');
  });
});
