const { ethers } = require("hardhat");
const { deploy, smallNum, getETHBalance } = require("hardhat-libutils");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying Nft contract with wallet: ", deployer.address);

    let beforeBal = await getETHBalance(deployer.address);
    await deploy("Bridge23Nft", "Bridge23Nft");
    // let afterBal = await getETHBalance(deployer.address);

    // console.log(
    //     "used gas fee: ",
    //     smallNum(BigInt(beforeBal) - BigInt(afterBal))
    // );

    console.log(beforeBal);

    console.log("Deployed successfully!");
}

main()
    .then(() => {
        process.exit(1);
    })
    .catch((error) => {
        console.error(error);
    });
