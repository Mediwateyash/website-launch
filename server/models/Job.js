import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    experience: { type: String, default: '1 – 3 Years' },
    location: { type: String, default: 'Mumbai, Maharashtra' },
    type: { type: String, default: 'Full-Time' },
    category: { type: String, default: 'IT & Technology' },
    tags: [{ type: String }],
    description: { type: String, default: '' },
    isNew: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    applicantsCount: { type: Number, default: 0 },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

export default mongoose.model('Job', jobSchema);
