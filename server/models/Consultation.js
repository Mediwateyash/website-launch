import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema(
  {
    consultationId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    requirementType: { type: String, default: "I'm looking for a job" },
    preferredRole: { type: String, default: 'General consultation' },
    status: {
      type: String,
      enum: ['New', 'In Review', 'Scheduled', 'Completed', 'Closed'],
      default: 'New',
    },
    clientType: { type: String, default: 'General' },
    notes: { type: String, default: '' },
    meetingDate: { type: String, default: '' },
    formattedDate: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Consultation', consultationSchema);
