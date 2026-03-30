import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const defaultUser = await prisma.user.upsert({
    where: { email: 'usuario@rickmorty.app' },
    update: {},
    create: {
      email: 'usuario@rickmorty.app',
      name: 'Usuario Demo',
    },
  });
  console.log('Usuario por defecto creado:', defaultUser);
}

main()
  .catch((e) => {
    console.error('Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
