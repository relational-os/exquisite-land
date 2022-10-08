module.exports = {
  database: { kind: "sqlite" },
  graphql: { port: 42069 },
  sources: [
    {
      kind: "evm",
      name: "ExquisiteLand",
      chainId: 137,
      rpcUrl: process.env.PONDER_RPC_URL_137,
      address: "0x921ec5EAADC92c134ca93b0A6558F3759e93ad3E",
      abi: "./abis/ExquisiteLand.json",
      startBlock: 21261454,
    },
  ],
};
