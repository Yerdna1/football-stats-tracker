#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 CSS/GUI Diagnostics - Football Stats App\n');

// Check if files exist
const files = [
  'tailwind.config.ts',
  'postcss.config.mjs',
  'app/globals.css',
  'components/ui/button.tsx',
  'lib/utils.ts'
];

console.log('📁 Checking critical files:');
files.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

console.log('\n📦 Checking package.json dependencies:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const deps = packageJson.dependencies;
const devDeps = packageJson.devDependencies;

const criticalDeps = [
  'tailwindcss',
  '@tailwindcss/postcss',
  'autoprefixer',
  'next-themes',
  'class-variance-authority',
  'clsx',
  'tailwind-merge'
];

criticalDeps.forEach(dep => {
  const version = deps[dep] || devDeps[dep];
  console.log(`  ${version ? '✅' : '❌'} ${dep}: ${version || 'missing'}`);
});

// Check PostCSS config
console.log('\n⚙️  PostCSS Configuration:');
try {
  const postCssConfig = fs.readFileSync('postcss.config.mjs', 'utf8');
  if (postCssConfig.includes('@tailwindcss/postcss')) {
    console.log('  ✅ @tailwindcss/postcss plugin found');
  } else {
    console.log('  ❌ @tailwindcss/postcss plugin missing');
  }
  
  if (postCssConfig.includes('autoprefixer')) {
    console.log('  ✅ autoprefixer plugin found');
  } else {
    console.log('  ❌ autoprefixer plugin missing');
  }
} catch (error) {
  console.log('  ❌ Error reading postcss.config.mjs');
}

// Check Tailwind config
console.log('\n🎨 Tailwind Configuration:');
try {
  const tailwindConfig = fs.readFileSync('tailwind.config.ts', 'utf8');
  if (tailwindConfig.includes('darkMode')) {
    console.log('  ✅ Dark mode configuration found');
  }
  
  if (tailwindConfig.includes('./app/**/*.{js,ts,jsx,tsx,mdx}')) {
    console.log('  ✅ App directory content path found');
  }
  
  if (tailwindConfig.includes('tailwindcss-animate')) {
    console.log('  ✅ Tailwind animate plugin found');
  }
} catch (error) {
  console.log('  ❌ Error reading tailwind.config.ts');
}

// Check global CSS
console.log('\n🎭 Global CSS:');
try {
  const globalCss = fs.readFileSync('app/globals.css', 'utf8');
  if (globalCss.includes('@tailwind base')) {
    console.log('  ✅ @tailwind base directive found');
  }
  
  if (globalCss.includes('@tailwind components')) {
    console.log('  ✅ @tailwind components directive found');
  }
  
  if (globalCss.includes('@tailwind utilities')) {
    console.log('  ✅ @tailwind utilities directive found');
  }
  
  if (globalCss.includes('--background:')) {
    console.log('  ✅ CSS custom properties found');
  }
} catch (error) {
  console.log('  ❌ Error reading app/globals.css');
}

console.log('\n🚀 Recommendations:');
console.log('1. Restart development server: npm run dev');
console.log('2. Clear browser cache with Ctrl+F5');
console.log('3. Test styling at: http://localhost:3000/style-test');
console.log('4. Check browser console for errors');

console.log('\n✨ Diagnosis complete!');