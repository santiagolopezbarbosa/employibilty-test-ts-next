const path = require('node:path');
// Asignamos la variable de entorno explícitamente dado que Prisma 7 la toma de process.env
process.env.DATABASE_URL = `file:${path.resolve(__dirname, 'prisma', 'dev.db')}`;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});

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
