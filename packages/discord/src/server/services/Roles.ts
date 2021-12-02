import { User } from '.prisma/client';
import prisma from '@server/helpers/prisma';
import { addRoleForUser, removeRoleForUser } from './Discord';
import { getTilesInWallet } from './Graph';

export const ROLES = {
  ADMIN: '888532000108073002',
  OWNER: '888531194273202206',
  TERRAMASU: '888531270865408020',
  WANDERER: '915769820178436127'
};

export const refreshRoles = async (user: User) => {
  if (!user.address) return;
  const tiles = await getTilesInWallet(user.address);

  console.log(tiles);

  if (tiles.length > 0) {
    await addRoleForUser(ROLES.OWNER, user.discordId);
    await addRoleToDB(ROLES.OWNER, user);
  } else {
    await removeRoleForUser(ROLES.OWNER, user.discordId);
    await removeRoleFromDB(ROLES.OWNER, user);
  }

  // TODO: Switch to canvas ownership check when re-enabled
  if (tiles.length > 0) {
    await addRoleForUser(ROLES.TERRAMASU, user.discordId);
    await addRoleToDB(ROLES.TERRAMASU, user);
  } else {
    await removeRoleForUser(ROLES.TERRAMASU, user.discordId);
    await removeRoleFromDB(ROLES.TERRAMASU, user);
  }

  if (tiles.length == 0) {
    await addRoleForUser(ROLES.WANDERER, user.discordId);
    await addRoleToDB(ROLES.WANDERER, user);
  } else {
    await removeRoleForUser(ROLES.WANDERER, user.discordId);
    await removeRoleFromDB(ROLES.WANDERER, user);
  }
};

export const addRoleToDB = async (role: string, user: User) => {
  if (user.roles.includes(role)) return;
  await prisma.user.update({
    where: { id: user.id },
    data: { roles: { push: role } }
  });
};

export const removeRoleFromDB = async (role: string, user: User) => {
  if (user.roles.includes(role)) return;
  await prisma.user.update({
    where: { id: user.id },
    data: { roles: user.roles.filter(r => r != role) }
  });
};
