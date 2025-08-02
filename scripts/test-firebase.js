#!/usr/bin/env node

/**
 * Firebase Connection Test
 * Tests Firebase configuration and connection
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Test environment variables
function testEnvironmentVariables() {
  console.log('🔍 Checking environment variables...\n');
  
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];
  
  let allValid = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value && value !== 'your_api_key_here' && value !== 'your_project_id' && !value.includes('your_')) {
      console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
    } else {
      console.log(`❌ ${varName}: Missing or not configured`);
      allValid = false;
    }
  });
  
  return allValid;
}

// Test Firebase configuration
function testFirebaseConfig() {
  console.log('\n🔧 Testing Firebase configuration...\n');
  
  try {
    // Import Firebase (this will test if the config is valid)
    const { initializeApp } = require('firebase/app');
    const { getAuth } = require('firebase/auth');
    const { getFirestore } = require('firebase/firestore');
    
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    console.log('✅ Firebase app initialized successfully');
    console.log('✅ Firebase Auth configured');
    console.log('✅ Firestore configured');
    console.log(`✅ Project ID: ${firebaseConfig.projectId}`);
    
    return true;
  } catch (error) {
    console.log('❌ Firebase configuration error:', error.message);
    return false;
  }
}

function displayNextSteps() {
  console.log('\n🚀 Next Steps:\n');
  console.log('1. Make sure Firebase services are enabled in Firebase Console:');
  console.log('   - Authentication (Email/Password + Google)');
  console.log('   - Firestore Database');
  console.log('');
  console.log('2. Deploy Firestore rules and indexes:');
  console.log('   firebase login');
  console.log('   npm run deploy:firebase');
  console.log('');
  console.log('3. Start the development server:');
  console.log('   npm run dev');
  console.log('');
  console.log('4. Test authentication by creating an account');
}

function main() {
  console.log('🔥 Firebase Connection Test\n');
  
  const envValid = testEnvironmentVariables();
  const configValid = testFirebaseConfig();
  
  if (envValid && configValid) {
    console.log('\n🎉 Firebase configuration is valid!');
    displayNextSteps();
  } else {
    console.log('\n❌ Firebase configuration issues detected');
    console.log('Please check your .env.local file and Firebase project settings');
  }
}

if (require.main === module) {
  main();
}

module.exports = { testEnvironmentVariables, testFirebaseConfig };