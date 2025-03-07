import getBlockchain from './ethereum';
import axios from 'axios';

export interface TokenMetadata {
  name: string;
  description: string;
  image: string;
}

export interface NftCollection {
  [key: string]: TokenMetadata; 
}

export interface NftData {
  metadata: TokenMetadata | undefined;
  address: string;
}

export const fetchNftMetadata = async (tokenId: number): Promise<NftData | undefined> => {
  const { nft } = await getBlockchain();
  if (!nft) {
    console.error("NFT contract is not defined");
    return undefined; // Exit the function if nft is undefined
  }

  const tokenURI = await nft.tokenURI(tokenId);
  const { data } = await axios.get(tokenURI);
  const metaData: NftCollection = data; 

  return {
    metadata: metaData[tokenId],
    address: nft.address, 
  };
};
