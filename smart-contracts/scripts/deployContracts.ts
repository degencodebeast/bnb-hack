import { BigNumber, Wallet, getDefaultProvider, utils } from "ethers";
require('dotenv').config()
import { ethers, run, network } from "hardhat";
import { NutritionistNFT__factory, UserNFT__factory, Treasury__factory, CommunityNetwork__factory } from "../typechain-types";

//const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
//const wallet = new ethers.Wallet(PRIVATE_KEY, ethers.provider);
//const encoder  =  new utils.AbiCoder()
const encoder = ethers.utils.defaultAbiCoder;
const treasuryAddr = "0xA1BEc8CfFe3bED25124384867C9369836190593e"
const communityAddr = "0x763055Ca49aDB6b41Da2522Ab7E2C714601FaD88"
const userNftAddr = "0xCCcE35FF7d1F1501Dc086ef232bC5d46cE5953C6"
const nutritionistNFTAddr = "0x1aC0a3a87A83a7605606A5f629717Ded061B1DDA"


const registryAddr = "0x96bb60aAAec09A0FceB4527b81bbF3Cc0c171393"
const registrarAddr = "0x0631ea498c2Cd8371B020b9eC03f5F779174562B"
const linkTokenAddr = "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06"
const privateKey = process.env.PRIVATE_KEY as string;
const wallet = new Wallet(privateKey);

const bnbRpc = "https://97.rpc.thirdweb.com"

async function main() {
    //await deployCommunityContracts();

    //await setupNFTs(userNftAddr, nutritionistNFTAddr, communityAddr);
    //await joinCommunity("0x3A3bc7C19bE0381294d8E7Bd311C123b76b33982");


    await verifyContract()
    const chainID = network.config.chainId;
    if (chainID != 31337) {
        await verifyContract()
    }

    //await joinCommunity(communityContract);
}

async function deployTreasury() {
    //console.log("Deploying Treasury....");

    //const provider = getDefaultProvider(rpc)
    //const connectedWallet = wallet.connect(provider);
    //const TreasuryFactory = new Treasury__factory(connectedWallet);

    const TreasuryFactory = await ethers.getContractFactory("Treasury");
    const treasury = await TreasuryFactory.deploy();
    await treasury.deployed();
    console.log("---- Treasury Contract was deployed to: ---- ", treasury.address);
    return treasury.address;
}

async function deployUserNFT(_communityAddr: any) {
    //console.log("Deploying UserNFT....");
    const UserNFTFactory = await ethers.getContractFactory("UserNFT");
    const userNFT = await UserNFTFactory.deploy("User NFT", "UST", _communityAddr, { gasLimit: 8000000 });
    await userNFT.deployed();
    console.log("---- UserNFT Contract was deployed to: ---- ", userNFT.address);
    return userNFT.address;
}

async function deployNutritionistNFT(_communityAddr: any) {
    //console.log("Deploying NutrionistNFT....");
    const NutritionistNFTFactory = await ethers.getContractFactory("NutritionistNFT");
    const nutritionistNFT = await NutritionistNFTFactory.deploy("Nutritionist NFT", "NUT", _communityAddr, { gasLimit: 8000000 });
    await nutritionistNFT.deployed();
    console.log("---- NutritionistNFT Contract was deployed to: ---- ", nutritionistNFT.address);
    return nutritionistNFT.address;
}

async function joinCommunity(_communityAddr: any) {

    const provider = getDefaultProvider(bnbRpc);
    const connectedWallet = wallet.connect(provider);

    const communityFactory = new CommunityNetwork__factory(connectedWallet);
    const community = communityFactory.attach(_communityAddr);

    console.log("joining community network...")
    const amount = ethers.utils.parseEther("0.01");
    //const tx = await community.registerUser("hello", "nft", {gasLimit: 6000000, value: amount})
    const tx = await community.nutritionistNFT()
    //await tx.wait();
    console.log(tx)
    console.log("community network successfully joined")
}

async function setupNFTs(userNFTAddr: any, nutritionistNFTAddr: any, communityAddr: any) {
    
    const provider = getDefaultProvider(bnbRpc);
    const connectedWallet = wallet.connect(provider);

    const communityFactory = new CommunityNetwork__factory(connectedWallet);
    const community = communityFactory.attach(communityAddr);

    try {
        console.log("Setting up NFTs for Bnb")
        const tx = await community.setNFTs(userNFTAddr, nutritionistNFTAddr);
        await tx.wait();
        console.log("NFTs setup successful")
    }

    catch (error) {
        console.log(`[source] community.setNFTs ERROR!`);
        console.log(`[source]`, error);

    }
}


async function deployCommunityContracts() {
    console.log("Deploying Contracts for Bnb....");
    let treasuryAddr;
    let communityAddr;
    try {
        console.log("Deploying treasury for Bnb");
        treasuryAddr = await deployTreasury();

        const CommunityFactory = await ethers.getContractFactory("CommunityNetwork"/*, wallet*/);

        console.log("Deploying Community contract for Bnb");
        const community = await CommunityFactory.deploy(treasuryAddr, linkTokenAddr, registrarAddr, registryAddr);
        await community.deployed();
        communityAddr = community.address;
        console.log("---- Community Contract for Bnb was deployed to Bnb testnet at this address: ---- ", community.address);
    }
    catch (error) {
        console.error("Error deploying Community for Bnb:", error);
        throw error;
    }

    console.log("Deploying UserNFT for Bnb....");
    let userNFT;
    try {
        userNFT = await deployUserNFT(communityAddr);
    }
    catch (error) {
        console.error("Error User NFT for Bnb:", error);
        throw error;
    }

    console.log("Deploying NutritionistNFT for Bnb....");
    let nutritionistNFT;
    try {
        nutritionistNFT = await deployNutritionistNFT(communityAddr);
    }
    catch (error) {
        console.error("Error Nutritionist NFT for Bnb:", error);
        throw error;
    }
}

async function verifyContract() {

    console.log(`Verifying user NFT contract for Bnb...`);

    try {
        await run("verify:verify", {
            address: userNftAddr,
            constructorArguments: ["User NFT", "UST", communityAddr],
        });
        //console.log(`contract for ${chain.name} verified`);
    } catch (e: any) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!");
        } else {
            console.log(e);
        }
    }
}


main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
