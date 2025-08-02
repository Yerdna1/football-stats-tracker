# ⚽ Football Stats API Tracker

A modern Next.js application that fetches football data from API-Football.com, tracks API usage, stores responses in Firebase, and displays comprehensive statistics with authentication.

![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8)
![Firebase](https://img.shields.io/badge/Firebase-12.0.0-orange)

## ✨ Features

### 🏈 Core Football Data
- **Countries & Leagues**: Browse all available countries and football leagues
- **Teams & Players**: Search and explore teams with detailed player statistics
- **Live Fixtures**: View upcoming and live match fixtures
- **Standings**: League tables with real-time standings
- **Statistics**: Detailed match and player statistics
- **Predictions**: Match predictions and betting odds
- **Top Scorers**: League top scorers with goals and assists

### 📊 API Management & Analytics
- **Real-time API Tracking**: Monitor every API call with response times
- **Smart Caching**: Intelligent caching system reduces API calls
- **Rate Limiting**: Built-in rate limit handling with exponential backoff
- **Usage Statistics**: Comprehensive analytics dashboard
- **Cost Estimation**: Track API usage costs
- **Error Handling**: Graceful error handling with user-friendly messages

### 🔐 Authentication & Security
- **Firebase Authentication**: Email/password and Google OAuth
- **Protected Routes**: Secure dashboard access
- **User Profiles**: Individual user data isolation
- **Security Rules**: Firestore security rules implementation

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark/Light Mode**: System preference detection with manual toggle
- **Professional UI**: Built with shadcn/ui components
- **Smooth Animations**: Enhanced user experience with transitions
- **Loading States**: Proper loading indicators and skeleton screens

## 🚀 Tech Stack

- **Frontend**: Next.js 15.4.5 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: Zustand
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **API Integration**: Axios with interceptors
- **Charts**: Recharts
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and npm
- Firebase project with Authentication and Firestore enabled
- API-Football.com API key

## Setup Instructions

1. **Clone the repository**
   ```bash
   cd all-football-stats
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.local.example` to `.env.local` and fill in your credentials:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here

   # API Football Configuration
   API_FOOTBALL_KEY=your_api_football_key_here
   NEXT_PUBLIC_API_FOOTBALL_BASE_URL=https://v3.football.api-sports.io
   ```

4. **Set up Firebase**
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password and Google)
   - Enable Firestore Database
   - Copy your Firebase configuration to `.env.local`

5. **Configure Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only read/write their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // API calls are user-specific
       match /api_calls/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
       
       // API responses are user-specific
       match /api_responses/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
       
       // Usage stats are user-specific
       match /usage_stats/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
     }
   }
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open the application**
   Navigate to http://localhost:3000

## Project Structure

```
/app
  /api              # API route handlers
  /auth             # Authentication pages
  /dashboard        # Main application pages
/components
  /ui               # Reusable UI components
  /layout           # Layout components
  /auth             # Auth-specific components
/lib
  /firebase         # Firebase configuration and helpers
  /api-football     # API client and services
  /utils            # Utility functions
/types              # TypeScript type definitions
/store              # State management
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## API Endpoints

The application supports all major Football API endpoints:

- **Countries**: Browse all available countries
- **Leagues**: Explore leagues and competitions
- **Teams**: View team information
- **Fixtures**: Match schedules and live scores
- **Standings**: League tables
- **Players**: Player information and statistics
- **Top Scorers**: Leading goalscorers by league
- **Statistics**: Detailed match statistics
- **Predictions**: Match predictions
- **Odds**: Betting odds information

## Features in Detail

### API Call Tracking
- Every API call is automatically tracked
- Response times, status codes, and response sizes are recorded
- Failed requests are logged with error details

### Caching System
- GET requests are automatically cached for 15 minutes
- Cached responses are served instantly without API calls
- Cache is user-specific and stored in Firestore

### Usage Statistics
- Daily usage statistics are calculated automatically
- Track calls by endpoint
- Monitor average response times
- View error rates and trends

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
