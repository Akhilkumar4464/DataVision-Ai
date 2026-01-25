import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReport extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  fileName: string;
  fileType: string;
  data: any; // Parsed and normalized data
  insights: {
    summary: string;
    trends: string[];
    anomalies: string[];
    recommendations: string[];
  };
  charts: {
    type: string;
    data: any;
    config: any;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
      enum: ['xlsx', 'xls', 'csv', 'pdf', 'docx'],
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    insights: {
      summary: {
        type: String,
        required: true,
      },
      trends: [{
        type: String,
      }],
      anomalies: [{
        type: String,
      }],
      recommendations: [{
        type: String,
      }],
    },
    charts: [{
      type: {
        type: String,
        enum: ['bar', 'line', 'pie', 'area', 'radar'],
        required: true,
      },
      data: {
        type: Schema.Types.Mixed,
        required: true,
      },
      config: {
        type: Schema.Types.Mixed,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ReportSchema.index({ userId: 1, createdAt: -1 });

const Report: Model<IReport> = mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);

export default Report;
