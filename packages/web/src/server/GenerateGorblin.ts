import { ADMIN_ADDRESSES, GORBLIN_ADDR } from '@app/features/AddressBook';
import { verifyMessage } from '@ethersproject/wallet';
import {
  checkTokenIdIsOwnedByLandGranter,
  generateCoin
} from '@server/LandGranter';
import prisma from 'lib/prisma';

export const generateGorblinCoin = async (
  tokenId: string,
  x: number,
  y: number,
  sig: string,
  claimer: string
) => {
  // if (tokenId == undefined && x != undefined && y != undefined)
  //   tokenId = `${generateTokenID(parseInt(x), parseInt(y))}`;

  // if (tokenId != undefined && (x == undefined || y == undefined)) {
  //   const [xs, ys] = getCoordinates(parseInt(tokenId));
  //   x = xs.toString();
  //   y = ys.toString();
  // }

  const isGrantable = await checkTokenIdIsOwnedByLandGranter(
    parseInt(tokenId!)
  );

  if (!isGrantable) {
    return Error('Token is not grantable');
  }

  const address = verifyMessage('I am me.', sig);

  if (!ADMIN_ADDRESSES.includes(address.toLowerCase()))
    return Error('not an admin');

  const { coin: coinImage, digest } = await generateCoin(
    parseInt(tokenId!),
    GORBLIN_ADDR,
    true,
    claimer
  );

  // TODO: remove upsert it's avoiding errors for dev
  console.log('upserting gorblin', typeof x, typeof y);
  await prisma.gorblinCoin.upsert({
    where: {
      digest: digest
    },
    update: {},
    create: {
      digest: digest,
      x: parseInt(x.toString()),
      y: parseInt(y.toString()),
      tokenID: parseInt(tokenId!),
      creator: GORBLIN_ADDR,
      claimer: claimer
    }
  });
  console.log('finsihed upserting gorblin');

  return coinImage;
};
