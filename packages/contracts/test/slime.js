const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SlimePool", function () {
  it("Should pool slime", async function () {
    const Slime = await ethers.getContractFactory("Slime");
    const SlimePool = await ethers.getContractFactory("SlimePools");

    const slime = await Slime.deploy();
    await slime.deployed();

    const slimepool = await SlimePool.deploy(slime.address);
    await slimepool.deployed();

    const accounts = await hre.ethers.getSigners();

    expect(await slime.balanceOf(accounts[0].address)).to.equal(0);

    await slime.setAdmin(accounts[0].address, true);
    await slime.setAdmin(slimepool.address, true);
    await slime.mint(accounts[0].address, 100);

    expect(await slime.balanceOf(accounts[0].address)).to.equal(100);

    await slimepool.poolSlime(1, 50);
    expect(await slime.balanceOf(accounts[0].address)).to.equal(50);
  });
});
