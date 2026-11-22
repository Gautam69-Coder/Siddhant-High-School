/**
 * Exports an array of objects to CSV and triggers instant browser download
 */
export const exportToCSV = (data, filename = 'siddhant-export.csv') => {
  if (!data || !data.length) {
    console.warn('No data available for export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Header row
  csvRows.push(headers.join(','));

  // Data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = header === 'documents' && Array.isArray(row[header])
        ? row[header].map((document) => document?.name || document?.filename || '').filter(Boolean).join(', ')
        : row[header] ?? '';
      const escaped = ('' + value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
