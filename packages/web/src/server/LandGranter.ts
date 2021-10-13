import { ContractTransaction } from '@ethersproject/contracts';
import { LandGranter__factory } from '@sdk/factories/LandGranter__factory';
import { ExquisiteLand__factory } from '@sdk/factories/ExquisiteLand__factory';
import sharp from 'sharp';

let basePath = process.cwd();
if (process.env.NODE_ENV === 'production') {
  basePath = path.join(process.cwd(), '.next/server/chunks');
}
path.resolve(basePath, 'fonts', 'fonts.conf');
path.resolve(basePath, 'fonts', 'VT323-Regular.ttf');

// @ts-ignore
import steggy from 'steggy';
import getJsonRpcProvider from '@app/features/getJsonRpcProvider';
import { Wallet } from '@ethersproject/wallet';
import path from 'path';
import { getCoordinates } from '@app/features/TileUtils';
import {
  EXQUISITE_LAND_CONTRACT_ADDRESS,
  LAND_GRANTER_CONTRACT_ADDRESS
} from '@app/features/AddressBook';

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
      EXQUISITE_LAND_CONTRACT_ADDRESS,
      getJsonRpcProvider()
    );
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
  recipient: string
): Promise<ContractTransaction> => {
  const wallet = new Wallet(
    process.env.CONTRACT_OWNER_PRIVATE_KEY as string,
    getJsonRpcProvider()
  );
  const contract = LandGranter__factory.connect(
    LAND_GRANTER_CONTRACT_ADDRESS,
    wallet
  );
  return contract.grant(tokenId, recipient);
};

// Should only be called by admin
export const generateCoin = async (tokenId: number): Promise<Buffer> => {
  const [x, y] = getCoordinates(tokenId);
  const baseCoinBuffer = Buffer.from(baseCoinBase64String, 'base64');
  const coinBuffer = await sharp(baseCoinBuffer)
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

const baseCoinBase64String =
  'iVBORw0KGgoAAAANSUhEUgAAAyAAAAMgCAYAAADbcAZoAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFG2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjUgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTEwLTAyVDEyOjUyOjEyLTA1OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0xMC0wMlQxMzoxODo0MS0wNTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0xMC0wMlQxMzoxODo0MS0wNTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2ODExOWJlMS03NmJh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';
