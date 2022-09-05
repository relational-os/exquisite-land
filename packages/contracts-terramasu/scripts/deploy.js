const { ethers } = require('hardhat');

async function main() {
  // We get the contract to deploy
  const Slime = await ethers.getContractFactory('Slime');
  const slime = await Slime.deploy();
  await slime.deployed();

  // npx hardhat verify --network mumbai

  const SlimePool = await ethers.getContractFactory('SlimePools');
  const slimepool = await SlimePool.deploy(slime.address);
  await slimepool.deployed();

  // npx hardhat verify --network mumbai SLIME_ADDR --constructor-args scripts/arguments.js
  // make SlimePool an admin on Slime contract

  console.log('Slime deployed to:', slime.address);
  console.log('SlimePools deployed to:', slimepool.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
