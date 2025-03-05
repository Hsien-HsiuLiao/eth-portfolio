import React from 'react';
import Wallet from './contracts/Wallet.json';


function Header({ approvers, quorum, currentAccount }) {
    const contractAddress = Wallet.address;

    return (
        <header style={headerstyle}>
            <h1 style={{ textAlign: 'center', color: '#fff', background: '#00f' }}>
                Multi-signature Wallet Dapp contract address: {contractAddress}               <p>(view contract on etherscan) <a href={`https://sepolia.etherscan.io/address/${contractAddress}`}>https://sepolia.etherscan.io/address/{contractAddress}</a></p>
            </h1>
            <div style={{ textAlign: 'right', color: '#fff', background: '#00f' }}>
                Current Account: {currentAccount}</div>
                <p></p>
            <ul>
                <li><h3>Approvers:</h3>
                    {approvers.map((approver, index) => (
                        <div key={index}>{approver}</div>
                    ))}</li>
                <br></br>
                <li><h5>Quorum: {quorum}</h5></li>
            </ul>
        </header>
    );
}
const headerstyle = {
    background: '#333',
    color: '#fff',
    textAlign: 'left',
    padding: '10px'
}

export default Header;