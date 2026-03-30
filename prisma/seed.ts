import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const defaultUser = await prisma.user.upsert({
    where: { email: 'usuario@rickmorty.app' },
    update: {
      password: hashedPassword
    },
    create: {
      email: 'usuario@rickmorty.app',
      name: 'Usuario Demo',
      password: hashedPassword
    },
  });
  console.log('Usuario por defecto actualizado con éxito:', defaultUser.email);
}

main()
  .catch((e) => {
    console.error('Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
