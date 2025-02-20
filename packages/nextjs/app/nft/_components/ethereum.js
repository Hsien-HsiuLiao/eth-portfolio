import 'dotenv/config';
import { ethers, Contract } from "ethers";
import NFTcontract from './contracts/NFT.json';

/* const getBlockchain = () => new Promise((resolve, reject) => {
        window.addEventListener('load', async () => {
            //check if Metamask installed
            console.log("check if Metamask installed")
            if (window.ethereum) {
                console.log("window.ethereum");
                await window.ethereum.enable(); //opens Metamask popup
                // A Web3Provider wraps a standard Web3 provider, which is
                // what MetaMask injects as window.ethereum into each page
                //https://docs.ethers.org/v5/getting-started/#getting-started--connecting
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();

                const nft = new Contract(
                    NFT.networks[window.ethereum.networkVersion].address,
                    NFT.abi,
                    signer
                );

                resolve({ nft });
            }
            console.log("nft undefined")
            resolve({ nft: undefined });
        });
    }); */

    const getBlockchain = async () => {
       /*  while (document.readyState !== 'complete') {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
       */
        if (window.ethereum) {
          try {
           // await window.ethereum.enable(); //pop up metamask
            //const provider = new ethers.providers.Web3Provider(window.ethereum);
            const provider = new ethers.providers.InfuraProvider("sepolia", process.env.INFURA_API_KEY);
           // const signer = provider.getSigner();
      console.log("NFT", NFTcontract);
            const nft = new Contract(
              //  NFTcontract.networks[window.ethereum.networkVersion].address,
                NFTcontract.address,

                NFTcontract.abi,
              provider
            );
      
            return { nft };
          } catch (error) {
            console.error("error connecting to blockchain", error);
            return { nft: undefined };
          }
        }
      
        return { nft: undefined }; //another?
      };

export default getBlockchain;