import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { ReportContent } from './reportGenerator';

/**
 * Export utilities for charts and reports
 * 
 * NOTE: These functions require browser APIs (document, window, etc.)
 * and should ONLY be called from client-side code (use 'use client' directive)
 */

export async function exportChartAsPNG(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Element not found');

  const canvas = await html2canvas(element, { backgroundColor: '#ffffff' });
  const url = canvas.toDataURL('image/png');
  
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = url;
  link.click();
}

export async function exportChartAsSVG(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Element not found');

  const svgElement = element.querySelector('svg');
  if (!svgElement) throw new Error('SVG element not found');

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const link = document.createElement('a');
  link.download = `${filename}.svg`;
  link.href = url;
  link.click();
  
  URL.revokeObjectURL(url);
}

export async function exportChartAsPDF(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Element not found');

  const canvas = await html2canvas(element, { backgroundColor: '#ffffff' });
  const imgData = canvas.toDataURL('image/png');
  
  const pdf = new jsPDF();
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 295; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${filename}.pdf`);
}

export async function exportReportAsPDF(report: ReportContent): Promise<void> {
  const pdf = new jsPDF();
  let y = 20;

  pdf.setFontSize(20);
  pdf.text(report.title, 14, y);
  y += 10;

  pdf.setFontSize(12);
  pdf.text(`Generated: ${report.generatedAt.toLocaleDateString()}`, 14, y);
  y += 15;

  report.sections.forEach((section, index) => {
    if (y > 280) {
      pdf.addPage();
      y = 20;
    }

    pdf.setFontSize(16);
    pdf.text(section.heading, 14, y);
    y += 10;

    pdf.setFontSize(10);
    const lines = pdf.splitTextToSize(section.content, 180);
    lines.forEach((line: string) => {
      if (y > 280) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(line, 14, y);
      y += 7;
    });

    y += 10;
  });

  pdf.save(`${report.title.replace(/\s+/g, '_')}.pdf`);
}

export async function exportReportAsDOCX(report: ReportContent): Promise<void> {
  const children: Paragraph[] = [
    new Paragraph({
      text: report.title,
      heading: 'Heading1',
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: `Generated: ${report.generatedAt.toLocaleDateString()}`,
      spacing: { after: 400 },
    }),
  ];

  report.sections.forEach((section) => {
    children.push(
      new Paragraph({
        text: section.heading,
        heading: 'Heading2',
        spacing: { after: 200 },
      })
    );

    const contentLines = section.content.split('\n');
    contentLines.forEach((line) => {
      if (line.trim()) {
        children.push(
          new Paragraph({
            text: line,
            spacing: { after: 200 },
          })
        );
      }
    });

    children.push(new Paragraph({ text: '' }));
  });

  const doc = new Document({
    sections: [
      {
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${report.title.replace(/\s+/g, '_')}.docx`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}
