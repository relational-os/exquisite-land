import AddressBook from '@exquisiteland/contracts/addresses/137.json';
import AddressBookDev from '@exquisiteland/contracts/addresses/80001-dev.json';
import isProd from '@server/isProd';

export const OPENSEA_URL = isProd
  ? 'https://opensea.io/assets/matic/'
  : 'https://testnets.opensea.io/assets/mumbai/';

export const EXQUISITE_LAND_CONTRACT_ADDRESS = isProd
  ? AddressBook.contract
  : AddressBookDev.contract;

export const LAND_GRANTER_CONTRACT_ADDRESS = isProd
  ? AddressBook.landGranter
  : AddressBookDev.landGranter;

export const FORWARDER_CONTRACT_ADDRESS = isProd
  ? AddressBook.forwarder
  : AddressBookDev.forwarder;

export const GRAPH_URL = isProd
  ? 'https://api.thegraph.com/subgraphs/name/relational-os/exquisite-land'
  : 'https://api.thegraph.com/subgraphs/name/relational-os/exquisite-land-canary';

export const DISCORD_CHANNELS = {
  'terra-masu': '888518144346427392',
  'bot-testing': '910957967849967619',
  'admin-chat': '888520558969487391'
};

export const DISCORD_WEBHOOKS = {
  gorblin: {
    'admin-chat': process.env.GORBLIN_ADMIN_CHAT,
    'bot-testing': process.env.GORBLIN_BOT_TESTING,
    'terra-masu': process.env.GORBLIN_TERRA_MASU
  },
  xqst: {
    'admin-chat': process.env.XQST_ADMIN_CHAT,
    'bot-testing': process.env.XQST_BOT_TESTING,
    'terra-masu': process.env.XQST_TERRA_MASU
  }
};
