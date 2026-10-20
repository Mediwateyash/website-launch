import { connectDB } from '../server/config/db.js';
import app from '../server/server.js';

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error('[Vercel DB Connection Error]:', err);
    }
  }
  return app(req, res);
}
