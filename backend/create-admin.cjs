// Create admin user directly in DB
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const p = new PrismaClient();

async function createAdmin() {
  const email = 'admin@jump1.com';
  const password = 'admin123';
  const name = 'Admin';
  
  console.log('Creating admin user...');
  console.log('Email:', email);
  console.log('Password:', password);
  
  // Check if exists
  const existing = await p.user.findUnique({ where: { email } });
  if (existing) {
    console.log('⚠️  User already exists, updating password...');
    const hashed = await bcrypt.hash(password, 10);
    await p.user.update({
      where: { email },
      data: { password: hashed }
    });
    console.log('✅ Password updated');
  } else {
    const hashed = await bcrypt.hash(password, 10);
    const user = await p.user.create({
      data: {
        email,
        password: hashed,
        name,
        role: 'admin',
        project: 'jump1',
      }
    });
    console.log('✅ Admin user created (id:', user.id + ')');
  }
  
  // Verify
  const count = await p.user.count();
  console.log('Total users in DB:', count);
  
  await p.$disconnect();
}

createAdmin().catch(e => { console.error('Error:', e); process.exit(1); });
