const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure DATABASE_URL and JWT_SECRET fallbacks exist for CI/CD environments (Vercel, Render, Docker)
process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-stockflow-wexa-2026';

// Ensure prisma directory exists
const prismaDir = path.join(process.cwd(), 'prisma');
if (!fs.existsSync(prismaDir)) {
  fs.mkdirSync(prismaDir, { recursive: true });
}

console.log('StockFlow Build: Initializing Prisma with DATABASE_URL =', process.env.DATABASE_URL);

try {
  console.log('Step 1/4: Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit', env: process.env });

  console.log('Step 2/4: Pushing schema to database...');
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit', env: process.env });

  console.log('Step 3/4: Seeding initial demo data...');
  execSync('node prisma/seed.js', { stdio: 'inherit', env: process.env });

  console.log('Step 4/4: Building Next.js application...');
  execSync('npx next build', { stdio: 'inherit', env: process.env });

  console.log('StockFlow Build: Completed successfully!');
} catch (error) {
  console.error('StockFlow Build failed:', error);
  process.exit(1);
}
