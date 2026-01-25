import { ParsedData } from './dataParser';
import { Insights } from './insights';

export interface ReportContent {
  title: string;
  sections: {
    heading: string;
    content: string;
  }[];
  generatedAt: Date;
}

export function generateReport(
  title: string,
  data: ParsedData,
  insights: Insights,
  charts?: { type: string; title: string }[]
): ReportContent {
  const sections = [
    {
      heading: 'Executive Summary',
      content: insights.summary || 'No summary available.',
    },
    {
      heading: 'Dataset Overview',
      content: `This report analyzes ${data.metadata?.fileName || 'uploaded file'} containing ${data.metadata?.rowCount || 0} rows and ${data.metadata?.columnCount || 0} columns. The data includes the following fields: ${data.columns.join(', ')}.`,
    },
    {
      heading: 'Key Trends',
      content: insights.trends.length > 0
        ? insights.trends.map((trend, idx) => `${idx + 1}. ${trend}`).join('\n')
        : 'No significant trends detected in the dataset.',
    },
    {
      heading: 'Data Anomalies',
      content: insights.anomalies.length > 0
        ? insights.anomalies.slice(0, 10).map((anomaly, idx) => `${idx + 1}. ${anomaly}`).join('\n')
        : 'No significant anomalies detected in the dataset. Data appears to be within expected ranges.',
    },
    {
      heading: 'Recommendations',
      content: insights.recommendations.length > 0
        ? insights.recommendations.map((rec, idx) => `${idx + 1}. ${rec}`).join('\n')
        : 'Continue monitoring the data for patterns and trends.',
    },
  ];

  if (charts && charts.length > 0) {
    sections.push({
      heading: 'Visualizations',
      content: `This report includes ${charts.length} visualization(s): ${charts.map(c => c.title || c.type).join(', ')}.`,
    });
  }

  return {
    title,
    sections,
    generatedAt: new Date(),
  };
}
