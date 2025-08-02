#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase CI Setup Script\n');

function checkFirebaseInstalled() {
  try {
    execSync('firebase --version', { stdio: 'pipe' });
    console.log('✅ Firebase CLI is installed');
    return true;
  } catch (error) {
    console.log('❌ Firebase CLI is not installed');
    console.log('   Install it with: npm install -g firebase-tools');
    return false;
  }
}

function checkFirebaseProject() {
  const firebaseConfigPath = path.join(process.cwd(), 'firebase.json');
  if (fs.existsSync(firebaseConfigPath)) {
    console.log('✅ firebase.json found');
    try {
      const config = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
      console.log(`   Project: ${config.projectId || 'Not specified'}`);
      return true;
    } catch (error) {
      console.log('⚠️  firebase.json is invalid JSON');
      return false;
    }
  } else {
    console.log('❌ firebase.json not found');
    console.log('   Run: firebase init');
    return false;
  }
}

function generateCIToken() {
  console.log('\n🔑 Generating Firebase CI Token...');
  console.log('This will open a browser window for authentication.\n');
  
  try {
    const result = execSync('firebase login:ci', { 
      encoding: 'utf8',
      stdio: ['inherit', 'pipe', 'inherit']
    });
    
    // Extract token from output
    const tokenMatch = result.match(/([a-zA-Z0-9\-_]{20,})/);
    if (tokenMatch) {
      const token = tokenMatch[1];
      console.log('\n✅ Firebase CI Token generated successfully!');
      console.log('\n📋 Copy this token to your GitHub repository secrets:');
      console.log(`   Secret name: FIREBASE_TOKEN`);
      console.log(`   Secret value: ${token}`);
      console.log('\n🔗 Add it here: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions');
      
      // Save to local file for reference
      const tokenFile = path.join(process.cwd(), '.firebase-token');
      fs.writeFileSync(tokenFile, token, 'utf8');
      console.log(`\n💾 Token also saved to: ${tokenFile}`);
      console.log('   (Do not commit this file to git!)');
      
      return token;
    } else {
      console.log('❌ Could not extract token from Firebase CLI output');
      console.log('   Please run "firebase login:ci" manually');
      return null;
    }
  } catch (error) {
    console.log('❌ Failed to generate CI token');
    console.log('   Error:', error.message);
    console.log('\n💡 Try running manually:');
    console.log('   firebase login:ci');
    return null;
  }
}

function testToken(token) {
  if (!token) return false;
  
  console.log('\n🧪 Testing Firebase token...');
  try {
    execSync(`firebase projects:list --token "${token}"`, { 
      stdio: 'pipe' 
    });
    console.log('✅ Token is valid and working!');
    return true;
  } catch (error) {
    console.log('❌ Token test failed');
    console.log('   Please verify the token is correct');
    return false;
  }
}

function main() {
  console.log('Checking Firebase setup...\n');
  
  if (!checkFirebaseInstalled()) {
    process.exit(1);
  }
  
  if (!checkFirebaseProject()) {
    console.log('\n💡 Initialize Firebase first:');
    console.log('   firebase init');
    process.exit(1);
  }
  
  const token = generateCIToken();
  
  if (token) {
    testToken(token);
    
    console.log('\n📝 Next steps:');
    console.log('1. Copy the token to GitHub Secrets as FIREBASE_TOKEN');
    console.log('2. Set your Firebase Project ID in GitHub Secrets as FIREBASE_PROJECT_ID');
    console.log('3. Push your changes to trigger the deployment workflow');
    console.log('\n✨ Firebase CI setup complete!');
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkFirebaseInstalled, checkFirebaseProject, generateCIToken };