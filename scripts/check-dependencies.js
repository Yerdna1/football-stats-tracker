#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function checkDependencies() {
  console.log('🔍 Checking project dependencies...\n');

  // Check package.json
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found!');
    process.exit(1);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log('✅ package.json found');
  console.log(`   Project: ${packageJson.name}`);
  console.log(`   Version: ${packageJson.version}\n`);

  // Check package-lock.json
  const packageLockPath = path.join(process.cwd(), 'package-lock.json');
  if (!fs.existsSync(packageLockPath)) {
    console.log('⚠️  package-lock.json not found');
    console.log('   Run: npm install --package-lock-only\n');
  } else {
    console.log('✅ package-lock.json found\n');
  }

  // Check node_modules
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('⚠️  node_modules not found');
    console.log('   Run: npm install\n');
  } else {
    console.log('✅ node_modules found\n');
  }

  // Check scripts
  console.log('📋 Available scripts:');
  if (packageJson.scripts) {
    Object.keys(packageJson.scripts).forEach(script => {
      console.log(`   • ${script}: ${packageJson.scripts[script]}`);
    });
  } else {
    console.log('   No scripts defined');
  }

  console.log('\n🔧 Environment checks:');
  
  // Check for .env files
  const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];
  envFiles.forEach(envFile => {
    const envPath = path.join(process.cwd(), envFile);
    if (fs.existsSync(envPath)) {
      console.log(`   ✅ ${envFile} found`);
    } else {
      console.log(`   ⚠️  ${envFile} not found`);
    }
  });

  // Check Next.js config
  const nextConfigFiles = ['next.config.js', 'next.config.ts', 'next.config.mjs'];
  let nextConfigFound = false;
  nextConfigFiles.forEach(configFile => {
    const configPath = path.join(process.cwd(), configFile);
    if (fs.existsSync(configPath)) {
      console.log(`   ✅ ${configFile} found`);
      nextConfigFound = true;
    }
  });
  
  if (!nextConfigFound) {
    console.log('   ⚠️  No Next.js config file found');
  }

  console.log('\n✨ Dependency check complete!');
}

if (require.main === module) {
  checkDependencies();
}

module.exports = { checkDependencies };