import { generateTokenID, getCoordinates } from '@app/features/TileUtils';
import { verifyMessage } from '@ethersproject/wallet';
import {
  checkTokenIdIsOwnedByLandGranter,
  generateCoin
} from '@server/LandGranter';
import prisma from 'lib/prisma';
import { NextApiHandler } from 'next';

const ADMIN_ADDRS = [
  '0xd286064cc27514b914bab0f2fad2e1a89a91f314',
  '0xf73fe15cfb88ea3c7f301f16ade3c02564aca407',
  '0x1a7be7db3a050624eb17b1a0e747fbaaf2b8a9ca',
  '0x0456fdb63a3cc7ec354435754e5cf30458105416',
  '0x292ff025168d2b51f0ef49f164d281c36761ba2b'
]; // cjpais.eth, shahruz.eth, kpaxle.eth, gorum.eth, jonbo.eth

export const GORBLIN_ADDR = '0x32649b5229Aa947fDea358bCc433Ad636B52F8C0';

const api: NextApiHandler = async (req, res) => {
  // const { tokenId, signature }: { tokenId?: string; signature?: string } =
  //   req.query;
  // if (!tokenId || isNaN(parseInt(tokenId)) || !signature)
  // return res.status(400).json('Missing tokenId or signature.');
  // if (!(await checkOwnerSignature(OWNER_SIGNATURE_MESSAGE, signature)))
  //   return res.status(403).json('Invalid signature.');

  let {
    tokenId,
    x,
    y,
    sig,
    claimer
  }: {
    tokenId?: string;
    x?: string;
    y?: string;
    claimer?: string;
    sig?: string;
  } = req.query;
  // if (!tokenId || (!x && !y) || isNaN(parseInt(tokenId)))
  //   return res.status(400).json({ error: 'Missing tokenId.' });

  if (tokenId == undefined && x != undefined && y != undefined)
    tokenId = `${generateTokenID(parseInt(x), parseInt(y))}`;

  if (tokenId != undefined && (x == undefined || y == undefined)) {
    const [xs, ys] = getCoordinates(parseInt(tokenId));
    x = xs.toString();
    y = ys.toString();
  }

  const isGrantable = await checkTokenIdIsOwnedByLandGranter(
    parseInt(tokenId!)
  );

  if (!isGrantable)
    return res
      .status(400)
      .json({ error: 'Coin not generatable for this tile.' });

  if (!sig)
    return res.status(400).json({ error: 'Must sign to generate coin.' });

  if (!claimer)
    return res.status(400).json({
      error: 'Must specify claimer (who is allowed to claim this coin).'
    });

  const address = verifyMessage(
    `I Generated Gorblin Coin for [${x},${y}]`,
    sig
  );

  if (!ADMIN_ADDRS.includes(address.toLowerCase()))
    return res.status(400).json({ error: "You're not an admin" });

  const { coin: coinImage, digest } = await generateCoin(
    parseInt(tokenId!),
    GORBLIN_ADDR,
    true,
    claimer
  );

  // TODO: remove upsert it's avoiding errors for dev
  console.log('upserting gorblin');
  await prisma.gorblinCoin.upsert({
    where: {
      digest: digest
    },
    update: {},
    create: {
      digest: digest,
      x: parseInt(x!),
      y: parseInt(y!),
      tokenID: parseInt(tokenId!),
      creator: GORBLIN_ADDR,
      claimer: claimer
    }
  });
  console.log('finsihed upserting gorblin');

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Content-Disposition', `inline; filename="[${x},${y}].png"`);
  return res.send(coinImage);
};

export default api;
