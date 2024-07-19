const { ethers } = require("hardhat");
const { expect } = require("chai");
const { deploy } = require("hardhat-libutils");

describe("End to End test", function () {
    before(async function () {
        [this.deployer, this.trader, this.trader_1] = await ethers.getSigners();
        this.Nft = await deploy("Bridge23Nft", "Bridge23Nft");
    });

    it("aa", async function () {
        console.log("a");
        let metaUri =
            "https://tkuag-tqaaa-aaaak-akvgq-cai.raw.icp0.io/receipt/7XzafnB6qQe1HZ9TiTGWs";

        await this.Nft.mint(this.trader.address, 10, metaUri);

        console.log(await this.Nft.balanceOf(this.trader.address, 1));
        console.log(await this.Nft.uri(1));

        console.log(await this.Nft.getHoldTokenIds(this.trader.address));

        await this.Nft.mint(this.trader.address, 5, metaUri);

        console.log(await this.Nft.getHoldTokenIds(this.trader.address));

        await this.Nft.connect(this.trader).transferBatchFrom(
            this.trader.address,
            this.trader_1.address,
            [1, 2],
            [5, 3]
        );

        console.log(
            "trader: ",
            await this.Nft.getHoldTokenIds(this.trader.address)
        );
        console.log(
            "trader_1: ",
            await this.Nft.getHoldTokenIds(this.trader_1.address)
        );
        console.log(
            await this.Nft.balanceOfBatch(
                [this.trader_1.address, this.trader_1.address],
                [1, 2]
            )
        );

        // await this.Nft.connect(this.trader).transferFrom(
        //     this.trader.address,
        //     this.trader_1.address,
        //     2,
        //     2
        // );

        // console.log(
        //     "trader: ",
        //     await this.Nft.getHoldTokenIds(this.trader.address)
        // );
        // console.log(
        //     "trader_1: ",
        //     await this.Nft.getHoldTokenIds(this.trader_1.address)
        // );

        // console.log(await this.Nft.balanceOf(this.trader_1.address, 2));
    });
});
