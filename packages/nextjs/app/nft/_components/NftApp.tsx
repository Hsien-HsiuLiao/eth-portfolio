"use client";

import React, { useState, useEffect } from 'react';
import { fetchNftMetadata, TokenMetadata } from './nftModel';

const NftApp: React.FC = () => {
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | undefined>(undefined);
  const [nftAddress, setNftAddress] = useState<string | undefined>(undefined);
  const [walletStatus, setWalletStatus] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getNFT = async () => {
      const NFTdata = await fetchNftMetadata(0); // Fetch metadata for token ID 0
      setTokenMetadata(NFTdata?.metadata);
      setNftAddress(NFTdata?.address); 
    };

    getNFT();
  }, []);

  const updateStatus = (newStatus: string) => {
    setWalletStatus(newStatus);
    console.log("updateStatus", newStatus, walletStatus);
  };

  // View Logic
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
};

export default NftApp;
