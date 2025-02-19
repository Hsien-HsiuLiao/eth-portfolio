import { useEffect, useState } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
} from "./util/interact.js";

const CheckWallet = (/* props */{getWalletStatus}) => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");

  useEffect( () => {

    const fetchWalletData = async () => {
      const { address, status } = await getCurrentWalletConnected();
      setWallet(address);
      setStatus(status);
      
    };
  
    fetchWalletData();
    addWalletListener();
    console.log("useEffect status", status)
    console.log("getWalletStatus",status)
    getWalletStatus(status);
    

  }, [status]);

  function addWalletListener() {
    console.log("addWalletListener",status)

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("Connected");
          console.log("accountsChanged status", status)
          
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser. Click to download
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  return (
    <div className="WalletStatus">
     
      <br></br>
    
      <p id="status" style={{ color: "red" }}>
        {status}
      </p>
    </div>
  );
};

export default CheckWallet;