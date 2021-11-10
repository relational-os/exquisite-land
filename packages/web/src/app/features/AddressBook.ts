// import AddressBook from '@exquisiteland/contracts/addresses/137.json';
import AddressBook from '@exquisiteland/contracts/addresses/80001.json';
import AddressBookDev from '@exquisiteland/contracts/addresses/80001-dev.json';
import isProd from '@server/isProd';

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
