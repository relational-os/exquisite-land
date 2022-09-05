#!/bin/bash
source .env.local

forge script -vvv script/DeployCanvas2.s.sol:DeployCanvas2 --ffi --chain-id $CHAIN_ID --rpc-url $RPC_URL \
  --private-key $DEPLOYER_PRIVATE_KEY --broadcast --verify --etherscan-api-key $ETHERSCAN_API_KEY
