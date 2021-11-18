import isProd from '@server/helpers/isProd';
import AddressBook from '@exquisiteland/contracts/addresses/137.json';
import AddressBookDev from '@exquisiteland/contracts/addresses/80001-dev.json';

export const GRAPH_URL = isProd
  ? 'https://api.thegraph.com/subgraphs/name/relational-os/exquisite-land'
  : 'https://api.thegraph.com/subgraphs/name/relational-os/exquisite-land-canary';

export const EXQUISITE_LAND_CONTRACT_ADDRESS = isProd
  ? AddressBook.contract
  : AddressBookDev.contract;

export const LAND_GRANTER_CONTRACT_ADDRESS = isProd
  ? AddressBook.landGranter
  : AddressBookDev.landGranter;
