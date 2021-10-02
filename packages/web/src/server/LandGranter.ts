import { ContractTransaction } from '@ethersproject/contracts';
import { LandGranter__factory } from '@sdk/factories/LandGranter__factory';
import { ExquisiteLand__factory } from '@sdk/factories/ExquisiteLand__factory';
import sharp from 'sharp';

path.resolve(process.cwd(), 'fonts', 'fonts.conf');
path.resolve(process.cwd(), 'fonts', 'VT323-Regular.ttf');

// @ts-ignore
import steggy from 'steggy';
import getJsonRpcProvider from '@app/features/getJsonRpcProvider';
import { Wallet } from '@ethersproject/wallet';
import path from 'path';
import { getCoordinates } from '@app/features/TileUtils';

export const getTokenIDForCoin = (coinB64: string): number | null => {
  try {
    const revealed = steggy.reveal(process.env.LAND_GRANTER_SALT)(
      Buffer.from(coinB64, 'base64')
    );
    return parseInt(revealed.toString());
  } catch (err) {
    return null;
  }
};

export const checkTokenIdIsOwnedByLandGranter = async (
  tokenId: number
): Promise<boolean> => {
  try {
    const contract = ExquisiteLand__factory.connect(
      process.env.NEXT_PUBLIC_TILE_CONTRACT_ADDRESS as string,
      getJsonRpcProvider()
    );
    const ownerAddress = await contract.ownerOf(tokenId);
    console.log({ ownerAddress });
    return (
      ownerAddress.toLowerCase() ===
      (
        process.env.NEXT_PUBLIC_LAND_GRANTER_CONTRACT_ADDRESS as string
      ).toLowerCase()
    );
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const grantLandTile = (
  tokenId: number,
  recipient: string
): Promise<ContractTransaction> => {
  const wallet = new Wallet(
    process.env.CONTRACT_OWNER_PRIVATE_KEY as string,
    getJsonRpcProvider()
  );
  const contract = LandGranter__factory.connect(
    process.env.NEXT_PUBLIC_LAND_GRANTER_CONTRACT_ADDRESS as string,
    wallet
  );
  return contract.grant(tokenId, recipient);
};

// Should only be called by admin
export const generateCoin = async (tokenId: number): Promise<Buffer> => {
  const [x, y] = getCoordinates(tokenId);
  const coinBuffer = await sharp(
    path.join(process.cwd(), 'src/assets/xqst-coin-blank.png')
  )
    .composite([
      {
        input: Buffer.from(
          `<svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg"><style type="text/css">@font-face { font-family: VT323; src: './VT323-Regular.ttf'; }</style><text fill="#E68D3E" xml:space="preserve" style="white-space: pre" font-family="VT323" font-size="72" letter-spacing="0em" x="50%" y="64%" dominant-baseline="middle" text-anchor="middle">[${x},${y}]</text></svg>`
        )
      }
    ])
    .png()
    .toBuffer();
  const concealed: Buffer = steggy.conceal(process.env.LAND_GRANTER_SALT)(
    coinBuffer,
    `${tokenId}`
  );
  return concealed;
};
