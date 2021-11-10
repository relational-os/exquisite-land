import { ContractTransaction } from '@ethersproject/contracts';
import { LandGranter__factory } from '@sdk/factories/LandGranter__factory';
import sharp from 'sharp';
import crypto from 'crypto';

let basePath = process.cwd();
if (process.env.NODE_ENV === 'production') {
  basePath = path.join(process.cwd(), '.next/server/chunks');
}
path.resolve(basePath, 'fonts', 'fonts.conf');
path.resolve(basePath, 'fonts', 'VT323-Regular.ttf');

// @ts-ignore
import steggy from 'steggy';
import { Wallet } from '@ethersproject/wallet';
import path from 'path';
import { LAND_GRANTER_CONTRACT_ADDRESS } from '@app/features/AddressBook';
import { getCoordinates } from '@app/features/TileUtils';
import { parse, stringify } from 'svgson';
import PALETTES from '@constants/Palettes';
import prisma from 'lib/prisma';
import getContract from '@app/features/getContract';
import { getJsonRpcProvider } from '@app/features/getJsonRpcProvider';

const colorLUT = new Map<
  string,
  { hexIndex: string; red: number; green: number; blue: number }
>();
PALETTES[0].map((color, index) =>
  colorLUT.set(color, {
    hexIndex: index.toString(16),
    red: parseInt(color.substr(1, 2), 16),
    green: parseInt(color.substr(3, 2), 16),
    blue: parseInt(color.substr(5, 2), 16)
  })
);

const findClosestColor = (red: number, green: number, blue: number) => {
  let min = 1000000000;
  let val = '';

  // minimize difference
  colorLUT.forEach((v, k) => {
    const distance = Math.sqrt(
      Math.pow(v.red - red, 2) +
        Math.pow(v.green - green, 2) +
        Math.pow(v.blue - blue, 2)
    );

    if (distance < min) {
      min = distance;
      val = v.hexIndex;
    }
  });

  return val;
};

export const decodePencil = async (data: string): Promise<string> => {
  const coinBuffer = await sharp(Buffer.from(data, 'base64')).resize(800, 800);

  let decoded = Array(23).fill('');

  await Promise.all(
    await pixels.map(async (pixel, index) => {
      const croppedBuffer = await coinBuffer
        .clone()
        .extract({ left: pixel.left, top: pixel.top, width: 28, height: 28 })
        .png()
        .toBuffer();

      const pixelStats = await sharp(croppedBuffer).stats();

      const red = Math.round(pixelStats.channels[0].mean);
      const green = Math.round(pixelStats.channels[1].mean);
      const blue = Math.round(pixelStats.channels[2].mean);

      decoded[index] = findClosestColor(red, green, blue);
    })
  );

  let decodedString = '';
  decoded.map((v) => (decodedString += v));

  return decodedString;
};

export const getTokenIDForCoin = async (
  coinB64: string
): Promise<{
  tokenId: number | undefined;
  coinCreator: string | undefined;
}> => {
  // TODO: lookup x_y from db, for now this is done in memory
  const decoded = await decodePencil(coinB64);

  const result = await prisma.generatedCoin.findFirst({
    where: {
      digest: decoded
    }
  });

  return { tokenId: result?.tokenID, coinCreator: result?.creator };
};

