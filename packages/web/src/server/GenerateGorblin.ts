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

  console.log('inserting gorblin', typeof x, typeof y, digest);
  await prisma.gorblinCoin.create({
    data: {
      digest: digest,
      x: parseInt(x.toString()),
      y: parseInt(y.toString()),
      tokenID: parseInt(tokenId!),
      creator: GORBLIN_ADDR,
      claimer: claimer
    }
  });
  console.log('finsihed inserting gorblin coin');

  return coinImage;
};
