import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";

describe("NFT Contract", function () {
    let NFT: any;
    let nft: any;
    let admin: Signer;
    let user: Signer;

    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        NFT = await ethers.getContractFactory("NFT");
        [admin, user] = await ethers.getSigners();

        // Deploy the contract
        nft = await NFT.deploy();
        await nft.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the right admin", async function () {
            expect(await nft.admin()).to.equal(await admin.getAddress());
        });

        it("Should have the correct name and symbol", async function () {
            expect(await nft.name()).to.equal("My NFT");
            expect(await nft.symbol()).to.equal("NFT");
        });
    });

    describe("Minting", function () {
        it("Should mint an NFT to the specified address", async function () {
            await nft.mint(await user.getAddress());
            expect(await nft.ownerOf(0)).to.equal(await user.getAddress());
        });

        it("Should increment the token ID after minting", async function () {
            await nft.mint(await user.getAddress());
            await nft.mint(await user.getAddress());
            expect(await nft.ownerOf(1)).to.equal(await user.getAddress());
        });

        it("Should revert if a non-admin tries to mint", async function () {
            await expect(nft.connect(user).mint(await user.getAddress())).to.be.revertedWith("only admin");
        });
    });

    describe("Token URI", function () {
        it("Should return the correct token URI", async function () {
            await nft.mint(await user.getAddress());
            const expectedURI = 'https://gateway.pinata.cloud/ipfs/bafkreid43ipihuvs4a2gu46ekp4cqjlq3wee52vfp5sj2jbxqgcoj2tfem/';
            expect(await nft.tokenURI(0)).to.equal(expectedURI);
        });

        it("Should revert if querying a non-existent token", async function () {
            await expect(nft.tokenURI(0)).to.be.reverted;
        });
    });
});
