"use client";

import React, { useEffect, useState } from 'react';
import { getWeb3, getWallet } from './utils.js';
import Header from './Header.js';
import NewTransfer from './NewTransfer.js';
import TransferList from './TransferList.js';
/* import ProgressBar from 'react-bootstrap/ProgressBar';
 */
import CheckWallet from './CheckWallet.js';




function MultiSigWalletApp() {

  
  const [web3, setWeb3] = useState(undefined);
  const [account, setAccounts] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);
  const [approvers, setApprovers] = useState([]);
  const [quorum, setQuorum] = useState(undefined);
  const [transfers, setTransfers] = useState([]);
  const [walletStatus, setWalletStatus] = useState(undefined);
  
  

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3(); //getWeb3() has become async function
      const accounts = await web3.eth.getAccounts();
      const [account] = accounts; //destructure account from accounts array 
      const wallet = await getWallet(web3);
      const approvers = await wallet.methods.getApprovers().call();
      const quorum = await wallet.methods.quorum().call();
      const transfers = await wallet.methods.getTransfers().call();
      setWeb3(web3);
      setAccounts(account);
      setWallet(wallet);
      setApprovers(approvers);
      setQuorum(quorum);
      setTransfers(transfers);
      window.ethereum.on('accountsChanged', function(accounts) {
        const [account] = accounts; //destructure account from accounts array 

        setAccounts(account);
        });
        
    };
    init();
    
  }, [/* walletStatus */]);


    const createTransfer = async (transfer) => {
        await wallet.methods
          .createTransfer(transfer.amount, transfer.to)
          .send({from: account});
        setTransfers(await wallet.methods.getTransfers().call());    
  }

  const approveTransfer = (transferId, transferApprovals) => {
    const newtransfers = async () => {
      const refreshAccounts = await web3.eth.getAccounts();
      const [account] = refreshAccounts; //destructure account from accounts array 

      setAccounts(account);
     
     
      await wallet.methods
              .approveTransfer(transferId)
              .send({from: account});
      const updatedTransfer = await wallet.methods.getTransfers().call();
      setTransfers(updatedTransfer);
    };
    newtransfers();
  }

  const updateStatus = (newStatus) => {
    setWalletStatus(newStatus);
    console.log("updateStatus", newStatus, walletStatus);
  };

  if(
    typeof web3 === 'undefined'
    || typeof account === 'undefined'
    || typeof wallet === 'undefined'
    || approvers.length === 0
    || typeof quorum === 'undefined'
  ) {
    return (
      <div>
            Loading...
          {/*   <ProgressBar animated now={45} /> */}
          <CheckWallet getWalletStatus={updateStatus}/>
      </div>
      );
  }

  return (
    <div style={appStyle}>
      <Header approvers={approvers} quorum={quorum} currentAccount={account} />
      <NewTransfer createTransfer={createTransfer} />
       <TransferList transfers={transfers} approveTransfer={approveTransfer} /> 
    </div>
  );
}

const appStyle = {
  background: '#0f9',
  color: '#fff',
  textAlign: 'left',
  padding: '10px'
}

export default MultiSigWalletApp;
