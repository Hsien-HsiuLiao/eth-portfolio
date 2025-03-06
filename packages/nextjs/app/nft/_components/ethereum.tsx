import 'dotenv/config';
import { ethers, Contract } from "ethers";
import NFTcontract from './contracts/NFT.json';

// Define the return type for the getBlockchain function
interface BlockchainResponse {
  nft: Contract | undefined;
}

const getBlockchain = async (): Promise<BlockchainResponse> => {
  try {
    // Use InfuraProvider to connect to the Sepolia network
    const provider = new ethers.providers.InfuraProvider("sepolia", process.env.INFURA_API_KEY);
    
    // Create a contract instance
    const nft = new Contract(
      NFTcontract.address,
      NFTcontract.abi,
      provider
    );

    return { nft };
  } catch (error) {
    console.error("Error connecting to blockchain", error);
    return { nft: undefined };
  }
};

export default getBlockchain;
