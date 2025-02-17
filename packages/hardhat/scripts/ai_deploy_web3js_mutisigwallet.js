//npx hardhat run scripts/deploy-web3.js --network sepolia

const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
const { ethers } = require("hardhat");

async function main() {
  // Load environment variables
  const { API_URL, PRIVATE_KEY, PRIVATE_KEY2, PRIVATE_KEY3 } = process.env;

  // Initialize Web3
  const web3 = new Web3(new Web3.providers.HttpProvider(API_URL));

  // Load the contract ABI and bytecode
  const abi = JSON.parse(fs.readFileSync(path.join(__dirname, '../artifacts/contracts/Wallet.sol/Wallet.json'), 'utf8')).abi;
  const bytecode = fs.readFileSync(path.join(__dirname, '../artifacts/contracts/Wallet.sol/Wallet.json'), 'utf8').bytecode;

  const artifacts = require("../artifacts/contracts/Wallet.sol/Wallet.json");

  // Create a new contract instance
  const contract = new web3.eth.Contract(abi);

  // Create a new account from the private key
  const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
  const account2 = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY2);
  const account3 = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY3);

  web3.eth.accounts.wallet.add(account);
  web3.eth.accounts.wallet.add(account2);
  web3.eth.accounts.wallet.add(account3);


  // Deploy the contract
  const deployTx = contract.deploy({ data: artifacts.bytecode, arguments: [[account.address, account2.address, account3.address],2] });
//console.log(deployTx);
  // Estimate gas
  const gasEstimate = await deployTx.estimateGas({ from: account.address });

  // Send the deployment transaction
  const receipt = await deployTx.send({ from: account.address, gas: gasEstimate });
  console.log(receipt);

  console.log('Contract deployed to:', receipt.options.address);

  const data = {
      //https://web3js.readthedocs.io/en/v1.3.0/web3-eth-contract.html?highlight=address#id16
      address: receipt.options.address,
      //https://web3js.readthedocs.io/en/v1.3.0/web3-eth-contract.html?highlight=address#options-jsoninterface
      abi: /* JSON.parse( */receipt.options.jsonInterface/* .format('json') )*/
      ///abi: JSON.parse(rawContract)
    };
  
  
    fs.writeFileSync('Walletweb3.json', JSON.stringify(data));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });