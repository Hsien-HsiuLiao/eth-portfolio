import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Wallet } from '../typechain-types'; // Adjust the import path based on your project structure
import { Signer } from 'ethers';

describe('Wallet', function () {
    let wallet: Wallet;
    let accounts: Signer[];//Array<ReturnType<typeof ethers.getSigners>[address]>;
    let approver1: string;
    let approver2: string;
    let approver3: string;

    beforeEach(async function () {
        accounts = await ethers.getSigners();
        const WalletFactory = await ethers.getContractFactory('Wallet');
         approver1 = await accounts[0].getAddress();
         approver2 = await accounts[1].getAddress();
         approver3 = await accounts[2].getAddress();
        const quorum = 2;
        
        wallet = (await WalletFactory.deploy([approver1, approver2, approver3], quorum)) as Wallet;
        await wallet.waitForDeployment();

        const tx = await accounts[0].sendTransaction({ to: await wallet.getAddress(), value: ethers.parseEther('1.0') }); // Sending 1 Ether
        await tx.wait();
    });

    it('should have correct approvers and quorum', async function () {
        const approvers = await wallet.getApprovers();
        const quorum = await wallet.quorum();

        expect(approvers.length).to.equal(3);
        expect(approvers[0]).to.equal(approver1);
        expect(approvers[1]).to.equal(approver2);
        expect(approvers[2]).to.equal(approver3);
        expect(quorum).to.equal(2);
    });

    it('should create transfers', async function () {
        await wallet.createTransfer(100, await accounts[5].getAddress());
        const transfers = await wallet.getTransfers();

        expect(transfers.length).to.equal(1);
        expect(transfers[0].id).to.equal(0);
        expect(transfers[0].amount).to.equal(100);
        expect(transfers[0].to).to.equal(await accounts[5].getAddress());
        expect(transfers[0].approvals).to.equal(0);
        expect(transfers[0].sent).to.equal(false);
    });

    it('should NOT create transfers if sender is not approved', async function () {
        const walletWithSigner = wallet.connect(accounts[4]); // Connect the wallet to the sender's account
        await expect(walletWithSigner.createTransfer(100, await accounts[5].getAddress()))
            .to.be.revertedWith('only approver allowed');
    });

    it('should increment approvals', async function () {
        const walletWithSigner = wallet.connect(accounts[0]); // Connect the wallet to the sender's account
        await walletWithSigner.createTransfer(100, accounts[5].getAddress());

        // Approve the transfer
        await walletWithSigner.approveTransfer(0);

        // Retrieve transfers and balance
        const transfers = await wallet.getTransfers();
        const balance = await ethers.provider.getBalance(wallet.getAddress());

        // Debugging logs
        console.log(balance.toString());

        // Assertions
        expect(transfers[0].approvals).to.equal(1);
        expect(transfers[0].sent).to.equal(false);
        expect(balance.toString()).to.equal(ethers.parseEther('1').toString());
    });

    it('should send transfer if quorum reached', async function () {
        const balanceBefore = await ethers.provider.getBalance(accounts[6].getAddress());

        // Create a transfer
        const walletWithSigner0 = wallet.connect(accounts[0]); // Connect to account[0]
        await walletWithSigner0.createTransfer(100, accounts[6].getAddress());

        // Approve the transfer
        await walletWithSigner0.approveTransfer(0); // Approve from account[0]

        const walletWithSigner1 = wallet.connect(accounts[1]); // Connect to account[1]
        await walletWithSigner1.approveTransfer(0); // Approve from account[1]

        const balanceAfter = await ethers.provider.getBalance(await accounts[6].getAddress());

        // Assertions
     //   expect(balanceAfter.sub(balanceBefore).toString()).to.equal(ethers.utils.parseEther('100').toString());
                    expect(balanceAfter - balanceBefore).to.equal(100);
    });

    it('should NOT approve transfer if sender is not approved', async function () {
        const walletWithSigner0 = wallet.connect(accounts[0]); // Connect to account[0]
        await walletWithSigner0.createTransfer(100, await accounts[5].getAddress());

        const walletWithSigner4 = wallet.connect(accounts[4]); // Connect to account[4]
        await expect(walletWithSigner4.approveTransfer(0)).to.be.revertedWith('only approver allowed');
    });

      it('should NOT approve transfer if transfer is already sent', async function () {
    // Create a transfer
    const walletWithSigner0 = wallet.connect(accounts[0]); // Connect to account[0]
    await walletWithSigner0.createTransfer(100, await accounts[6].getAddress());

    // Approve the transfer from account[0]
    await walletWithSigner0.approveTransfer(0);

    // Approve the transfer from account[1]
    const walletWithSigner1 = wallet.connect(accounts[1]); // Connect to account[1]
    await walletWithSigner1.approveTransfer(0);

    // Attempt to approve the transfer from account[2] after it has already been sent
    const walletWithSigner2 = wallet.connect(accounts[2]); // Connect to account[2]
    await expect(walletWithSigner2.approveTransfer(0)).to.be.revertedWith('transfer has already been sent');
});


    it('should NOT approve transfer twice', async function () {
        await wallet.createTransfer(100, await accounts[6].getAddress(), { from: await accounts[0].getAddress() });
        await wallet.approveTransfer(0, { from: await accounts[0].getAddress() });
        await expect(wallet.approveTransfer(0, { from: await accounts[0].getAddress() }))
            .to.be.revertedWith('cannot approve transfer twice');
    });
});
