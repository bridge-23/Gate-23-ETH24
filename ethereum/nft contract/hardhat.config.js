/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("hardhat-abi-exporter");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-contract-sizer");
require("solidity-coverage");
require("@grpc/grpc-js");
require("@grpc/proto-loader");
require("dotenv").config();
// require("hardhat-gas-reporter");
const { utils } = require("ethers");

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {},
        base_main: {
            url: "https://base-mainnet.g.alchemy.com/v2/nyqGnXFaRJa29X6Y7sUSgzIv7i-hZlll",
            chainId: 8453,
            accounts: [process.env.DEPLOY_WALLET],
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.17",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 125,
                    },
                },
            },
            {
                version: "0.8.0",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 125,
                    },
                },
            },
        ],
    },
    // etherscan: {
    //     apiKey: {
    //         arbitrumOne: process.env.ARBITRUM_API_KEY,
    //         arbitrumSepolia: process.env.ARBITRUM_API_KEY,
    //         // base: process.env.BASE_API_KEY,
    //     },
    //     customChains: [
    //         {
    //             network: "base",
    //             chainId: 8453,
    //             urls: {
    //                 apiURL: "https://api.basescan.org/api",
    //                 browserURL: "https://basescan.org/",
    //             },
    //         },
    //     ],
    // },
    mocha: {
        timeout: 200000,
    },
};
