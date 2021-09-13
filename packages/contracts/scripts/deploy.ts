import fs from 'fs-extra';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { Tile__factory, LandGranter__factory } from '../typechain';

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

  if (!addressBook.contract) {
    console.log('Deploying contract...');
    const deployTx = await new Tile__factory(wallet).deploy();
    console.log('Deploy TX: ', deployTx.deployTransaction.hash);
    await deployTx.deployed();
    console.log('Contract deployed at ', deployTx.address);
    addressBook.contract = deployTx.address;
    await fs.writeFile(addressesPath, JSON.stringify(addressBook, null, 2));
  }

  if (!addressBook.landGranter) {
    console.log('Deploying Land Granter contract...');
    const deployTx = await new LandGranter__factory(wallet).deploy(
      addressBook.contract
    );
    console.log('Land Granter Deploy TX: ', deployTx.deployTransaction.hash);
    await deployTx.deployed();
    console.log('Land Granter Contract deployed at ', deployTx.address);
    addressBook.landGranter = deployTx.address;
    await fs.writeFile(addressesPath, JSON.stringify(addressBook, null, 2));
  }

  console.log('Deployed!');
}

start().catch((e: Error) => {
  console.error(e);
  process.exit(1);
});
