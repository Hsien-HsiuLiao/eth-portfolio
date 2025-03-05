const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Wallet', function () {
    let wallet;
    let accounts;

    beforeEach(async function () {
        accounts = await ethers.getSigners();
        const Wallet = await ethers.getContractFactory('Wallet');
        wallet = await Wallet.deploy([accounts[0].address, accounts[1].address, accounts[2].address], 2);
        await accounts[0].sendTransaction({ to: wallet.address, value: ethers.utils.parseEther('1') }); // Sending 1 Ether
    });

    it('should have correct approvers and quorum', async function () {
        const approvers = await wallet.getApprovers();
        const quorum = await wallet.quorum();

        expect(approvers.length).to.equal(3);
        expect(approvers[0]).to.equal(accounts[0].address);
        expect(approvers[1]).to.equal(accounts[1].address);
        expect(approvers[2]).to.equal(accounts[2].address);
        expect(quorum).to.equal(2);
    });

    it('should create transfers', async function () {
        await wallet.createTransfer(100, accounts[5].address, { from: accounts[0].address });
        const transfers = await wallet.getTransfers();

        expect(transfers.length).to.equal(1);
        expect(transfers[0].id).to.equal(0);
        expect(transfers[0].amount).to.equal(100);
        expect(transfers[0].to).to.equal(accounts[5].address);
        expect(transfers[0].approvals).to.equal(0);
        expect(transfers[0].sent).to.equal(false);
    });

    it('should NOT create transfers if sender is not approved', async function () {
        await expect(wallet.createTransfer(100, accounts[5].address, { from: accounts[4].address }))
            .to.be.revertedWith('only approver allowed');
    });

    it('should increment approvals', async function () {
        await wallet.createTransfer(100, accounts[5].address, { from: accounts[0].address });
        await wallet.approveTransfer(0, { from: accounts[0].address });
        const transfers = await wallet.getTransfers();
        const balance = await ethers.provider.getBalance(wallet.address);

        expect(transfers[0].approvals).to.equal(1);
        expect(transfers[0].sent).to.equal(false);
        expect(balance.toString()).to.equal(ethers.utils.parseEther('1').toString());
    });

    it('should send transfer if quorum reached', async function () {
        const balanceBefore = await ethers.provider.getBalance(accounts[6].address);
        await wallet.createTransfer(100, accounts[6].address, { from: accounts[0].address });
        await wallet.approveTransfer(0, { from: accounts[0].address });
        await wallet.approveTransfer(0, { from: accounts[1].address });
        const balanceAfter = await ethers.provider.getBalance(accounts[6].address);

        expect(balanceAfter.sub(balanceBefore).toString()).to.equal(100);
    });

    it('should NOT approve transfer if sender is not approved', async function () {
        await wallet.createTransfer(100, accounts[5].address, { from: accounts[0].address });
        await expect(wallet.approveTransfer(0, { from: accounts[4].address }))
            .to.be.revertedWith('only approver allowed');
    });

    it('should NOT approve transfer if transfer is already sent', async function () {
        await wallet.createTransfer(100, accounts[6].address, { from: accounts[0].address });
        await wallet.approveTransfer(0, { from: accounts[0].address });
        await wallet.approveTransfer(0, { from: accounts[1].address });
        await expect(wallet.approveTransfer(0, { from: accounts[2].address }))
            .to.be.revertedWith('transfer has already been sent');
    });

    it('should NOT approve transfer twice', async function () {
        await wallet.createTransfer(100, accounts[6].address, { from: accounts[0].address });
        await wallet.approveTransfer(0, { from: accounts[0].address });
        await expect(wallet.approveTransfer(0, { from: accounts[0].address }))
            .to.be.revertedWith('cannot approve transfer twice');
    });
});
