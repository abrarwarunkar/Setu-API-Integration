# Deployment Guide

## Stage 2 & 3 - Frontend Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Alternative - GitHub Integration**:
   - Push code to GitHub repository
   - Connect repository to Vercel dashboard
   - Auto-deploy on every push

### Deploy to Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy**:
   - Drag and drop `.next` folder to Netlify
   - Or use Netlify CLI: `netlify deploy --prod --dir=.next`

### Environment Setup

No environment variables needed - all configuration happens in the browser via Settings page.

### Testing Deployment

1. Visit deployed URL
2. Configure API credentials in Settings
3. Test complete workflow:
   - Upload PDF contract
   - Complete signature process
   - Check status and download

### Security Notes

- ⚠️ This is a demo application only
- API credentials stored in localStorage (insecure)
- Not suitable for production use
- Clear security warnings displayed to users