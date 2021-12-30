import prisma from '@server/helpers/prisma';
import { refreshRoles } from '@server/services/Roles';
import { NextApiHandler } from 'next';

const api: NextApiHandler = async (_req, res) => {
  // send just one user at a time to avoid spamming Discord
  const userToRefresh = await prisma.user.findFirst({
    where: {
      lastChecked: { lte: new Date(Date.now() - 1000 * 60 * 3) }
    },
    orderBy: { lastChecked: 'asc' },
    take: 1
  });

  console.log({ userToRefresh });

  if (userToRefresh) {
    await refreshRoles(userToRefresh);
  }

  return res.json({ success: true });
};

export default api;
