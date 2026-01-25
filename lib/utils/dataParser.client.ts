import * as XLSX from 'xlsx';

export interface ParsedData {
  columns: string[];
  rows: any[][];
  metadata?: {
    fileName: string;
    fileType: string;
    rowCount: number;
    columnCount: number;
  };
}

export async function parseExcel(file: File): Promise<ParsedData> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' }) as any[][];

  if (data.length === 0) {
    throw new Error('Excel file is empty');
  }

  const columns = data[0] as string[];
  const rows = data.slice(1);

  return {
    columns,
    rows,
    metadata: {
      fileName: file.name,
      fileType: file.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      rowCount: rows.length,
      columnCount: columns.length,
    },
  };
}

export async function parseCSV(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    const rows: any[][] = [];
    let columns: string[] = [];

    const reader = file.stream().getReader();
    let text = '';

    reader.read().then(function processText({ done, value }) {
      if (done) {
        // Process the complete text
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length === 0) {
          reject(new Error('CSV file is empty'));
          return;
        }

        // Parse CSV (simple implementation)
        const parsedRows = lines.map(line => {
          const row: string[] = [];
          let current = '';
          let inQuotes = false;

          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              row.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          row.push(current.trim());
          return row;
        });

        columns = parsedRows[0] || [];
        const dataRows = parsedRows.slice(1);

        resolve({
          columns,
          rows: dataRows,
          metadata: {
            fileName: file.name,
            fileType: 'text/csv',
            rowCount: dataRows.length,
            columnCount: columns.length,
          },
        });
        return;
      }

      // Accumulate text
      const decoder = new TextDecoder();
      text += decoder.decode(value, { stream: true });
      
      reader.read().then(processText);
    });
  });
}

export async function parseFile(file: File): Promise<ParsedData> {
  const fileType = file.type || '';
  const fileName = file.name.toLowerCase();

  if (fileType.includes('spreadsheet') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    return parseExcel(file);
  } else if (fileType.includes('csv') || fileName.endsWith('.csv')) {
    return parseCSV(file);
  } else {
    // For PDF and DOCX, we need to call the API
    throw new Error('Please use parseFileWithAPI for PDF and DOCX files');
  }
}

