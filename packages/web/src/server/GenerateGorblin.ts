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
  console.log('upserting gorblin', typeof x, typeof y, digest);
  await prisma.gorblinCoin.upsert({
    where: {
      tokenID: parseInt(tokenId!)
    },
    update: {
      digest: digest,
      claimer: claimer
    },
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
