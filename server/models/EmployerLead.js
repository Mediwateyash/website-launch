import mongoose from 'mongoose';

const employerLeadSchema = new mongoose.Schema(
  {
    leadId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    company: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    category: { type: String, default: 'General Requirement' },
    openings: { type: String, default: '1-2' },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['New', 'In Review', 'Contacted', 'Profiles Shared', 'Closed'],
      default: 'New',
    },
    notes: { type: String, default: '' },
    priority: { type: String, enum: ['Normal', 'High', 'Urgent'], default: 'Normal' },
    assignedTo: { type: String, default: 'Unassigned' },
    formattedDate: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('EmployerLead', employerLeadSchema);
