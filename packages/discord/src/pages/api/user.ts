import prisma from '@server/helpers/prisma';
import { NextApiHandler } from 'next';

const api: NextApiHandler = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.query.id as string },
    select: {
      id: true,
      discordId: true,
      discordUsername: true,
      discordDiscriminator: true,
      discordAvatar: true,
      address: true
    }
  });
  if (!user) return res.status(404).end();

  return res.json({ user });
};

export default api;
