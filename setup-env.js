#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setup Environment Variables for Vercel Deployment');
console.log('==================================================\n');

const envTemplate = `# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key
CLERK_SECRET_KEY=sk_test_your-clerk-secret-key

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Google OAuth Configuration
GOOGLE_CLIENT_ID=42904699184-itfale5a6vvh6r9i1p8m5i7v77md8nt4.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=https://tuodominio.vercel.app/api/auth/google/callback

# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=18X9VQOYNtX-qAyHAFwkCKALuufK3MHP-ShmZ7u074X4

# Next.js Configuration
NEXTAUTH_URL=https://tuodominio.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-key
`;

const envPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Backing up...');
  fs.copyFileSync(envPath, envPath + '.backup');
}

fs.writeFileSync(envPath, envTemplate);

console.log('✅ Created .env.local template');
console.log('\n📋 Next Steps:');
console.log('1. Edit .env.local with your actual values');
console.log('2. Add these variables to Vercel Dashboard');
console.log('3. Update Google OAuth redirect URI for production');
console.log('4. Configure Clerk authentication');
console.log('\n📖 See VERCEL_SETUP.md for detailed instructions'); 