# 🔥 Create Firebase Project - Step by Step

## Step 1: Create New Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Click "Add project" or "Create a project"**
3. **Enter project name**: `football-stats-api-tracker` (or any name you prefer)
4. **Project ID will be generated**: Note the actual project ID (might be different)
5. **Enable Google Analytics**: Choose "Yes" (recommended)
6. **Select Analytics account**: Use default or create new
7. **Click "Create project"**
8. **Wait for project creation**: Takes 1-2 minutes

## Step 2: Get Firebase Configuration

1. **In your new project** → Click the **Web icon** `</>`
2. **App nickname**: `football-stats-web`
3. **Enable Firebase Hosting**: Check the box (optional)
4. **Click "Register app"**
5. **Copy the Firebase config object** that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

## Step 3: Update Your App Configuration

Update the `.env.local` file with your actual values:

```env
# Firebase Configuration (UPDATE THESE)
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-actual-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-actual-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-actual-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-actual-measurement-id

# API Football Configuration
API_FOOTBALL_KEY=your_api_football_key_here
NEXT_PUBLIC_API_FOOTBALL_BASE_URL=https://v3.football.api-sports.io
```

## Step 4: Update Project Reference

Update the `.firebaserc` file with your actual project ID:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

## Step 5: Enable Firebase Services

### Enable Authentication:
1. **Go to Authentication** → **Get started**
2. **Sign-in method tab** → Enable:
   - ✅ **Email/Password**
   - ✅ **Google** (add your email as authorized)

### Enable Firestore Database:
1. **Go to Firestore Database** → **Create database**
2. **Start in production mode** (we have security rules ready)
3. **Choose location**: Select closest to your users (e.g., `us-central1`)

### Enable Storage (Optional):
1. **Go to Storage** → **Get started**
2. **Start in production mode**
3. **Choose same location** as Firestore

## Step 6: Deploy Security Rules

Once you have the project created and configured:

```bash
# Login to Firebase CLI
firebase login

# Set your project
firebase use your-actual-project-id

# Deploy Firestore rules and indexes
firebase deploy --only firestore
```

## Step 7: Test Your Application

```bash
# Test Firebase connection
npm run test:firebase

# Start development server
npm run dev
```

Visit http://localhost:3000 and test:
- ✅ User registration
- ✅ User login
- ✅ Google OAuth
- ✅ Dashboard access
- ✅ API functionality (once you add API-Football key)

## 🎯 Quick Summary

The key steps are:
1. **Create project** in Firebase Console
2. **Copy the config** from the web app setup
3. **Update `.env.local`** with your actual values
4. **Update `.firebaserc`** with your project ID
5. **Enable Authentication and Firestore** in console
6. **Deploy rules** with Firebase CLI
7. **Test the app!**

Your application code is already ready - you just need to connect it to your actual Firebase project! 🚀