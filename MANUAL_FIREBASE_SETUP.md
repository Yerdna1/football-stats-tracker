# Manual Firebase Setup Guide

## 🚨 Authentication Issue Resolved

The Firebase CLI is having authentication token issues. Here's how to complete the setup manually:

## Step 1: Verify Project in Firebase Console

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Check if project exists**: Look for `football-stats-api-tracker`
3. **If project doesn't exist**: Create it with this exact name
4. **If project exists with different name**: Note the actual project ID

## Step 2: Enable Required Services

### Enable Authentication:
1. Go to **Authentication** → **Get Started**
2. Go to **Sign-in method** tab
3. Enable **Email/Password**
4. Enable **Google** (add your email as authorized)

### Enable Firestore:
1. Go to **Firestore Database** → **Create database**
2. Start in **production mode** (we have security rules ready)
3. Choose location closest to users

### Enable Storage (Optional):
1. Go to **Storage** → **Get started**
2. Start in **production mode**

## Step 3: Manual Security Rules Setup

### Firestore Rules:
1. Go to **Firestore** → **Rules** tab
2. Replace the content with our prepared rules:

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

3. Click **Publish**

### Create Firestore Indexes:
1. Go to **Firestore** → **Indexes** tab
2. Create these **composite indexes**:

**Index 1:**
- Collection ID: `api_calls`
- Fields: `userId` (Ascending), `timestamp` (Descending)

**Index 2:**
- Collection ID: `api_calls`  
- Fields: `userId` (Ascending), `endpoint` (Ascending), `timestamp` (Descending)

**Index 3:**
- Collection ID: `api_responses`
- Fields: `userId` (Ascending), `endpoint` (Ascending), `expiresAt` (Descending)

**Index 4:**
- Collection ID: `usage_stats`
- Fields: `userId` (Ascending), `date` (Descending)

## Step 4: Update Project Configuration

If your project has a different name, update the `.firebaserc` file:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

## Step 5: Test the Application

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open http://localhost:3000**

3. **Test authentication**:
   - Try creating a new account
   - Try logging in with Google
   - Navigate to dashboard

4. **Test API functionality**:
   - Add your API-Football key to `.env.local`:
     ```
     API_FOOTBALL_KEY=your_actual_api_key_here
     ```
   - Try the Countries or Leagues pages

## Step 6: Verify Everything Works

### Test Checklist:
- [ ] User registration works
- [ ] User login works  
- [ ] Google OAuth works
- [ ] Dashboard shows user info
- [ ] Countries page loads data
- [ ] Leagues page loads data
- [ ] Theme toggle works
- [ ] No console errors

## 🎉 Success!

Once you complete these steps, your Football Stats API Tracker will be fully functional with:

- ✅ Secure user authentication
- ✅ Real-time API call tracking
- ✅ Response caching for performance
- ✅ Usage statistics and analytics
- ✅ Modern, responsive UI

## 🆘 Troubleshooting

### Common Issues:

1. **"Permission denied" errors**
   - Check that Firestore rules are published
   - Verify user is logged in

2. **"Project not found" errors**
   - Verify project ID in `.firebaserc`
   - Check project exists in Firebase Console

3. **API calls failing**
   - Add valid API-Football key to `.env.local`
   - Check Network tab in browser dev tools

4. **Authentication not working**
   - Verify Auth providers are enabled
   - Check browser console for errors

### Firebase CLI Alternative:

If you want to try Firebase CLI again later:
```bash
firebase logout
firebase login
firebase use your-actual-project-id
firebase deploy --only firestore
```

---

**Your application is ready to use! 🚀**