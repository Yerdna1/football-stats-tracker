# Firebase Deployment Guide

This guide explains how to deploy the Football Stats Application to Firebase Hosting.

## Prerequisites

1. **Firebase CLI installed globally**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase project configured**:
   - Firebase project created at https://console.firebase.google.com
   - `firebase.json` configured (already included)

## Local Deployment Setup

### 1. Initialize Firebase (if not done)
```bash
firebase init
# Select Hosting and Firestore
# Choose your Firebase project
# Set public directory to 'out'
# Configure as single-page app: Yes
```

### 2. Generate Firebase CI Token
```bash
npm run setup:firebase-ci
```
Or manually:
```bash
firebase login:ci
```

### 3. Test Local Build
```bash
# Build for static hosting
npm run build

# Test locally
firebase serve
```

## GitHub Actions Deployment

### Required GitHub Secrets

Set these secrets in your GitHub repository (`Settings` → `Secrets and variables` → `Actions`):

#### Firebase Authentication
- `FIREBASE_TOKEN`: Generated from `firebase login:ci`
- `FIREBASE_PROJECT_ID`: Your Firebase project ID

#### Or (Alternative - Service Account)
- `FIREBASE_SERVICE_ACCOUNT_FOOTBALL_STATS_API_TRACKER`: Service account JSON

#### Environment Variables
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_API_FOOTBALL_BASE_URL`

### Deployment Workflows

Two deployment workflows are available:

1. **`firebase-deploy.yml`** (CLI-based):
   - Uses Firebase CLI with token authentication
   - More traditional approach
   - Requires `FIREBASE_TOKEN` secret

2. **`firebase-deploy-action.yml`** (Action-based):
   - Uses GitHub Action for Firebase
   - More modern approach
   - Requires `FIREBASE_SERVICE_ACCOUNT_*` secret

### Deployment Process

1. **Push to main branch**:
   ```bash
   git push origin main
   ```

2. **Automatic deployment**:
   - CI pipeline runs tests and build
   - On success, deployment workflow triggers
   - Application deployed to Firebase Hosting

## Manual Deployment

### Option 1: Using npm script
```bash
npm run deploy:firebase
```

### Option 2: Direct Firebase CLI
```bash
# Build the application
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

## Build Configuration

The application uses different configurations for development vs deployment:

### Development (with API routes)
```typescript
// next.config.ts
const nextConfig = {
  // output: 'export', // Commented out
  trailingSlash: true,
  // ... other config
};
```

### Production Deployment (static export)
```typescript
// next.config.ts (automatically modified by CI)
const nextConfig = {
  output: 'export', // Enabled for static hosting
  trailingSlash: true,
  // ... other config
};
```

## Troubleshooting

### Common Issues

1. **Token Missing Error**:
   ```
   error: option '--token <token>' argument missing
   ```
   **Solution**: Set `FIREBASE_TOKEN` secret in GitHub repository

2. **Build Failures**:
   - Check environment variables are set
   - Verify Next.js configuration
   - Check Firebase project permissions

3. **Deployment Permission Errors**:
   - Verify Firebase project access
   - Check token validity: `firebase projects:list --token YOUR_TOKEN`

### Debug Commands

```bash
# Check dependencies
npm run check-deps

# Verify Firebase setup
firebase projects:list

# Test build locally
npm run build

# Test Firebase serving
firebase serve
```

### Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Run the debug commands above
3. Verify all secrets are properly set
4. Test deployment locally first

## Security Notes

- Never commit Firebase tokens to git
- Use GitHub Secrets for sensitive information
- Rotate tokens periodically
- Monitor Firebase usage and billing