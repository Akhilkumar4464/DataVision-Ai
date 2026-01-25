import { ParsedData } from './dataParser';

export interface Insights {
  summary: string;
  trends: string[];
  anomalies: string[];
  recommendations: string[];
}

function isNumeric(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value) && value !== '' && value !== null;
}

function calculateStats(values: number[]): { mean: number; median: number; std: number; min: number; max: number } {
  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
  const std = Math.sqrt(variance);
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  return { mean, median, std, min, max };
}

export function generateInsights(data: ParsedData): Insights {
  const { columns, rows } = data;
  const insights: Insights = {
    summary: '',
    trends: [],
    anomalies: [],
    recommendations: [],
  };

  // Identify numeric columns
  const numericColumns: { index: number; name: string; values: number[] }[] = [];
  columns.forEach((col, colIndex) => {
    const values = rows
      .map(row => row[colIndex])
      .filter(val => isNumeric(val))
      .map(val => parseFloat(val));
    
    if (values.length > 0) {
      numericColumns.push({ index: colIndex, name: col, values });
    }
  });

  // Generate Summary
  insights.summary = `The dataset contains ${rows.length} rows and ${columns.length} columns. `;
  
  if (numericColumns.length > 0) {
    insights.summary += `Found ${numericColumns.length} numeric column(s) suitable for analysis. `;
    numericColumns.forEach(col => {
      const stats = calculateStats(col.values);
      insights.summary += `${col.name}: mean ${stats.mean.toFixed(2)}, range ${stats.min.toFixed(2)}-${stats.max.toFixed(2)}. `;
    });
  }

  // Generate Trends
  numericColumns.forEach(col => {
    if (col.values.length > 1) {
      const firstHalf = col.values.slice(0, Math.floor(col.values.length / 2));
      const secondHalf = col.values.slice(Math.floor(col.values.length / 2));
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      
      if (secondAvg > firstAvg * 1.1) {
        insights.trends.push(`${col.name} shows an upward trend (${((secondAvg / firstAvg - 1) * 100).toFixed(1)}% increase).`);
      } else if (secondAvg < firstAvg * 0.9) {
        insights.trends.push(`${col.name} shows a downward trend (${((1 - secondAvg / firstAvg) * 100).toFixed(1)}% decrease).`);
      } else {
        insights.trends.push(`${col.name} remains relatively stable.`);
      }
    }
  });

  // Generate Anomalies
  numericColumns.forEach(col => {
    const stats = calculateStats(col.values);
    const threshold = stats.std * 2;
    
    col.values.forEach((val, idx) => {
      if (Math.abs(val - stats.mean) > threshold) {
        insights.anomalies.push(
          `Anomaly detected in ${col.name} at row ${idx + 2}: ${val.toFixed(2)} (expected range: ${(stats.mean - threshold).toFixed(2)} - ${(stats.mean + threshold).toFixed(2)}).`
        );
        // Limit anomalies to prevent overwhelming output
        if (insights.anomalies.length >= 5) return;
      }
    });
  });

  // Generate Recommendations
  if (numericColumns.length === 0) {
    insights.recommendations.push('Consider including numeric columns for more advanced analysis and visualization.');
  }

  if (rows.length < 10) {
    insights.recommendations.push('Small dataset detected. Consider collecting more data points for more reliable insights.');
  } else if (rows.length > 1000) {
    insights.recommendations.push('Large dataset detected. Consider using sampling techniques for faster analysis.');
  }

  if (numericColumns.length >= 2) {
    insights.recommendations.push('Multiple numeric columns found. Consider creating correlation analysis between variables.');
  }

  if (insights.trends.some(t => t.includes('trend'))) {
    insights.recommendations.push('Trends detected. Consider implementing time-series analysis for deeper insights.');
  }

  if (insights.anomalies.length > 0) {
    insights.recommendations.push('Anomalies detected. Review these data points for potential data quality issues or interesting patterns.');
  }

  // Default recommendations if none generated
  if (insights.recommendations.length === 0) {
    insights.recommendations.push('Data structure looks good. Explore different visualization types to uncover hidden patterns.');
    insights.recommendations.push('Consider exporting your analysis as a report for sharing and documentation.');
  }

  return insights;
}
