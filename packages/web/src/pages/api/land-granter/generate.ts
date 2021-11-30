import { generateTokenID, getCoordinates } from '@app/features/TileUtils';
import {
  checkTokenIdIsOwnedByLandGranter,
  generateCoin
} from '@server/LandGranter';
import prisma from 'lib/prisma';
import { NextApiHandler } from 'next';

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
    address,
    gorblin
  }: {
    tokenId?: string;
    x?: string;
    y?: string;
    address?: string;
    gorblin?: boolean;
  } = req.query;
  // if (!tokenId || (!x && !y) || isNaN(parseInt(tokenId)))
  //   return res.status(400).json({ error: 'Missing tokenId.' });

  if (address == undefined)
    return res
      .status(400)
      .json({ error: 'Must send address to generate coin!' });

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

  const { coin: coinImage, digest } = await generateCoin(
    parseInt(tokenId!),
    address,
    gorblin
  );

  // TODO: remove upsert it's avoiding errors for dev
  if (gorblin == undefined || (gorblin != undefined && gorblin == false)) {
    console.log('upserting regular');
    await prisma.generatedCoin.upsert({
      where: {
        digest: digest
      },
      update: {},
      create: {
        digest: digest,
        x: parseInt(x!),
        y: parseInt(y!),
        tokenID: parseInt(tokenId!),
        creator: address
      }
    });
    console.log('finsihed upserting regular');
  } else if (gorblin != undefined && gorblin == true) {
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
        creator: address
      }
    });
    console.log('finsihed upserting gorblin');
  }

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Content-Disposition', `inline; filename="[${x},${y}].png"`);
  return res.send(coinImage);
};

export default api;
