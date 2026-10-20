import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    faqId: { type: String, required: true, unique: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Faq', faqSchema);
