import mongoose from 'mongoose';

const callbackSchema = new mongoose.Schema(
  {
    callbackId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    topic: { type: String, default: 'General enquiry' },
    source: { type: String, default: 'Website Callback Banner' },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Contacted', 'Closed', 'Dismissed'],
      default: 'Pending',
    },
    notes: { type: String, default: '' },
    priority: { type: String, enum: ['Normal', 'High', 'Urgent'], default: 'Urgent' },
    followUpDate: { type: String, default: '' },
    formattedDate: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Callback', callbackSchema);
