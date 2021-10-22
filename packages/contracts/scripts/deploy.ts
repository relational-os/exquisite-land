import fs from 'fs-extra';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import {
  ExquisiteLand__factory,
  TerraMasu__factory,
  LandGranter__factory,
  GenericRenderer__factory,
  TrustedForwarder__factory,
  Base64__factory
} from '../typechain';
import util from 'util';
import hre from 'hardhat';
import 'hardhat-change-network';

const exec = util.promisify(require('child_process').exec);

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
  const addressesPath = `${process.cwd()}/addresses/${chainId}${
    args.dev ? '-dev' : ''
  }.json`;
  const addressBook = JSON.parse(
    await fs.readFileSync(addressesPath).toString()
  );

  hre.changeNetwork('mumbai');

  if (!addressBook.base64) {
    console.log('Deploying base64...');
    const deployTx = await new Base64__factory(wallet).deploy();
    console.log('Deploy TX: ', deployTx.deployTransaction.hash);
    await deployTx.deployed();
    console.log('base64 deployed at ', deployTx.address);
    addressBook.base64 = deployTx.address;
    await fs.writeFile(addressesPath, JSON.stringify(addressBook, null, 2));

    console.log('Verifying contract...');
    await hre.run('verify:verify', {
      address: addressBook.base64,
      constructorArguments: []
    });
  }

  if (!addressBook.forwarder) {
    console.log('Deploying forwarder...');
    const deployTx = await new TrustedForwarder__factory(wallet).deploy();
    console.log('Deploy TX: ', deployTx.deployTransaction.hash);
    await deployTx.deployed();
    console.log('Forwarder deployed at ', deployTx.address);
    addressBook.forwarder = deployTx.address;
    await fs.writeFile(addressesPath, JSON.stringify(addressBook, null, 2));

    console.log('Verifying contract...');
    await deployTx.deployTransaction.wait(5);
    await hre.run('verify:verify', {
      address: addressBook.forwarder,
      constructorArguments: []
    });
  }

  if (!addressBook.renderer) {
    console.log('Deploying renderer...');
    const deployTx = await new GenericRenderer__factory(wallet).deploy();
    console.log('Deploy TX: ', deployTx.deployTransaction.hash);
    await deployTx.deployed();
    console.log('Contract deployed at ', deployTx.address);
    addressBook.renderer = deployTx.address;
    await fs.writeFile(addressesPath, JSON.stringify(addressBook, null, 2));

    console.log('Verifying contract...');
    await deployTx.deployTransaction.wait(5);
    await hre.run('verify:verify', {
      address: addressBook.renderer,
      constructorArguments: []
    });
  }

  if (!addressBook.contract) {
    console.log('Deploying terra masu...');
    const deployTx = await new TerraMasu__factory(wallet).deploy(
      addressBook.forwarder,
      addressBook.renderer,
      addressBook.base64
    );
    console.log('Deploy TX: ', deployTx.deployTransaction.hash);
    await deployTx.deployed();
    console.log('Contract deployed at ', deployTx.address);
    addressBook.contract = deployTx.address;
    await fs.writeFile(addressesPath, JSON.stringify(addressBook, null, 2));

    console.log('Verifying contract...');
    await deployTx.deployTransaction.wait(5);
    await hre.run('verify:verify', {
      address: addressBook.contract,
      constructorArguments: [
        addressBook.forwarder,
        addressBook.renderer,
        addressBook.base64
      ]
    });
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

    console.log('Verifying contract...');
    await deployTx.deployTransaction.wait(5);
    await hre.run('verify:verify', {
      address: addressBook.landGranter,
      constructorArguments: [addressBook.contract]
    });

    const contract = TerraMasu__factory.connect(addressBook.contract, wallet);
    console.log('Setting LandGranter address in ExquisiteLand...');
    await contract.setLandGranter(addressBook.landGranter);
    console.log('Done!');
  }

  console.log('Deployed!');
}

start().catch((e: Error) => {
  console.error(e);
  process.exit(1);
});
