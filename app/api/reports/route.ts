import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Report from '@/lib/models/Report';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const reports = await Report.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json(reports);
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}

function normalizeFileType(type: string = '', name: string = ''): string {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (['xlsx', 'xls', 'csv', 'pdf', 'docx'].includes(ext)) return ext;
  const lower = type.toLowerCase();
  if (lower.includes('spreadsheet') || lower.includes('xlsx')) return 'xlsx';
  if (lower.includes('excel') || lower.includes('xls')) return 'xls';
  if (lower.includes('csv')) return 'csv';
  if (lower.includes('pdf')) return 'pdf';
  if (lower.includes('word') || lower.includes('docx')) return 'docx';
  return ext || 'csv';
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const body = await request.json();
    let { title, fileName, fileType, data, insights, charts } = body;

    if (!fileName) {
      fileName = data?.metadata?.fileName || 'uploaded-file';
    }

    if (!title) {
      title = fileName || 'Untitled Report';
    }

    fileType = normalizeFileType(fileType || data?.metadata?.fileType, fileName);

    if (!data || !insights) {
      return NextResponse.json(
        { error: 'Missing required report data or insights' },
        { status: 400 }
      );
    }

    await connectDB();

    const report = await Report.create({
      userId: session.user.id,
      title: title.trim(),
      fileName,
      fileType,
      data,
      insights,
      charts: Array.isArray(charts) ? charts : [],
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while saving report' },
      { status: 500 }
    );
  }
}
