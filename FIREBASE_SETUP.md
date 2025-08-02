# Firebase Project Setup Guide

## 🚀 Step-by-Step Firebase Configuration

### 1. Create Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Click "Add Project"**
3. **Project Name**: `football-stats-api-tracker` (or your preferred name)
4. **Enable Google Analytics**: Choose "Yes" (recommended)
5. **Select Analytics Account**: Use default or create new
6. **Click "Create Project"**

### 2. Enable Authentication

1. **In Firebase Console** → Go to "Authentication"
2. **Click "Get Started"**
3. **Go to "Sign-in method" tab**
4. **Enable the following providers**:
   - **Email/Password**: Click → Enable → Save
   - **Google**: Click → Enable → Add your project email → Save

### 3. Create Firestore Database

1. **In Firebase Console** → Go to "Firestore Database"
2. **Click "Create database"**
3. **Start in production mode** (we have security rules ready)
4. **Choose location**: Select closest to your users (e.g., `us-central1`)
5. **Click "Done"**

### 4. Enable Storage (Optional)

1. **In Firebase Console** → Go to "Storage"
2. **Click "Get started"**
3. **Start in production mode**
4. **Choose same location** as Firestore
5. **Click "Done"**

### 5. Get Firebase Configuration

1. **In Firebase Console** → Go to "Project Settings" (gear icon)
2. **Scroll down to "Your apps"**
3. **Click "Add app" → Web app icon (</>)**
4. **App nickname**: `football-stats-web`
5. **Enable Firebase Hosting**: Check the box
6. **Click "Register app"**
7. **Copy the config object** (firebaseConfig)

### 6. Update Environment Variables

Create `.env.local` file with your Firebase config:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# API Football Configuration
API_FOOTBALL_KEY=your_api_football_key_here
NEXT_PUBLIC_API_FOOTBALL_BASE_URL=https://v3.football.api-sports.io
```

### 7. Deploy Firebase Configuration

Run these commands in your project directory:

```bash
# Login to Firebase (if not already logged in)
firebase login

# Initialize Firebase in your project
firebase init

# When prompted, select:
# - Firestore: Configure security rules and indexes
# - Hosting: Configure files for Firebase Hosting
# - Storage: Configure security rules for Cloud Storage

# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Deploy storage rules
firebase deploy --only storage
```

### 8. Manual Firestore Configuration

If the CLI setup doesn't work, manually configure in Firebase Console:

#### Security Rules:
Go to Firestore → Rules tab → Replace content with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // API calls - users can only access their own data
    match /api_calls/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // API responses cache - users can only access their own cached data
    match /api_responses/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
      allow delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Usage statistics - users can only access their own stats
    match /usage_stats/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

#### Create Indexes:
Go to Firestore → Indexes tab → Create these composite indexes:

1. **Collection**: `api_calls`
   - **Fields**: `userId` (Ascending), `timestamp` (Descending)

2. **Collection**: `api_calls`
   - **Fields**: `userId` (Ascending), `endpoint` (Ascending), `timestamp` (Descending)

3. **Collection**: `api_responses`
   - **Fields**: `userId` (Ascending), `endpoint` (Ascending), `expiresAt` (Descending)

4. **Collection**: `usage_stats`
   - **Fields**: `userId` (Ascending), `date` (Descending)

### 9. Test the Setup

```bash
# Start the development server
npm run dev

# The app should now work with Firebase!
# Try creating an account and testing the authentication
```

### 10. Optional: Set up Firebase Emulators for Development

```bash
# Install Firebase tools globally
npm install -g firebase-tools

# Start emulators
firebase emulators:start

# This will start local emulators for:
# - Authentication (port 9099)
# - Firestore (port 8080)
# - Hosting (port 5000)
# - Storage (port 9199)
```

### 🔐 Security Features Implemented

- **User Isolation**: Each user can only access their own data
- **Authentication Required**: All database operations require authentication
- **Expired Cache Cleanup**: Automatic cleanup of expired API response cache
- **Granular Permissions**: Specific read/write permissions for each collection

### 📊 Database Collections Created

1. **users**: User profiles and account information
2. **api_calls**: Individual API call tracking with response times
3. **api_responses**: Cached API responses for performance
4. **usage_stats**: Daily aggregated usage statistics

### 🚀 Ready to Use!

Once you complete these steps, your Football Stats API Tracker will be fully configured with:
- ✅ User authentication (Email + Google)
- ✅ Secure database with proper access controls
- ✅ API call tracking and caching
- ✅ Usage statistics and analytics
- ✅ Real-time data synchronization

## 🆘 Troubleshooting

### Common Issues:

1. **Environment Variables Not Loading**
   - Restart your development server after updating `.env.local`
   - Make sure variable names start with `NEXT_PUBLIC_` for client-side access

2. **Firestore Permission Errors**
   - Verify security rules are deployed
   - Check that user is authenticated before making database calls

3. **Authentication Not Working**
   - Verify Firebase config is correct in `.env.local`
   - Check that Authentication is enabled in Firebase Console

4. **API Calls Failing**
   - Verify API_FOOTBALL_KEY is correct in `.env.local`
   - Check that the API endpoint is accessible

### Need Help?
- Check Firebase Console for detailed error logs
- Use browser dev tools to debug authentication issues
- Review Firestore rules if getting permission denied errors