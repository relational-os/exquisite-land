import { EXQUISITE_LAND_CONTRACT_ADDRESS } from '@app/features/AddressBook';
import { getJsonRpcProvider } from '@app/features/getJsonRpcProvider';
import { TerraMasu__factory } from '@sdk/factories/TerraMasu__factory';
import { getNextTile } from '@server/Gorblin';
import { Wallet } from 'ethers';
import { NextApiHandler } from 'next';

const api: NextApiHandler = async (req, res) => {
  const tile = await getNextTile();
  if (!tile) return res.json({ error: 'No eligible tiles.' });

  // TODO: Verify signature

  const wallet = new Wallet(
    process.env.CONTRACT_OWNER_PRIVATE_KEY as string,
    getJsonRpcProvider
  );
  const contract = TerraMasu__factory.connect(
    EXQUISITE_LAND_CONTRACT_ADDRESS,
    wallet
  );
  const tx = await contract.recirculateTile(tile.x, tile.y);
  await tx.wait(2);

  // TODO: Add this tile to GorblinCoin table.
  // TODO: Post request to Discord-side API.

  return res.json({});
};

export default api;
