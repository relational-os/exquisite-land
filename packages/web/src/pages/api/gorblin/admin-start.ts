import {
  ADMIN_ADDRESSES,
  EMOJI_CODES,
  EXQUISITE_LAND_CONTRACT_ADDRESS
} from '@app/features/AddressBook';
import { getJsonRpcProvider } from '@app/features/getJsonRpcProvider';
import { verifyMessage } from '@ethersproject/wallet';
import { TerraMasu__factory } from '@sdk/factories/TerraMasu__factory';
import { sendMessage, sendReaction } from '@server/Discord';
import { getNextTile } from '@server/Gorblin';
import { Wallet } from 'ethers';
import { NextApiHandler } from 'next';

const api: NextApiHandler = async (req, res) => {
  const tile = await getNextTile();
  if (!tile) return res.json({ error: 'No eligible tiles.' });

  if (req.method == 'GET') {
    return res.json({ nextTile: tile });
  }

  if (req.method == 'POST') {
    // Authenticate
    const signature = req.body.signature as string;
    const account = req.body.account.toLowerCase() as string;

    const signingAccount = verifyMessage('I am me.', signature);

    if (account.toLowerCase() != signingAccount.toLowerCase())
      return res.status(400).json({ error: 'Invalid signature' });

    console.log('account', account);
    if (!ADMIN_ADDRESSES.includes(account)) {
      return res.status(400).json({ error: 'not authorized' });
    }

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

    // TODO: check tx status here for success?

    await sendMessage(
      'bot-testing',
      'gorblin',
      `i've claimed [${tile.x}, ${tile.y}]! place your mark 🟢 and your ass i may coin`
    );

    // TODO: pre-react to this message?
    // await sendReaction('bot-testing');

    return res.json({ success: true });
  }
};

export default api;
