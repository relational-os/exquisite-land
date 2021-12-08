import { ADMIN_ADDRESSES, EMOJI_CODES } from '@app/features/AddressBook';
import { verifyMessage } from '@ethersproject/wallet';
// import { sendMessage } from '@server/Discord';
import { NextApiHandler } from 'next';
import { DISCORD_CHANNELS } from '@app/features/AddressBook';
// import GorblinTools from 'src/pages/utils/gorblin';
// import TileSVG from '@app/components/canvas/TileSVG';
// import { getNextTile } from '@server/Gorblin';
import { generateGorblinCoin } from '@server/GenerateGorblin';
// import { generateCoin } from '@server/LandGranter';
import { getTile } from '@app/features/useTile';
import FormData from 'form-data';
// import { Blob } from 'buffer';

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

const api: NextApiHandler = async (req, res) => {
  const {
    signature,
    account,
    discordMessageId,
    tokenId
  }: {
    signature: string;
    account: string;
    discordMessageId: string;
    tokenId: string;
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
    console.log({ tile });

    if (!tile) {
      return res.status(400).json({ error: 'No tile available' });
    }

    let response = await fetch(
      `${process.env.NEXT_PUBLIC_DISCORD_BOT_SERVER_URL}/api/reactions?channelId=${DISCORD_CHANNELS['landless']}&messageId=${discordMessageId}&emoji=${EMOJI_CODES[':green_circle:']}`
    ).then((r) => r.json());

    const { addresses } = response;
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
        // TODO: return error state of some sort
      }
    }

    console.log('selected as winner', recipientAddress);

    const gorblinCoinBuffer = await generateGorblinCoin(
      tokenId,
      tile.x,
      tile.y,
      signature,
      recipientAddress
    );

    if (gorblinCoinBuffer instanceof Error) {
      return res.status(400).json({ error: 'Error generating coin' });
    }

    console.log('generated gorblin coin', gorblinCoinBuffer);
    // const blob = Uint8Array.from(gorblinCoinBuffer).buffer;
    console.log(gorblinCoinBuffer.toString('base64'));
    return res.json({
      coinImage: gorblinCoinBuffer.toString('base64'),
      entrants: addresses,
      winner: recipientAddress
    });

    // get discord user id from bot server
    const discordMeta = await fetch(
      `${
        process.env.NEXT_PUBLIC_DISCORD_BOT_SERVER_URL
      }/api/lookup?address=${recipientAddress.toLowerCase()}`
    ).then((r) => r.json());

    console.log({ discordMeta });

    // @ts-ignore
    // const generated = new Blob(gorblinCoin.buffer, { type: 'image/png' });

    var formdata = new FormData();

    // @ts-ignore
    formdata.append('coin', gorblinCoin.toString('utf-8'), '[12,4].png');
    console.log(formdata);

    let postResponse = await fetch(process.env.XQST_BOT_TESTING!, {
      method: 'POST',
      body: formdata.toString(),
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log({ postResponse });

    // await sendMessage(
    //   'bot-testing',
    //   'gorblin',
    //   `<@${discordMeta.id}> -- here's your coin!`,
    //   [
    //     {
    //       title: '',
    //       type: 'rich',
    //       image: {
    //         // url: 'https://exquisite.land/api/tiles/terramasu/12/15/img'
    //       }
    //     }
    //   ]
    // );

    return res.json({});
  }
};

export default api;
