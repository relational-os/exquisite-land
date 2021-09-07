import fs from 'fs-extra';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { Greeter__factory } from '../typechain';

async function start() {
  const args = require('minimist')(process.argv.slice(2));

  if (!args.chainId) {
    throw new Error('--chainId chain ID is required');
  }
  const chainId = args.chainId;

  const path = `${process.cwd()}/.env.${chainId}`;
  const env = require('dotenv').config({ path }).parsed;
  const provider = new JsonRpcProvider(env.RPC_ENDPOINT);
  const wallet = new Wallet(`0x${env.PRIVATE_KEY}`, provider);
  const addressesPath = `${process.cwd()}/addresses/${chainId}.json`;
  const addressBook = JSON.parse(
    await fs.readFileSync(addressesPath).toString()
  );

  if (addressBook.greeter)
    throw new Error(
      "This would overwrite the address book. Clear it first if you'd like to deploy new instances."
    );

  if (!addressBook.greeter) {
    console.log('Deploying Greeter...');
    const deployTxGreeter = await new Greeter__factory(wallet).deploy('Hello!');
    console.log('Deploy TX: ', deployTxGreeter.deployTransaction.hash);
    await deployTxGreeter.deployed();
    console.log('Greeter deployed at ', deployTxGreeter.address);
    addressBook.greeter = deployTxGreeter.address;
    await fs.writeFile(addressesPath, JSON.stringify(addressBook, null, 2));
  }

  console.log('Deployed!');
}

start().catch((e: Error) => {
  console.error(e);
  process.exit(1);
});
