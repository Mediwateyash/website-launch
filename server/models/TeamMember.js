import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema(
  {
    memberId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    quote: { type: String, default: '' },
    image: { type: String, default: '/images/team-priya.jpg' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('TeamMember', teamMemberSchema);
