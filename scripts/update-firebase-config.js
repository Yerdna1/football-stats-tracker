#!/usr/bin/env node

/**
 * Update Firebase Configuration Script
 * Helps update .env.local and .firebaserc with new project details
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function updateFirebaseConfig() {
  console.log('🔥 Firebase Project Configuration Updater\n');
  console.log('Please provide your Firebase project configuration:\n');

  const projectId = await question('Enter your Firebase Project ID: ');
  const apiKey = await question('Enter your API Key: ');
  const authDomain = await question('Enter your Auth Domain (or press Enter for auto): ');
  const storageBucket = await question('Enter your Storage Bucket (or press Enter for auto): ');
  const messagingSenderId = await question('Enter your Messaging Sender ID: ');
  const appId = await question('Enter your App ID: ');
  const measurementId = await question('Enter your Measurement ID (optional): ');

  rl.close();

  // Auto-generate missing values
  const finalAuthDomain = authDomain || `${projectId}.firebaseapp.com`;
  const finalStorageBucket = storageBucket || `${projectId}.appspot.com`;

  // Update .env.local
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Replace or add Firebase config
  const firebaseConfig = `# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=${apiKey}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${finalAuthDomain}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${projectId}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${finalStorageBucket}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${messagingSenderId}
NEXT_PUBLIC_FIREBASE_APP_ID=${appId}
${measurementId ? `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${measurementId}` : ''}

# API Football Configuration
API_FOOTBALL_KEY=your_api_football_key_here
NEXT_PUBLIC_API_FOOTBALL_BASE_URL=https://v3.football.api-sports.io`;

  fs.writeFileSync(envPath, firebaseConfig);
  console.log('✅ Updated .env.local');

  // Update .firebaserc
  const firebaserc = {
    projects: {
      default: projectId
    }
  };

  const firebasercPath = path.join(process.cwd(), '.firebaserc');
  fs.writeFileSync(firebasercPath, JSON.stringify(firebaserc, null, 2));
  console.log('✅ Updated .firebaserc');

  console.log('\n🎉 Firebase configuration updated successfully!');
  console.log('\nNext steps:');
  console.log('1. Enable Authentication and Firestore in Firebase Console');
  console.log('2. Run: firebase login');
  console.log('3. Run: firebase deploy --only firestore');
  console.log('4. Run: npm run test:firebase');
  console.log('5. Run: npm run dev');
}

if (require.main === module) {
  updateFirebaseConfig().catch(console.error);
}

module.exports = { updateFirebaseConfig };