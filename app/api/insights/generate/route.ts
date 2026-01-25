import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ParsedData } from '@/lib/utils/dataParser';

interface InsightsRequest {
  data: ParsedData;
}

export async function POST(request: NextRequest) {
  let requestData: ParsedData | null = null;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: InsightsRequest = await request.json();
    const { data } = body;
    requestData = data; // Store for fallback

    if (!data || !data.columns || !data.rows) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      // Fallback to rule-based insights if no API key
      const { generateInsights } = await import('@/lib/utils/insights');
      const insights = generateInsights(data);
      return NextResponse.json(insights);
    }

    // Prepare data summary for AI
    const dataSummary = prepareDataSummary(data);

    // Call OpenAI API
    try {
      const insights = await generateAIInsights(dataSummary, openaiApiKey);
      return NextResponse.json(insights);
    } catch (aiError: any) {
      // Check if it's a quota/rate limit error
      const isQuotaError = aiError.message?.includes('quota') || 
                          aiError.message?.includes('429') ||
                          aiError.message?.includes('insufficient_quota');
      
      if (isQuotaError) {
        console.warn('OpenAI quota exceeded, falling back to rule-based insights');
      } else {
        console.error('OpenAI API error, falling back to rule-based insights:', aiError.message);
      }
      
      // Fallback to rule-based insights
      const { generateInsights } = await import('@/lib/utils/insights');
      const insights = generateInsights(data);
      return NextResponse.json(insights);
    }
  } catch (error: any) {
    console.error('Error generating insights:', error);
    
    // Final fallback to rule-based insights on any other error
    if (requestData) {
      try {
        const { generateInsights } = await import('@/lib/utils/insights');
        const insights = generateInsights(requestData);
        return NextResponse.json(insights);
      } catch (fallbackError) {
        console.error('Fallback insights generation failed:', fallbackError);
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}

function prepareDataSummary(data: ParsedData): string {
  const { columns, rows, metadata } = data;
  
  // Identify numeric columns
  const numericColumns: { name: string; values: number[] }[] = [];
  columns.forEach((col, colIndex) => {
    const values = rows
      .map(row => row[colIndex])
      .filter(val => {
        const num = parseFloat(val);
        return !isNaN(num) && isFinite(num) && val !== '' && val !== null;
      })
      .map(val => parseFloat(val));
    
    if (values.length > 0) {
      numericColumns.push({ name: col, values });
    }
  });

  // Calculate basic statistics
  const stats = numericColumns.map(col => {
    const sorted = [...col.values].sort((a, b) => a - b);
    const mean = col.values.reduce((a, b) => a + b, 0) / col.values.length;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];
    
    return {
      name: col.name,
      mean: mean.toFixed(2),
      median: median.toFixed(2),
      min: min.toFixed(2),
      max: max.toFixed(2),
      count: col.values.length
    };
  });

  // Build summary text
  let summary = `Dataset Analysis Request:\n\n`;
  summary += `File: ${metadata?.fileName || 'Unknown'}\n`;
  summary += `Total Rows: ${rows.length}\n`;
  summary += `Total Columns: ${columns.length}\n`;
  summary += `Column Names: ${columns.join(', ')}\n\n`;

  if (stats.length > 0) {
    summary += `Numeric Columns Statistics:\n`;
    stats.forEach(stat => {
      summary += `- ${stat.name}: Mean=${stat.mean}, Median=${stat.median}, Min=${stat.min}, Max=${stat.max}, Count=${stat.count}\n`;
    });
    summary += `\n`;
  }

  // Include sample data (first 10 rows)
  summary += `Sample Data (first 10 rows):\n`;
  const sampleRows = rows.slice(0, 10);
  summary += `Columns: ${columns.join(' | ')}\n`;
  sampleRows.forEach((row, idx) => {
    summary += `Row ${idx + 1}: ${row.join(' | ')}\n`;
  });

  return summary;
}

async function generateAIInsights(dataSummary: string, apiKey: string) {
  const prompt = `You are a data analyst AI assistant. Analyze the following dataset and provide insights in JSON format with the following structure:
{
  "summary": "A comprehensive 2-3 sentence summary of the dataset and key findings",
  "trends": ["trend 1", "trend 2", ...],
  "anomalies": ["anomaly 1", "anomaly 2", ...],
  "recommendations": ["recommendation 1", "recommendation 2", ...]
}

Requirements:
- Provide 2-5 trends if applicable
- Provide 1-5 anomalies if any are detected
- Provide 3-5 actionable recommendations
- Be specific and data-driven
- Use clear, professional language

Dataset Information:
${dataSummary}

Respond ONLY with valid JSON, no additional text.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using cost-effective model, can be changed to gpt-4 or gpt-3.5-turbo
        messages: [
          {
            role: 'system',
            content: 'You are a professional data analyst. Always respond with valid JSON only, no markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      let errorMessage = `OpenAI API error: ${response.status}`;
      
      // Try to parse error details for better error messages
      try {
        const errorJson = JSON.parse(errorData);
        if (errorJson.error?.message) {
          errorMessage += ` - ${errorJson.error.message}`;
        } else {
          errorMessage += ` - ${errorData}`;
        }
      } catch {
        errorMessage += ` - ${errorData}`;
      }
      
      const error = new Error(errorMessage);
      // Add status code for easier error detection
      (error as any).statusCode = response.status;
      (error as any).errorData = errorData;
      throw error;
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    // Parse JSON response (handle markdown code blocks if present)
    let jsonContent = content.trim();
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/```\n?/g, '').trim();
    }

    const insights = JSON.parse(jsonContent);

    // Validate structure
    if (!insights.summary || !Array.isArray(insights.trends) || !Array.isArray(insights.anomalies) || !Array.isArray(insights.recommendations)) {
      throw new Error('Invalid insights structure from AI');
    }

    return insights;
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

