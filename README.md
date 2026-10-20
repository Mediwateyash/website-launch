# Interskill Staffing Solutions — Next Gen Hiring

A cinematic, corporate web application and launch experience for **Interskill Staffing Solutions**.

## 🌟 Features
- **Cinematic Launch Experience**:
  - **Stage 0 (GO LIVE Podium)**: Ceremonial trigger with glowing gold aura, sonar rings, and stardust particles. Triggers via touch tap or keyboard `Enter`.
  - **Stage 1 (Atmosphere)**: Volumetric gold laser sweep revealing corporate architectural silhouettes.
  - **Stage 2 (Talent Meets Opportunity)**: High-resolution photographic cards with 3D parallax depth and specular light sheens.
  - **Stage 3 (Brand Reveal)**: Official Interskill logo emblem with golden halo, staggered brand typography, and tagline reveal.
  - **Stage 4 (Launch Invitation)**: Stable launch screen featuring the primary CTA `ENTER THE WEBSITE →` with sweeping metallic highlight.
  - **Seamless Reveal**: Iris wipe transition revealing the live website without page reload.
  - **Replay & Skip**: Replay button (`Sparkles` icon) on the live site, accessible skip button, and session storage persistence.
- **iPad Air & Tablet Optimized**: Responsive touch interaction, `100dvh` viewport support, keyboard `Enter` listener, and fluid scaling.
- **Full Corporate Platform**: Executive search, candidate job board, employer consultation forms, advisory board, and CMS admin panel.

---

## 🚀 Deploy to Vercel (1-Click)

The repository is fully configured for zero-configuration Vercel deployment via `vercel.json`:

### Option A: Via Vercel Web Dashboard (Recommended)

1. Open [https://vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account and import:
   ```text
   Mediwateyash/website-launch
   ```
3. Vercel automatically detects the configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `vite build`
   - **Output Directory**: `dist`
4. *(Optional Backend Environment Variables)*:
   Under **Environment Variables**, add any required secrets if connecting to MongoDB Atlas or Cloudinary:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
5. Click **Deploy**. Your site will be live on an official `.vercel.app` domain in seconds!

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server on local network (accessible to iPad Air)
npx vite --host 0.0.0.0 --port 5173

# Build for production
npm run build
```
