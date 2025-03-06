const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Wallet', function () {
    let wallet;
    let accounts;

    beforeEach(async function () {
        accounts = await ethers.getSigners();
      //  console.log(accounts[0].address);
        const Wallet = await ethers.getContractFactory('Wallet');
        wallet = await Wallet.deploy([accounts[0].address, accounts[1].address, accounts[2].address], 2);
        await wallet.waitForDeployment();

        //console.log(ethers); 
     //   console.log(wallet.address);

        const tx = await accounts[0].sendTransaction({ to: await wallet.getAddress(), value: ethers.parseEther('1.0') }); // Sending 1 Ether
        // Wait for the transaction to be mined
        await tx.wait();
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
        const walletWithSigner = wallet.connect(accounts[4]); // Connect the wallet to the sender's account
        await expect(walletWithSigner.createTransfer(100, accounts[5].address))
            .to.be.revertedWith('only approver allowed');
    });

    it('should increment approvals', async function () {
        // Create a transfer
        const walletWithSigner = wallet.connect(accounts[0]); // Connect the wallet to the sender's account
        await walletWithSigner.createTransfer(100, accounts[5].address);
    
        // Approve the transfer
        await walletWithSigner.approveTransfer(0);
    
        // Retrieve transfers and balance
        const transfers = await wallet.getTransfers();
        const balance = await ethers.provider.getBalance(wallet.address);
    
        // Debugging logs
        console.log(transfers);
        console.log(balance.toString());
    
        // Assertions
        expect(transfers[0].approvals).to.equal(1);
        expect(transfers[0].sent).to.equal(false);
        expect(balance.toString()).to.equal(ethers.parseEther('1').toString());
    });
    

    it('should send transfer if quorum reached', async function () {
        const balanceBefore = await ethers.provider.getBalance(accounts[6].address);
    
        // Create a transfer
        const walletWithSigner0 = wallet.connect(accounts[0]); // Connect to account[0]
        await walletWithSigner0.createTransfer(100, accounts[6].address);
    
        // Approve the transfer
        await walletWithSigner0.approveTransfer(0); // Approve from account[0]
    
        const walletWithSigner1 = wallet.connect(accounts[1]); // Connect to account[1]
        await walletWithSigner1.approveTransfer(0); // Approve from account[1]
    
        const balanceAfter = await ethers.provider.getBalance(accounts[6].address);
    
        // Assertions
        expect(balanceAfter.sub(balanceBefore).toString()).to.equal(100);
    });
    

    it('should NOT approve transfer if sender is not approved', async function () {
    // Create a transfer
    const walletWithSigner0 = wallet.connect(accounts[0]); // Connect to account[0]
    await walletWithSigner0.createTransfer(100, accounts[5].address);

    // Attempt to approve the transfer from an account that is not approved
    const walletWithSigner4 = wallet.connect(accounts[4]); // Connect to account[4]
    await expect(walletWithSigner4.approveTransfer(0)).to.be.revertedWith('only approver allowed');
});


    it('should NOT approve transfer if transfer is already sent', async function () {
    // Create a transfer
    const walletWithSigner0 = wallet.connect(accounts[0]); // Connect to account[0]
    await walletWithSigner0.createTransfer(100, accounts[6].address);

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
        await wallet.createTransfer(100, accounts[6].address, { from: accounts[0].address });
        await wallet.approveTransfer(0, { from: accounts[0].address });
        await expect(wallet.approveTransfer(0, { from: accounts[0].address }))
            .to.be.revertedWith('cannot approve transfer twice');
    });
});
