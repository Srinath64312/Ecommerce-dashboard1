/**
 * Export JSON array of objects to downloadable CSV file.
 * Throws when there is nothing to export or the download cannot be started,
 * so callers can surface the failure to the user.
 * @param {Array<Object>} data
 * @param {string} filename
 */
export function exportToCSV(data, filename = 'export.csv') {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No data available to export.');
  }

  // Extract headers
  const headers = Object.keys(data[0]);
  
  // Format rows
  const csvRows = [];
  csvRows.push(headers.map(h => `"${h}"`).join(','));

  for (const row of data) {
    const values = headers.map(header => {
      let val = row[header];
      if (val === null || val === undefined) {
        val = '';
      } else if (typeof val === 'object') {
        val = JSON.stringify(val).replace(/"/g, '""');
      } else {
        val = String(val).replace(/"/g, '""');
      }
      return `"${val}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  try {
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    URL.revokeObjectURL(url);
  }
}
