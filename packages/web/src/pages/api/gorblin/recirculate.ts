import {
  ADMIN_ADDRESSES,
  // EMOJI_CODES,
  EXQUISITE_LAND_CONTRACT_ADDRESS
} from '@app/features/AddressBook';
import { getJsonRpcProvider } from '@app/features/getJsonRpcProvider';
import { getTile } from '@app/features/useTile';
import { verifyMessage } from '@ethersproject/wallet';
import prisma from 'lib/prisma';
import { TerraMasu__factory } from '@sdk/factories/TerraMasu__factory';
import { Wallet } from 'ethers';
import { NextApiHandler } from 'next';

const api: NextApiHandler = async (req, res) => {
  if (req.method == 'POST') {
    // Authenticate
    const signature = req.body.signature as string;
    const account = req.body.account.toLowerCase() as string;
    const tokenId = req.body.tokenId as string;

    const signingAccount = verifyMessage('I am me.', signature);

    if (account.toLowerCase() != signingAccount.toLowerCase())
      return res.status(400).json({ error: 'Invalid signature' });

    console.log('account', account);
    if (!ADMIN_ADDRESSES.includes(account)) {
      return res.status(400).json({ error: 'not authorized' });
    }

    const tile = await getTile(parseInt(tokenId));
    if (!tile) return res.json({ error: 'no tile' });

    // verify tile is blank
    if (tile.svg != null) {
      return res.json({ error: 'Tile is not blank' });
    }

    console.log(EXQUISITE_LAND_CONTRACT_ADDRESS);
    const wallet = new Wallet(
      process.env.CONTRACT_OWNER_PRIVATE_KEY as string,
      getJsonRpcProvider
    );
    const contract = TerraMasu__factory.connect(
      EXQUISITE_LAND_CONTRACT_ADDRESS,
      wallet
    );
    const tx = await contract.recirculateTile(tile.x, tile.y);
    console.log({ tx });
    const receipt = await tx.wait(2);
    console.log({ receipt });

    await prisma.gorblinGiveaway.update({
      where: { tokenId: parseInt(tokenId) },
      data: { recirculated: true }
    });

    // TODO: check tx status here for success

    return res.json({ success: true, receipt: receipt, tx: tx });
  }
};

export default api;
