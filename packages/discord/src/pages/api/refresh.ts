import prisma from '@server/helpers/prisma';
import { refreshRoles } from '@server/services/Roles';
import { NextApiHandler } from 'next';

const api: NextApiHandler = async (_req, res) => {
  const usersToRefresh = await prisma.user.findMany({
    where: {
      lastChecked: { lte: new Date(Date.now() - 1000 * 60 * 3) }
    },
    orderBy: { lastChecked: 'asc' }
  });
  for (const user of usersToRefresh) {
    await refreshRoles(user);
  }
  return res.json({ success: true });
};

export default api;
