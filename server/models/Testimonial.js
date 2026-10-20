import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    testimonialId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    quote: { type: String, required: true },
    rating: { type: Number, default: 5 },
    image: { type: String, default: '/images/testimonial-rohit.png' },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Testimonial', testimonialSchema);
