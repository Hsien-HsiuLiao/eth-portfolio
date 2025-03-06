"use client";

import React, { useState, useEffect } from 'react';
import getBlockchain from './ethereum';
import axios from 'axios';
import CheckWallet from './CheckWallet';
import Minter from './Minter';
import {
  connectWallet,
  getCurrentWalletConnected,
} from "./util/interact";

interface TokenMetadata {
  name: string;
  description: string;
  image: string;
}

interface NftCollection {
  [key: string]: TokenMetadata; // This allows for dynamic keys like "0", "1", etc.
}


function NftApp() {
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | undefined>(undefined);
  const [nftAddress, setNftAddress] = useState<string | undefined>(undefined);
  const [walletStatus, setWalletStatus] = useState<string | undefined>(undefined);

  useEffect(() => {
    getNFT();
  }, []);

  const getNFT = async () => {
    console.log('Button clicked!');
    const { nft } = await getBlockchain();
    if (!nft) {
      console.error("NFT contract is not defined");
      return; // Exit the function if nft is undefined
    }
    console.log("nft", nft.address);
    const tokenId = 0;
    const tokenURI = await nft.tokenURI(tokenId);
    console.log(tokenURI);
    const { data } = await axios.get(tokenURI);
    console.log(data);
    const metaData: NftCollection = data; // Assuming the data structure matches TokenMetadata
  //  console.log(metaData[tokenId]);
    setTokenMetadata(metaData[tokenId]);
 //   console.log(tokenMetadata);
    setNftAddress(nft.address);
  };

  const updateStatus = (newStatus: string) => {
    setWalletStatus(newStatus);
    console.log("updateStatus", newStatus, walletStatus);
  };

  if (typeof tokenMetadata === 'undefined') {
    return (
      <div style={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
        <h3>About</h3>
        <p>This app will get the token URI from the NFT smart contract, 
          then get the metadata from IPFS using the URI
          and display the result in the browser
          once the Metamask wallet is installed and connected
        </p>
        <p>Start by connecting Metamask to the Sepolia testnet to display the NFT</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className='container text-center'>
          <div className='row'>
            <div className='col-sm-12'>
              <h1>{tokenMetadata.name}</h1>
              <div className="jumbotron">
                <p className="lead">{tokenMetadata.description}</p>
                <p>
                  (verify contract on etherscan) 
                  <a href={`https://sepolia.etherscan.io/address/${nftAddress}`} target="_blank" rel="noopener noreferrer">
                    https://sepolia.etherscan.io/address/{nftAddress}
                  </a>
                </p>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img src={tokenMetadata.image} className="img-fluid" alt="" style={{ maxWidth: '50%', height: 'auto' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NftApp;