export const checkTokenIdIsOwnedByLandGranter = async (
  tokenId: number
): Promise<boolean> => {
  try {
    const contract = getContract(getJsonRpcProvider);
    const ownerAddress = await contract.ownerOf(tokenId);

    return (
      ownerAddress.toLowerCase() === LAND_GRANTER_CONTRACT_ADDRESS.toLowerCase()
    );
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const grantLandTile = (
  tokenId: number,
  recipient: string,
  coinCreator: string
): Promise<ContractTransaction> => {
  const wallet = new Wallet(
    process.env.CONTRACT_OWNER_PRIVATE_KEY as string,
    getJsonRpcProvider
  );
  const contract = LandGranter__factory.connect(
    LAND_GRANTER_CONTRACT_ADDRESS,
    wallet
  );
  return contract.grant(tokenId, recipient, coinCreator);
};

export const encodePencil = async (x: number, y: number, addr: string) => {
  const parsedPencilSVG = await parse(pencilSVG);
  console.log(parsedPencilSVG.children.length);

  const data = crypto
    .createHash('sha256')
    .update(`${process.env.LAND_GRANTER_SALT}${x}${y}${addr.slice(2)}`)
    .digest('hex')
    .slice(0, 23);

  parsedPencilSVG.children.map((rect: any, index: number) => {
    const colorIndex = parseInt(data[index], 16);
    rect.attributes.fill = PALETTES[0][colorIndex];
  });

  return { svg: stringify(parsedPencilSVG), digest: data };
};

// Should only be called by admin
export const generateCoin = async (
  tokenId: number,
  address: string
): Promise<{ coin: Buffer; digest: string }> => {
  const [x, y] = getCoordinates(tokenId);
  const baseCoinBuffer = Buffer.from(baseCoinB64String, 'base64');
  const { svg: encodedPencil, digest } = await encodePencil(x, y, address);
  const coinBuffer = await sharp(baseCoinBuffer)
    .composite([
      {
        input: Buffer.from(encodedPencil),
        top: 213,
        left: 298
      },
      {
        input: Buffer.from(
          `<svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg"><style type="text/css">@font-face { font-family: VT323; src: './VT323-Regular.ttf'; }</style><text fill="#E68D3E" xml:space="preserve" style="white-space: pre" font-family="VT323" font-size="72" letter-spacing="0em" x="50%" y="64%" dominant-baseline="middle" text-anchor="middle">[${x},${y}]</text></svg>`
        )
      }
    ])
    .png()
    .toBuffer();

  return { coin: coinBuffer, digest };
};

const pencilSVG =
  '<svg width="200" height="200" viewBox="0 0 7 7" xmlns="http://www.w3.org/2000/svg"><rect fill="#f00" width="1.01" height="1.01" x="4" y="0"/><rect fill="#f00" width="1.01" height="1.01" x="3" y="1"/><rect fill="#f00" width="1.01" height="1.01" x="4" y="1"/><rect fill="#f00" width="1.01" height="1.01" x="5" y="1"/><rect fill="#f00" width="1.01" height="1.01" x="2" y="2"/><rect fill="#f00" width="1.01" height="1.01" x="3" y="2"/><rect fill="#f00" width="1.01" height="1.01" x="4" y="2"/><rect fill="#f00" width="1.01" height="1.01" x="5" y="2"/><rect fill="#f00" width="1.01" height="1.01" x="6" y="2"/><rect fill="#f00" width="1.01" height="1.01" x="1" y="3"/><rect fill="#f00" width="1.01" height="1.01" x="2" y="3"/><rect fill="#f00" width="1.01" height="1.01" x="3" y="3"/><rect fill="#f00" width="1.01" height="1.01" x="4" y="3"/><rect fill="#f00" width="1.01" height="1.01" x="5" y="3"/><rect fill="#f00" width="1.01" height="1.01" x="0" y="4"/><rect fill="#f00" width="1.01" height="1.01" x="2" y="4"/><rect fill="#f00" width="1.01" height="1.01" x="3" y="4"/><rect fill="#f00" width="1.01" height="1.01" x="4" y="4"/><rect fill="#f00" width="1.01" height="1.01" x="0" y="5"/><rect fill="#f00" width="1.01" height="1.01" x="3" y="5"/><rect fill="#f00" width="1.01" height="1.01" x="0" y="6"/><rect fill="#f00" width="1.01" height="1.01" x="1" y="6"/><rect fill="#f00" width="1.01" height="1.01" x="2" y="6"/></svg>';
const baseCoinB64String =
  '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';

const pixels = [
  { top: 213, bottom: 241, left: 413, right: 441 }, // x=4, y=0, index=0

  { top: 242, bottom: 270, left: 384, right: 412 }, // x=3, y=1, index=1
  { top: 242, bottom: 270, left: 413, right: 440 }, // x=4, y=1, index=2
  { top: 242, bottom: 270, left: 441, right: 469 }, // x=5, y=1, index=3

  { top: 271, bottom: 298, left: 356, right: 383 }, // x=2, y=2, index=4
  { top: 271, bottom: 298, left: 384, right: 412 }, // x=3, y=2, index=5
  { top: 271, bottom: 298, left: 413, right: 440 }, // x=4, y=2, index=6
  { top: 271, bottom: 298, left: 441, right: 469 }, // x=5, y=2, index=7
  { top: 271, bottom: 298, left: 470, right: 498 }, // x=6, y=2, index=8

  { top: 299, bottom: 327, left: 327, right: 355 }, // x=1, y=3, index=9
  { top: 299, bottom: 327, left: 356, right: 383 }, // x=2, y=3, index=10
  { top: 299, bottom: 327, left: 384, right: 412 }, // x=3, y=3, index=11
  { top: 299, bottom: 327, left: 413, right: 440 }, // x=4, y=3, index=12
  { top: 299, bottom: 327, left: 441, right: 469 }, // x=5, y=3, index=13

  { top: 328, bottom: 355, left: 298, right: 326 }, // x=0, y=4, index=14
  { top: 328, bottom: 355, left: 356, right: 383 }, // x=2, y=4, index=15
  { top: 328, bottom: 355, left: 384, right: 412 }, // x=3, y=4, index=16
  { top: 328, bottom: 355, left: 413, right: 440 }, // x=4, y=4, index=17

  { top: 356, bottom: 384, left: 298, right: 326 }, // x=0, y=5, index=18
  { top: 356, bottom: 384, left: 384, right: 412 }, // x=3, y=5, index=19

  { top: 385, bottom: 413, left: 298, right: 326 }, // x=0, y=6, index=20
  { top: 385, bottom: 413, left: 327, right: 355 }, // x=1, y=6, index=21
  { top: 385, bottom: 413, left: 356, right: 383 } // x=2, y=6, index=22
];
