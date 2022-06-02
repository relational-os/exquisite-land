const { ethers } = require("hardhat");

async function main() {
    // We get the contract to deploy
    const Slime = await ethers.getContractFactory("Slime");
    const slime = await Slime.deploy();
    await slime.deployed();
  
    const SlimePool = await ethers.getContractFactory("SlimePools");
    const slimepool = await SlimePool.deploy(slime.address);
    await slimepool.deployed();
  
    console.log("Slime deployed to:", slime.address);
    console.log("SlimePools deployed to:", slimepool.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  