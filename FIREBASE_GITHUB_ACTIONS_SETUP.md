# 🔥 Firebase GitHub Actions Deployment Setup

## Overview
This guide will help you set up automatic deployment to Firebase Hosting using GitHub Actions, replacing the failing Vercel deployment.

## Prerequisites
- ✅ Firebase project created (`football-stats-api-tracker`)
- ✅ Next.js application ready for deployment
- ✅ GitHub repository with admin access

## Step 1: Generate Firebase Service Account Key

### 1.1 Go to Firebase Console
1. Open https://console.firebase.google.com/
2. Select your project: `football-stats-api-tracker`
3. Click on ⚙️ **Project Settings** (gear icon)

### 1.2 Generate Service Account Key
1. Go to **Service Accounts** tab
2. Click **"Generate new private key"**
3. A JSON file will be downloaded - this contains your service account credentials

### 1.3 Prepare the JSON for GitHub Secrets
1. Open the downloaded JSON file
2. Copy the entire content (it starts with `{` and ends with `}`)
3. We'll use this in Step 3

## Step 2: Generate Firebase Token

### 2.1 Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### 2.2 Login to Firebase
```bash
firebase login
```
- This will open a browser window
- Log in with your Google account
- Allow Firebase CLI access

### 2.3 Generate Deployment Token
```bash
firebase login:ci
```
- This will generate a token that looks like: `1/ABCD1234...`
- Copy this token - we'll use it in Step 3

## Step 3: Configure GitHub Repository Secrets

### 3.1 Go to Your GitHub Repository
1. Navigate to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click on **Secrets and variables** → **Actions**

### 3.2 Add Repository Secrets

#### Secret 1: FIREBASE_SERVICE_ACCOUNT
1. Click **"New repository secret"**
2. **Name**: `FIREBASE_SERVICE_ACCOUNT`
3. **Secret**: Paste the entire JSON content from Step 1.3
4. Click **"Add secret"**

#### Secret 2: FIREBASE_TOKEN
1. Click **"New repository secret"**
2. **Name**: `FIREBASE_TOKEN`
3. **Secret**: Paste the token from Step 2.3
4. Click **"Add secret"**

#### Secret 3: FIREBASE_PROJECT_ID
1. Click **"New repository secret"**
2. **Name**: `FIREBASE_PROJECT_ID`
3. **Secret**: `football-stats-api-tracker`
4. Click **"Add secret"**

#### Secret 4: Firebase Environment Variables
Add these secrets for your Firebase configuration:

| Secret Name | Value |
|-------------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `football-stats-api-tracker` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your app ID |
| `NEXT_PUBLIC_API_FOOTBALL_BASE_URL` | `https://v3.football.api-sports.io` |

## Step 4: Enable Firebase Services

### 4.1 Enable Firebase Hosting
1. Go to Firebase Console → **Build** → **Hosting**
2. Click **"Get started"**
3. Follow the setup wizard

### 4.2 Enable Firebase Functions (for API routes)
1. Go to Firebase Console → **Build** → **Functions**
2. Click **"Get started"**
3. Choose the Blaze plan (pay-as-you-go) - required for Functions
4. Enable billing (you'll only pay for usage beyond the free tier)

## Step 5: Set Up Firebase Functions for Next.js API Routes

### 5.1 Initialize Firebase Functions (if not already done)
```bash
cd all-football-stats
firebase init functions
```
- Choose JavaScript as the language
- Use default settings

### 5.2 Create Functions Index File
Create `all-football-stats/functions/index.js`:

```javascript
const functions = require('firebase-functions');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev: dev, conf: { distDir: 'next' } });
const handle = app.getRequestHandler();

exports.api = functions.https.onRequest((req, res) => {
  return app.prepare().then(() => handle(req, res));
});
```

### 5.3 Update Functions Package.json
Create `all-football-stats/functions/package.json`:

```json
{
  "name": "functions",
  "description": "Cloud Functions for Firebase",
  "scripts": {
    "serve": "firebase emulators:start --only functions",
    "shell": "firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "20"
  },
  "dependencies": {
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^5.0.0",
    "next": "^15.0.0"
  },
  "private": true
}
```

## Step 6: Test the Deployment

### 6.1 Commit and Push Changes
```bash
cd all-football-stats
git add .
git commit -m "Set up Firebase GitHub Actions deployment"
git push origin main
```

### 6.2 Check GitHub Actions
1. Go to your GitHub repository
2. Click on **Actions** tab
3. You should see the "Deploy to Firebase Hosting" workflow running
4. If it fails, check the logs for error messages

## Step 7: Verify Deployment

### 7.1 Check Firebase Console
1. Go to Firebase Console → **Build** → **Hosting**
2. You should see your deployment in the dashboard
3. Click on the hosting URL to verify your app is working

### 7.2 Test API Routes
1. Try accessing your API routes through the Firebase hosting URL
2. Verify that authentication and other features work correctly

## Troubleshooting

### Common Issues and Solutions

#### 1. "FIREBASE_TOKEN" secret not found
- Make sure you added the token as a repository secret
- Check for typos in the secret name

#### 2. "FIREBASE_SERVICE_ACCOUNT" JSON parsing error
- Ensure you copied the entire JSON content without modifications
- Check for extra spaces or line breaks

#### 3. Functions deployment fails
- Make sure you're on the Blaze plan
- Check that the functions dependencies are correctly installed
- Verify the functions index.js syntax is correct

#### 4. Build fails due to missing environment variables
- Double-check all Firebase environment variables are added as secrets
- Verify the variable names match exactly

## Success! 🎉

Once completed, your Next.js application will automatically deploy to Firebase Hosting whenever you push to the main branch. The setup includes:
- ✅ Automatic builds and deployments
- ✅ API routes handled by Firebase Functions
- ✅ Environment variables properly configured
- ✅ Static asset optimization
- ✅ Custom domain support (ready to configure)

**Your deployment URL**: `https://football-stats-api-tracker.web.app`

---

**Note**: The first deployment might take a few minutes as Firebase sets up the hosting environment. Subsequent deployments will be much faster.
