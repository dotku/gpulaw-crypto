import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@gpulaw.com' },
    update: {},
    create: {
      id: 'demo-user',
      email: 'demo@gpulaw.com',
      name: 'Demo User',
      role: 'LAWYER',
    },
  });

  console.log('Created demo user:', user.email);

  // Create demo case
  const demoCase = await prisma.case.upsert({
    where: { id: 'demo-case' },
    update: {},
    create: {
      id: 'demo-case',
      title: 'Demo Case - Crypto Exchange Compliance',
      clientName: 'Demo Client',
      category: 'CRYPTO_EXCHANGE_COMPLIANCE',
      description: 'This is a demo case for testing the AI legal assistant',
      status: 'IN_PROGRESS',
      userId: user.id,
    },
  });

  console.log('Created demo case:', demoCase.title);

  // Create some sample cases
  const case1 = await prisma.case.create({
    data: {
      title: 'TokenCo ICO Legal Review',
      clientName: 'TokenCo Ltd.',
      category: 'ICO_LEGAL_OPINION',
      description: 'Initial Coin Offering legal opinion and compliance review',
      status: 'DRAFT',
      userId: user.id,
    },
  });

  const case2 = await prisma.case.create({
    data: {
      title: 'DeFi Platform AML Compliance',
      clientName: 'DeFi Protocol Inc.',
      category: 'AML_COMPLIANCE',
      description: 'Anti-Money Laundering compliance assessment',
      status: 'IN_PROGRESS',
      userId: user.id,
    },
  });

  console.log('Created sample cases:', case1.title, case2.title);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
