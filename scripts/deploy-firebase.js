#!/usr/bin/env node

/**
 * Firebase Deployment Script
 * Deploys Firestore rules and indexes to Firebase
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function checkFirebaseConfig() {
  const firebaserc = path.join(process.cwd(), '.firebaserc');
  const firebaseJson = path.join(process.cwd(), 'firebase.json');
  const firestoreRules = path.join(process.cwd(), 'firestore.rules');
  
  if (!fs.existsSync(firebaserc)) {
    console.error('❌ .firebaserc not found');
    return false;
  }
  
  if (!fs.existsSync(firebaseJson)) {
    console.error('❌ firebase.json not found');
    return false;
  }
  
  if (!fs.existsSync(firestoreRules)) {
    console.error('❌ firestore.rules not found');
    return false;
  }
  
  return true;
}

function deployFirestore() {
  try {
    console.log('🚀 Deploying Firestore rules and indexes...');
    execSync('firebase deploy --only firestore', { stdio: 'inherit' });
    console.log('✅ Firestore deployment completed successfully!');
  } catch (error) {
    console.error('❌ Firestore deployment failed:', error.message);
    console.log('\n💡 Make sure you are logged in to Firebase:');
    console.log('   firebase login');
    console.log('\n💡 Then try deploying again:');
    console.log('   npm run deploy:firebase');
  }
}

function main() {
  console.log('🔥 Firebase Deployment for Football Stats API Tracker\n');
  
  if (!checkFirebaseConfig()) {
    console.log('❌ Firebase configuration files missing');
    return;
  }
  
  deployFirestore();
}

if (require.main === module) {
  main();
}

module.exports = { checkFirebaseConfig, deployFirestore };