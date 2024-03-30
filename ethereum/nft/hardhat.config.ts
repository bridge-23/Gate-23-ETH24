import dotenv from "dotenv";
dotenv.config();
import { parseEther } from "@ethersproject/units";

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    local: {
      url: "http://127.0.0.1:8545",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY!],
    },
    hardhat: {
      // forking: {
      //   url: process.env.POLYGON_NODE_URL!,
      // },
      accounts: [
        {
          privateKey: process.env.DEPLOYER_PRIVATE_KEY!,
          balance: parseEther("100").toString(),
        },
      ],
    },
    // polygon: {
    //   url: process.env.POLYGON_NODE_URL!,
    //   accounts: [process.env.DEPLOYER_PRIVATE_KEY!],
    // },
    sepolia: {
      url: process.env.SEPOLIA_NODE_URL!,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
