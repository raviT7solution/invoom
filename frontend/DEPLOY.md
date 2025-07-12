# Netlify Deployment Guide

This guide will help you deploy the InvOom frontend application to Netlify.

## 📋 Prerequisites

- Netlify account (free at [netlify.com](https://netlify.com))
- GitHub repository with your code
- Node.js 18+ locally (for testing)

## 🚀 Deployment Methods

### Method 1: GitHub Integration (Recommended)

1. **Push code to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**:
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Choose "GitHub" and authorize Netlify
   - Select your repository

3. **Configure Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node.js version**: `18` (automatically detected from netlify.toml)

4. **Deploy**:
   - Click "Deploy site"
   - Netlify will automatically build and deploy your app

### Method 2: Manual Deploy

1. **Build locally**:
   ```bash
   npm install
   npm run build
   ```

2. **Deploy to Netlify**:
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Drag and drop the `dist` folder to the deploy area

## ⚙️ Configuration Files

The following files have been configured for optimal Netlify deployment:

### `public/_redirects`
```
/* /index.html 200
```
- Handles client-side routing for React SPA
- Ensures all routes (e.g., `/support`, `/admin/support`) work correctly

### `netlify.toml`
- Build configuration
- Performance headers
- Caching rules for assets
- Security headers

## 🔧 Environment Variables

If you have environment variables, add them in Netlify:

1. Go to Site Settings → Environment Variables
2. Add variables like:
   - `VITE_API_URL`
   - `VITE_APP_ENV`

## 🌐 Custom Domain (Optional)

To use a custom domain:

1. Go to Site Settings → Domain Management
2. Add your custom domain
3. Follow Netlify's DNS configuration instructions

## 📊 Build Status

Your site will be available at: `https://[site-name].netlify.app`

### Build Time Optimization

The app includes:
- ✅ Optimized bundle splitting
- ✅ Asset caching (1 year for static assets)
- ✅ Gzip compression
- ✅ Security headers

## 🔄 Continuous Deployment

With GitHub integration:
- Every push to `main` branch triggers automatic deployment
- Pull requests create deploy previews
- Build status shown in GitHub commits

## 🐛 Troubleshooting

### Common Issues:

1. **404 on refresh**: Ensure `_redirects` file exists in `public/` folder
2. **Build fails**: Check Node.js version (should be 18+)
3. **Assets not loading**: Verify paths don't have leading `/` for relative imports

### Debug Build Locally:
```bash
npm run build
npm run preview
```

## 📞 Support

If you encounter issues:
- Check Netlify build logs in the dashboard
- Verify all dependencies are in `package.json`
- Ensure build completes successfully locally

## 🎉 Success!

Your InvOom application is now live on Netlify with:
- ✅ Client-side routing working
- ✅ Optimized performance
- ✅ Security headers
- ✅ Automatic deployments
- ✅ HTTPS enabled 