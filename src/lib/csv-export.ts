/** Escape one CSV field (RFC 4180-style). */
export function escapeCsvField(value: unknown): string {
  if (value === null || value === undefined) return '';
  const raw =
    typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (/[",\n\r]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

export function buildCsv(
  rows: Record<string, unknown>[],
  columns: { key: string; header: string }[],
): string {
  const headerLine = columns.map((c) => escapeCsvField(c.header)).join(',');
  const body = rows.map((row) =>
    columns.map((c) => escapeCsvField(row[c.key])).join(','),
  );
  return [headerLine, ...body].join('\r\n');
}

/** UTF-8 BOM so Excel opens UTF-8 CSV correctly on Windows. */
export function csvBlobWithBom(csv: string): Blob {
  return new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
}

export function triggerCsvDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
