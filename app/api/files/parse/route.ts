import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import pdf from 'pdf-parse';
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

async function parsePDF(buffer: Buffer, fileName: string): Promise<ParsedData> {
  const data = await pdf(buffer);
  const text = data.text;

  // Simple text extraction - try to parse as table-like data
  const lines = text.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    throw new Error('PDF file is empty or unreadable');
  }

  // Attempt to detect columns (simple approach)
  const firstLine = lines[0];
  const possibleColumns = firstLine.split(/\s{2,}|\t/).filter(col => col.trim());
  
  if (possibleColumns.length > 1) {
    // Treat as tabular data
    const columns = possibleColumns;
    const rows = lines.slice(1).map(line => 
      line.split(/\s{2,}|\t/).slice(0, columns.length)
    );

    return {
      columns,
      rows,
      metadata: {
        fileName,
        fileType: 'application/pdf',
        rowCount: rows.length,
        columnCount: columns.length,
      },
    };
  }

  // Fallback: treat as single column
  return {
    columns: ['Content'],
    rows: lines.map(line => [line]),
    metadata: {
      fileName,
      fileType: 'application/pdf',
      rowCount: lines.length,
      columnCount: 1,
    },
  };
}

async function parseDOCX(buffer: Buffer, fileName: string): Promise<ParsedData> {
  // DOCX is a ZIP file containing XML
  // Simple text extraction approach - for production, consider mammoth.js or similar
  // For now, we'll try to extract readable text
  try {
    const text = buffer.toString('utf-8');
    const lines = text.split('\n').filter(line => line.trim() && line.length > 2);
  
    if (lines.length === 0) {
      throw new Error('DOCX file is empty or unreadable');
    }

    // Try to parse as table
    const firstLine = lines[0];
    const possibleColumns = firstLine.split(/\t|,|\s{2,}/).filter(col => col.trim());
    
    if (possibleColumns.length > 1) {
      return {
        columns: possibleColumns,
        rows: lines.slice(1).map(line => 
          line.split(/\t|,|\s{2,}/).slice(0, possibleColumns.length)
        ),
        metadata: {
          fileName,
          fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          rowCount: lines.length - 1,
          columnCount: possibleColumns.length,
        },
      };
    }

    return {
      columns: ['Content'],
      rows: lines.map(line => [line]),
      metadata: {
        fileName,
        fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        rowCount: lines.length,
        columnCount: 1,
      },
    };
  } catch (error) {
    throw new Error('Failed to parse DOCX file. Please ensure the file is valid.');
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();
    const fileType = file.type || '';

    let parsedData: ParsedData;

    if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
      parsedData = await parsePDF(buffer, file.name);
    } else if (fileType.includes('wordprocessingml') || fileName.endsWith('.docx')) {
      parsedData = await parseDOCX(buffer, file.name);
    } else {
      // For Excel/CSV, parse client-side (fallback if needed)
      return NextResponse.json(
        { error: 'Please parse Excel and CSV files client-side' },
        { status: 400 }
      );
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Error parsing file:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to parse file' },
      { status: 500 }
    );
  }
}

