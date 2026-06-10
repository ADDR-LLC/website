'use client';

import { useMemo, useState } from 'react';

function formatLocalDateTimeInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function toIsoWithOffset(localDateTime: string) {
  if (!localDateTime) {
    return '';
  }

  const date = new Date(localDateTime);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absOffsetMinutes = Math.abs(offsetMinutes);
  const offsetHours = String(Math.floor(absOffsetMinutes / 60)).padStart(2, '0');
  const offsetMins = String(absOffsetMinutes % 60).padStart(2, '0');

  return `${localDateTime}:00${sign}${offsetHours}:${offsetMins}`;
}

export function DateTimeField({ initialDate }: { initialDate?: string }) {
  const fallbackLocal = useMemo(() => formatLocalDateTimeInput(new Date()), []);

  const normalizedInitialDate = useMemo(() => {
    if (!initialDate) {
      return fallbackLocal;
    }

    const parsed = new Date(initialDate);
    if (!Number.isNaN(parsed.getTime())) {
      return formatLocalDateTimeInput(parsed);
    }

    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(initialDate)) {
      return initialDate;
    }

    return fallbackLocal;
  }, [fallbackLocal, initialDate]);

  const [localValue, setLocalValue] = useState(normalizedInitialDate);
  const timezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
    [],
  );

  return (
    <>
      <input
        name="dateLocal"
        type="datetime-local"
        value={localValue}
        onChange={(event) => setLocalValue(event.target.value)}
        className="w-full rounded-md bg-black border border-[#2C2C2E] px-3 py-2"
      />
      <input type="hidden" name="date" value={toIsoWithOffset(localValue)} />
      <input type="hidden" name="timezone" value={timezone} />
      <p className="text-xs text-[#7f7f82]">Default is your current local date/time ({timezone}).</p>
    </>
  );
}
