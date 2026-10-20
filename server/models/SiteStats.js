import mongoose from 'mongoose';

const siteStatsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'global_stats' },
    industryFocus: { type: String, default: '600+' },
    professionalsConnected: { type: String, default: '10000+' },
    trustedTag: { type: String, default: 'Trusted' },
    phone1: { type: String, default: '9819461050' },
    phone2: { type: String, default: '8591207594' },
    email1: { type: String, default: 'shreyashhrinterskillsolutions@gmail.com' },
    email2: { type: String, default: 'interskillsolutions@gmail.com' },
    address: {
      type: String,
      default: '104, Jaganath Tower, above Parijat Sweets, Opp Nerul Railway Station (West), Sector 20.',
    },
  },
  { timestamps: true }
);

export default mongoose.model('SiteStats', siteStatsSchema);
