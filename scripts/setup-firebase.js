#!/usr/bin/env node

/**
 * Firebase Setup Script
 * This script helps initialize Firebase configuration
 */

const fs = require('fs');
const path = require('path');

const envTemplate = `# Firebase Configuration
# Replace these values with your actual Firebase project configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# API Football Configuration
# Get your API key from https://www.api-football.com/
API_FOOTBALL_KEY=your_api_football_key_here
NEXT_PUBLIC_API_FOOTBALL_BASE_URL=https://v3.football.api-sports.io
`;

function setupEnvironment() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envTemplate);
    console.log('✅ Created .env.local template');
    console.log('📝 Please update the values with your actual Firebase configuration');
  } else {
    console.log('⚠️  .env.local already exists');
  }
}

function checkFirebaseConfig() {
  const configPath = path.join(process.cwd(), 'firebase.json');
  const rulesPath = path.join(process.cwd(), 'firestore.rules');
  const indexesPath = path.join(process.cwd(), 'firestore.indexes.json');
  
  console.log('\n🔍 Checking Firebase configuration files...');
  
  if (fs.existsSync(configPath)) {
    console.log('✅ firebase.json exists');
  } else {
    console.log('❌ firebase.json missing');
  }
  
  if (fs.existsSync(rulesPath)) {
    console.log('✅ firestore.rules exists');
  } else {
    console.log('❌ firestore.rules missing');
  }
  
  if (fs.existsSync(indexesPath)) {
    console.log('✅ firestore.indexes.json exists');
  } else {
    console.log('❌ firestore.indexes.json missing');
  }
}

function displayInstructions() {
  console.log('\n🚀 Firebase Setup Instructions:');
  console.log('1. Go to https://console.firebase.google.com');
  console.log('2. Create a new project');
  console.log('3. Enable Authentication (Email/Password + Google)');
  console.log('4. Create Firestore Database');
  console.log('5. Add a Web App to get configuration');
  console.log('6. Update .env.local with your configuration');
  console.log('7. Run: firebase init (if Firebase CLI is set up)');
  console.log('8. Run: firebase deploy --only firestore');
  console.log('\n📖 See FIREBASE_SETUP.md for detailed instructions');
}

function main() {
  console.log('🔥 Firebase Setup for Football Stats API Tracker\n');
  
  setupEnvironment();
  checkFirebaseConfig();
  displayInstructions();
}

if (require.main === module) {
  main();
}

module.exports = {
  setupEnvironment,
  checkFirebaseConfig,
  displayInstructions
};