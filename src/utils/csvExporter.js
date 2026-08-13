/* Characters that make a spreadsheet treat a cell as a formula. */
const FORMULA_TRIGGERS = ['=', '+', '-', '@', '\t', '\r'];

/**
 * Neutralise CSV/spreadsheet formula injection and escape embedded quotes.
 * @param {string} value
 * @returns {string}
 */
function escapeCell(value) {
  /* eslint-disable-next-line no-control-regex */
  const cleaned = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
  const guarded = FORMULA_TRIGGERS.includes(cleaned.charAt(0)) ? `'${cleaned}` : cleaned;
  return `"${guarded.replace(/"/g, '""')}"`;
}

/**
 * Restrict a download filename to a safe basename with a .csv extension.
 * @param {string} filename
 * @returns {string}
 */
function safeFilename(filename) {
  const base = String(filename).split(/[\\/]/).pop().replace(/[^A-Za-z0-9._-]/g, '_').replace(/^\.+/, '');
  const trimmed = base.slice(0, 100) || 'export.csv';
  return trimmed.toLowerCase().endsWith('.csv') ? trimmed : `${trimmed}.csv`;
}

/**
 * Export JSON array of objects to downloadable CSV file
 * @param {Array<Object>} data 
 * @param {string} filename 
 */
export function exportToCSV(data, filename = 'export.csv') {
  if (!data || !data.length) {
    alert("No data available to export.");
    return;
  }

  // Extract headers
  const headers = Object.keys(data[0]);
  
  // Format rows
  const csvRows = [];
  csvRows.push(headers.map(h => escapeCell(String(h))).join(','));

  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      if (val === null || val === undefined) return escapeCell('');
      return escapeCell(typeof val === 'object' ? JSON.stringify(val) : String(val));
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', safeFilename(filename));
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
