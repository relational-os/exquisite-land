import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import 'hardhat-gas-reporter';
import 'hardhat-change-network';

require('dotenv').config({ path: '.env.80001' });
const RPC_ENDPOINT = process.env.RPC_ENDPOINT;
const TESTNET_PRIVATE_KEY = process.env.PRIVATE_KEY;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  solidity: '0.8.9',
  networks: {
    mumbai: {
      chainId: 80001,
      url: RPC_ENDPOINT,
      accounts: [`${TESTNET_PRIVATE_KEY}`]
    },
    // matic: {
    //   chainId: 137,
    //   url: require('dotenv').config({ path: '.env.137' }).parsed.RPC_ENDPOINT
    // },
    localhost: {
      url: "http://127.0.0.1:7545"
    }
  },
  etherscan: {
    apiKey: 'KZ9KA8WH63FHJYFVYCWN7DH7KGBKF3NQ6I'
  }
};
