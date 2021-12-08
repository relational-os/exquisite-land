import prisma from '@server/helpers/prisma';
import { NextApiHandler } from 'next';
import { ROLES } from '@server/services/Roles';

const api: NextApiHandler = async (_req, res) => {
  const channelId = _req.query.channelId as string;
  const messageId = _req.query.messageId as string;
  const emoji = _req.query.emoji as string;

  let response = await listEmojiReactionsOnMessage(channelId, messageId, emoji);

  // compile list of valid addresses
  let addresses: string[] = [];
  let promises = response.map(async (reaction: any) => {
    const userRecord = await prisma.user.findUnique({
      where: { discordId: reaction.id as string },
      select: {
        id: true,
        discordUsername: true,
        address: true,
        roles: true
      }
    });

    if (userRecord && userRecord.roles.includes(ROLES.LANDLESS)) {
      if (userRecord.address) {
        addresses.push(userRecord.address);
      }
    }
  });

  await Promise.all(promises);

  return res.json({ success: true, addresses: addresses });
};

export const listEmojiReactionsOnMessage = async (
  channelId: string,
  messageId: string,
  emoji: string
) => {
  const url = `https://discord.com/api/v9/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(
    emoji
  )}?limit=100`;
  return await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_CLIENT_TOKEN}`,
      'Content-Type': 'application/json'
    }
  }).then((res) => res.json());
};

export default api;