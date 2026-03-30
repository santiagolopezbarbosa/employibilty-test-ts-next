const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function fix() {
  const prisma = new PrismaClient();
  try {
    const hashedPassword = await bcrypt.hash('123456', 10);
    // Usamos $executeRaw para evitar problemas con el cliente desactualizado de TS
    console.log('Intentando actualizar password vía raw query...');
    await prisma.$executeRawUnsafe(
      `UPDATE User SET password = ? WHERE email = ?`,
      hashedPassword,
      'usuario@rickmorty.app'
    );
    console.log('✅ Password actualizado con éxito.');
  } catch (e) {
    console.error('❌ Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

fix();
