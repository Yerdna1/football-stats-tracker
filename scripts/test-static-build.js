#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏗️  Testing Static Build for Firebase Deployment\n');

function backupApiRoute() {
  const apiDir = path.join(process.cwd(), 'app', 'api');
  const backupDir = path.join(process.cwd(), 'app', 'api-backup');
  
  if (fs.existsSync(apiDir)) {
    console.log('📁 Backing up API routes...');
    if (fs.existsSync(backupDir)) {
      execSync('rm -rf app/api-backup');
    }
    execSync('cp -r app/api app/api-backup');
    console.log('✅ API routes backed up to app/api-backup\n');
    return true;
  }
  return false;
}

function removeApiRoute() {
  const apiDir = path.join(process.cwd(), 'app', 'api');
  if (fs.existsSync(apiDir)) {
    console.log('🗑️  Removing API routes for static export...');
    execSync('rm -rf app/api');
    console.log('✅ API routes removed\n');
  }
}

function restoreApiRoute() {
  const backupDir = path.join(process.cwd(), 'app', 'api-backup');
  const apiDir = path.join(process.cwd(), 'app', 'api');
  
  if (fs.existsSync(backupDir)) {
    console.log('📁 Restoring API routes...');
    if (fs.existsSync(apiDir)) {
      execSync('rm -rf app/api');
    }
    execSync('mv app/api-backup app/api');
    console.log('✅ API routes restored\n');
  }
}

function enableStaticExport() {
  const configPath = path.join(process.cwd(), 'next.config.ts');
  if (fs.existsSync(configPath)) {
    console.log('⚙️  Enabling static export in next.config.ts...');
    let config = fs.readFileSync(configPath, 'utf8');
    
    // Backup original config
    fs.writeFileSync(configPath + '.backup', config, 'utf8');
    
    // Enable static export
    if (config.includes('// output: "export"')) {
      config = config.replace('// output: "export",', 'output: "export",');
    } else if (!config.includes('output: "export"')) {
      config = config.replace('trailingSlash: true,', 'trailingSlash: true,\n  output: "export",');
    }
    
    fs.writeFileSync(configPath, config, 'utf8');
    console.log('✅ Static export enabled\n');
  }
}

function restoreConfig() {
  const configPath = path.join(process.cwd(), 'next.config.ts');
  const backupPath = configPath + '.backup';
  
  if (fs.existsSync(backupPath)) {
    console.log('⚙️  Restoring next.config.ts...');
    fs.copyFileSync(backupPath, configPath);
    fs.unlinkSync(backupPath);
    console.log('✅ Configuration restored\n');
  }
}

function testBuild() {
  console.log('🏗️  Building application for static export...');
  try {
    execSync('npm run build', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        NEXT_PUBLIC_STATIC_BUILD: 'true',
        NEXT_PUBLIC_API_FOOTBALL_KEY: process.env.API_FOOTBALL_KEY || process.env.NEXT_PUBLIC_API_FOOTBALL_KEY
      }
    });
    console.log('✅ Build successful!\n');
    return true;
  } catch (error) {
    console.log('❌ Build failed!\n');
    console.error(error.message);
    return false;
  }
}

function checkOutputDirectory() {
  const outDir = path.join(process.cwd(), 'out');
  if (fs.existsSync(outDir)) {
    console.log('📁 Checking output directory...');
    const files = fs.readdirSync(outDir);
    console.log(`   Found ${files.length} files in out/`);
    
    // Check for key files
    const keyFiles = ['index.html', '_next'];
    keyFiles.forEach(file => {
      if (files.includes(file)) {
        console.log(`   ✅ ${file} found`);
      } else {
        console.log(`   ❌ ${file} missing`);
      }
    });
    
    console.log('\n📊 Build output summary:');
    execSync('ls -la out/ | head -10');
    return true;
  } else {
    console.log('❌ Output directory not found!');
    return false;
  }
}

function cleanup() {
  console.log('\n🧹 Cleaning up...');
  restoreConfig();
  restoreApiRoute();
  
  // Clean build artifacts
  const outDir = path.join(process.cwd(), 'out');
  if (fs.existsSync(outDir)) {
    execSync('rm -rf out');
    console.log('✅ Cleaned build output');
  }
}

function main() {
  let success = false;
  
  try {
    // Setup
    const hasApiRoutes = backupApiRoute();
    removeApiRoute();
    enableStaticExport();
    
    // Test build
    success = testBuild();
    
    if (success) {
      checkOutputDirectory();
      console.log('🎉 Static build test completed successfully!');
      console.log('\n📝 Next steps:');
      console.log('1. The static build works correctly');
      console.log('2. You can deploy to Firebase Hosting');
      console.log('3. API calls will be made directly to API-Football.com');
    } else {
      console.log('💥 Static build test failed!');
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Check the error messages above');
      console.log('2. Verify environment variables are set');
      console.log('3. Ensure all components are compatible with static export');
    }
    
  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
  } finally {
    cleanup();
  }
  
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = { backupApiRoute, removeApiRoute, restoreApiRoute, enableStaticExport, restoreConfig, testBuild };