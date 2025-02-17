import React from 'react';
import Wallet from './contracts/Wallet.json';


function Header({approvers, quorum, currentAccount}) {
    const contractAddress = Wallet.address;

    return (
        <header style={headerstyle}>
            <h1 style={{textAlign: 'center', color: '#fff', background: '#00f'}}>
                Multi-signature Wallet Dapp {contractAddress}</h1>
            <div style={{textAlign: 'right', color: '#fff', background: '#00f'}}>
                Current Account: {currentAccount}</div>
            <ul>
                <li><h3>Approvers: </h3>{approvers.join(', ')}</li>
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