import { ADMIN_ADDRESSES, EMOJI_CODES } from '@app/features/AddressBook';
import { verifyMessage } from '@ethersproject/wallet';
import { NextApiHandler } from 'next';
import { DISCORD_CHANNELS } from '@app/features/AddressBook';
import { getTile } from '@app/features/useTile';
import prisma from 'lib/prisma';

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

const api: NextApiHandler = async (req, res) => {
  const {
    signature,
    account,
    tokenId,
    landlessOnly
  }: {
    signature: string;
    account: string;
    tokenId: string;
    landlessOnly: string;
  } = req.body;

  if (req.method == 'POST') {
    const signingAccount = verifyMessage('I am me.', signature);

    if (!ADMIN_ADDRESSES.includes(signingAccount.toLowerCase())) {
      return res.status(400).json({ error: 'not authorized' });
    }

    if (account.toLowerCase() != signingAccount.toLowerCase())
      return res.status(400).json({ error: 'Invalid signature' });

    console.log(tokenId);
    const tile = await getTile(parseInt(tokenId));
    const giveaway = await prisma.gorblinGiveaway.findUnique({
      where: {
        tokenId: parseInt(tokenId)
      }
    });
    if (!giveaway || !tile) return res.json({ error: 'no tile / giveaway' });
    console.log('giveaway', giveaway);
    console.log('tile', tile);

    if (!tile) {
      return res.status(400).json({ error: 'No tile available' });
    }

    let response = await fetch(
      `${process.env.NEXT_PUBLIC_DISCORD_BOT_SERVER_URL}/api/reactions?channelId=${DISCORD_CHANNELS['terra-masu']}&messageId=${giveaway?.discordMessageId}&emoji=${EMOJI_CODES[':green_circle:']}&landlessOnly=${landlessOnly}`
    ).then((r) => r.json());

    const { addresses, reactions } = response;
    console.log({ addresses });

    let recipientAddress;
    if (addresses.length > 0) {
      const result = getRandomIntInclusive(0, addresses.length - 1);
      recipientAddress = addresses[result];
    } else {
      if (addresses.length == 1) {
        console.log('one response found');
        recipientAddress = addresses[0];
      } else {
        console.log('no responders!');
        return res.json({ error: 'no valid responses' });
      }
    }

    console.log('selected as winner', recipientAddress);
    await prisma.gorblinGiveaway.update({
      where: {
        id: giveaway.id
      },
      data: {
        winner: recipientAddress
      }
    });

    const discordResponse = await fetch(
      `${process.env.NEXT_PUBLIC_DISCORD_BOT_SERVER_URL}/api/lookup?address=${recipientAddress}`
    );
    const discordResponseJson = await discordResponse.json();

    return res.json({
      landlessOnly,
      addresses: addresses,
      winner: recipientAddress,
      reactions: reactions,
      winnerLookup: discordResponseJson
    });
  }
};

export default api;
