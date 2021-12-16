import { User } from '.prisma/client';
import prisma from '@server/helpers/prisma';
import { addRoleForUser, removeRoleForUser } from './Discord';
import { getTilesInWallet } from './Graph';

export const ROLES = {
  ADMIN: '888532000108073002',
  // EXQUISITE LAND DISCORD SERVER
  OWNER: '888531194273202206',
  TERRAMASU: '888531270865408020',
  LANDLESS: '915769820178436127'
  // RELATIONAL OS DISCORD SERVER
  // OWNER: '916015477006938122',
  // TERRAMASU: '915768392806465557',
  // LANDLESS: '915761719811383306'
};

// TODO: return role difference for bot notification filtering
export const refreshRoles = async (user: User) => {
  if (!user.address) return;
  const tiles = await getTilesInWallet(user.address);

  console.log('tiles.length', tiles.length);

  if (tiles.length > 0) {
    let r = await addRoleForUser(ROLES.OWNER, user.discordId);
    console.log({ r });
    await addRoleToDB(ROLES.OWNER, user);
  } else {
    let r = await removeRoleForUser(ROLES.OWNER, user.discordId);
    console.log({ r });
    await removeRoleFromDB(ROLES.OWNER, user);
  }

  // re-fetch the user from the database
  user = (await prisma.user.findUnique({ where: { id: user.id } })) || user;

  // TODO: Switch to canvas ownership check when re-enabled
  if (tiles.length > 0) {
    let r = await addRoleForUser(ROLES.TERRAMASU, user.discordId);
    console.log({ r });
    await addRoleToDB(ROLES.TERRAMASU, user);
  } else {
    let r = await removeRoleForUser(ROLES.TERRAMASU, user.discordId);
    console.log({ r });
    await removeRoleFromDB(ROLES.TERRAMASU, user);
  }

  user = (await prisma.user.findUnique({ where: { id: user.id } })) || user;

  if (tiles.length == 0) {
    let r = await addRoleForUser(ROLES.LANDLESS, user.discordId);
    console.log({ r });
    await addRoleToDB(ROLES.LANDLESS, user);
  } else {
    let r = await removeRoleForUser(ROLES.LANDLESS, user.discordId);
    console.log({ r });
    await removeRoleFromDB(ROLES.LANDLESS, user);
  }
};

export const addRoleToDB = async (role: string, user: User) => {
  console.log('adding', role, 'to db', user.discordId);
  if (user.roles.includes(role)) return;
  await prisma.user.update({
    where: { id: user.id },
    data: { roles: { push: role } }
  });
};

export const removeRoleFromDB = async (role: string, user: User) => {
  console.log('removing', role, 'from db', user.discordId);
  if (!user.roles.includes(role)) return;
  await prisma.user.update({
    where: { id: user.id },
    data: { roles: user.roles.filter((r) => r != role) }
  });
};
