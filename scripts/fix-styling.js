#!/usr/bin/env node

/**
 * Fix Styling Issues Script
 * Checks and fixes common Tailwind CSS issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function checkTailwindConfig() {
  console.log('🔍 Checking Tailwind CSS configuration...\n');
  
  const configPath = path.join(process.cwd(), 'tailwind.config.ts');
  const postCSSPath = path.join(process.cwd(), 'postcss.config.mjs');
  const globalsPath = path.join(process.cwd(), 'app/globals.css');
  
  let issues = [];
  
  if (!fs.existsSync(configPath)) {
    issues.push('❌ tailwind.config.ts missing');
  } else {
    console.log('✅ tailwind.config.ts found');
  }
  
  if (!fs.existsSync(postCSSPath)) {
    issues.push('❌ postcss.config.mjs missing');
  } else {
    console.log('✅ postcss.config.mjs found');
  }
  
  if (!fs.existsSync(globalsPath)) {
    issues.push('❌ app/globals.css missing');
  } else {
    const globalsContent = fs.readFileSync(globalsPath, 'utf8');
    if (globalsContent.includes('@tailwind base')) {
      console.log('✅ Tailwind directives found in globals.css');
    } else {
      issues.push('❌ Tailwind directives missing in globals.css');
    }
  }
  
  return issues;
}

function checkTailwindVersion() {
  console.log('\n🔍 Checking Tailwind CSS version...\n');
  
  try {
    const result = execSync('npm list tailwindcss --depth=0', { encoding: 'utf8' });
    console.log(result);
    
    if (result.includes('tailwindcss@4')) {
      console.log('✅ Tailwind CSS v4 detected');
      return 4;
    } else if (result.includes('tailwindcss@3')) {
      console.log('✅ Tailwind CSS v3 detected');
      return 3;
    }
  } catch (error) {
    console.log('❌ Could not determine Tailwind version');
  }
  
  return null;
}

function createTestPage() {
  console.log('\n🧪 Creating test page...\n');
  
  const testPageContent = `'use client';

export default function StyleTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎨 Styling Test Page
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            If you can see this styled properly, Tailwind CSS is working!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-red-100 border border-red-300 rounded-lg p-4">
              <h3 className="font-semibold text-red-800">Red Card</h3>
              <p className="text-red-600 text-sm mt-2">Background, border, and text colors</p>
            </div>
            
            <div className="bg-green-100 border border-green-300 rounded-lg p-4">
              <h3 className="font-semibold text-green-800">Green Card</h3>
              <p className="text-green-600 text-sm mt-2">Grid layout and spacing</p>
            </div>
            
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800">Blue Card</h3>
              <p className="text-blue-600 text-sm mt-2">Responsive design</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Hover me!
            </button>
            
            <a href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
              ← Back to App
            </a>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="font-semibold text-yellow-800 mb-2">Status Check</h2>
          <ul className="space-y-1 text-sm text-yellow-700">
            <li>✅ Colors working</li>
            <li>✅ Spacing and padding working</li>
            <li>✅ Typography working</li>
            <li>✅ Responsive grid working</li>
            <li>✅ Hover effects working</li>
          </ul>
        </div>
      </div>
    </div>
  );
}`;

  const testPagePath = path.join(process.cwd(), 'app/style-test/page.tsx');
  const testDirPath = path.join(process.cwd(), 'app/style-test');
  
  if (!fs.existsSync(testDirPath)) {
    fs.mkdirSync(testDirPath, { recursive: true });
  }
  
  fs.writeFileSync(testPagePath, testPageContent);
  console.log('✅ Test page created at /style-test');
}

function main() {
  console.log('🎨 Tailwind CSS Styling Fix Tool\n');
  
  const issues = checkTailwindConfig();
  const version = checkTailwindVersion();
  
  if (issues.length > 0) {
    console.log('\n❌ Issues found:');
    issues.forEach(issue => console.log(issue));
    console.log('\nPlease fix these issues and try again.');
    return;
  }
  
  createTestPage();
  
  console.log('\n🚀 Next steps:');
  console.log('1. Restart your development server: npm run dev');
  console.log('2. Visit http://localhost:3000/style-test');
  console.log('3. Check if styling is working properly');
  console.log('4. If issues persist, check browser console for errors');
  
  console.log('\n💡 Common fixes:');
  console.log('- Clear browser cache (Ctrl+F5)');
  console.log('- Check browser dev tools for CSS errors');
  console.log('- Ensure all @tailwind directives are in globals.css');
}

if (require.main === module) {
  main();
}