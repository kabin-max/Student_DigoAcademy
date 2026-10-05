import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
  const result = await db.lesson.updateMany({
    where: { type: 'VIDEO' },
    data: { type: 'NOTE' }
  });
  console.log(`Updated ${result.count} lessons from VIDEO to NOTE`);
}

main().catch(console.error).finally(() => db.$disconnect());
