import { useMoralis } from "react-moralis";
import signOutStyle from "../styles/SignOut.module.css";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import walletFactory from "../artifacts/contracts/v_0_5_7/Wallet/ZefiWalletFactory.sol/ZefiWalletFactory.json";
import aavev2 from "../artifacts/contracts/v_0_8_3/modules/AaveV2.sol/AaveV2.json";
import ierc20 from "../artifacts/openzeppelin-solidity/contracts/token/ERC20/IERC20.sol/IERC20.json";
// import aaveV2 from "";

import OpenLogin from "@toruslabs/openlogin";
import { ethers, providers } from "ethers";



const { randomBytes, parseUnits } = require('ethers').utils;

// const MULTISIG_POLYGON_MUMBAI = '0xB9af456433Ba1651011Ca5e3C991a1A7A5A75b91';

const ZEFITRANSFER_POLYGON_MUMBAI = '0xBdEbd749DBC9755C940BBa353f3eF9e3c9ADBca6';
const AAVEV2_POLYGON_MUMBAI = '0x6E7a42B7452942E4510AA62000FE37215c266df9';
// const WALLET_FACTORY_POLYGON_MUMBAI = '0x9Fa38603FD8ba413AFdf9214b0984f6FB1D4b174';
const WALLET_FACTORY_POLYGON_MUMBAI = '0xf1440cF8DAC3895956E8287778b531BBB6aFb8F5'; // manager - harsh 0x015



// const AAVEV2_POLYGON_MUMBAI = '0x6E7a42B7452942E4510AA62000FE37215c266df9';

const USDC = '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e'; // MATIC USDC
const aUSDC = "0x2271e3Fef9e15046d09E1d78a8FF038c691E9Cf9"; // mumbai matic a usdc

export const SignOut = () => {
  const { logout, Moralis, user } = useMoralis();
  const [balance, setBalance] = useState(0);
  const fetchBalance = async () => {
    try {
      const options = { chain: Moralis.Chains.POLYGON_MUMBAI };
      const balance = await Moralis.Web3API.account.getNativeBalance(options);
      setBalance(balance.balance / 10 ** 18);
     
    } catch {}
  };
  useEffect(() => {
    fetchBalance();
  }, [privKey]);



  const [isLoading, setLoading] = useState(true);

  const [openlogin, setOpenLogin] = useState();
  const [privKey, setPrivKey] = useState();
  const [ownerAddress, setOwner] = useState();
  const zefiAccounts = [];
  const [mainZefiAccount, setMainZefiAccount] = useState()
  const [balanceUSDC, setUSDCbalance] = useState(0);
  const [balanceamUSDC, setamUSDCbalance] = useState(0);



  useEffect(() => {console.log(privKey) }, [privKey])
  useEffect(() => {console.log(zefiAccounts) }, [zefiAccounts])
  useEffect(() => fetchZefiWalletsOfUser() , [privKey])


  async function fetchZefiWalletsOfUser() {
    const connection = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/kV8qIfhZYAYxIzeQrxfHrso9_R-ITP4y"); 
    // const connection = new ethers.providers.AlchemyProvider( "polygon", "https://polygon-mumbai.g.alchemy.com/v2/kV8qIfhZYAYxIzeQrxfHrso9_R-ITP4y"); 
    console.log("connection",connection);
    
    const gasPrice = connection.getGasPrice();

    let manager = new ethers.Wallet("0xcfef501368429026b0f473dfcb0ed844897a3858d5cb54078b58f4a7be40af69", connection);
   let walletSigner = manager.connect(connection);
   
    // const gasPrice = connection.getGasPrice();
   if(privKey) {
 let owner = new ethers.Wallet( privKey);
     console.log('owner', owner.address);
     setOwner(owner)
   
   
     
   
    
    console.log("wallet fetched - ", manager.address);
    console.log("wallet ", manager, connection);
    


    let zefiWalletFactory = new ethers.Contract(WALLET_FACTORY_POLYGON_MUMBAI, walletFactory.abi, walletSigner);
    console.log('fetching zefi accounts');
    
    let zefiaccounts = await zefiWalletFactory.getCreatedWallets(owner.address);
    // await zefiaccounts.wait();
    console.log('zefi accounts', zefiaccounts);
    zefiAccounts = zefiaccounts;
    console.log('zefi accounts', zefiAccounts);
    setMainZefiAccount(zefiAccounts[0]);


    let IERC20 = new ethers.Contract(USDC, ierc20.abi, walletSigner);
      let balanceUSDC = await IERC20.balanceOf(zefiAccounts[0]);
      let balanceusdc = Number(balanceUSDC)/1000000
      setUSDCbalance(balanceusdc)
      console.log('balance of usdc of xefi account', balanceusdc);

    let amIERC20 = new ethers.Contract(aUSDC, ierc20.abi, walletSigner);
      let balanceamUSDC = await amIERC20.balanceOf(zefiAccounts[0]);
      let balanceamusdc = Number(balanceamUSDC)/1000000
      setamUSDCbalance(balanceamusdc)
      console.log('balance of amUSDC of xefi account', balanceamusdc);
    
   }
    
  } 

  const onMount = async () => {
    setLoading(true);

    try {
      const openlogin = new OpenLogin({
        clientId: "BAZA9R-WqW4LXycYuB9FeVf4GaqSOvCc8LQ4FoHw7IwfdKBzfNtHhknzF6R5UTivMgk13-Zo-YELzn_nWN4m1Lc",
        network: "mainnet", // valid values (testnet or mainnet)
      });
      setOpenLogin(openlogin);

      await openlogin.init();
      setPrivKey(openlogin.privKey);
      
      console.log(openlogin.privKey);
    
      
    } finally {
      setLoading(false);
    }
  };

  const onLogin = async () => {
    if (isLoading || privKey) return;

    setLoading(true);
    try {
      await openlogin.login({
        loginProvider: VERIFIER.loginProvider,
        redirectUrl: "http://localhost:3000/",
      });
      setPrivKey(openlogin.privKey);
      console.log(privKey);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onMount();
  }, []);

  async function createWallet() {
    
    const connection = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/kV8qIfhZYAYxIzeQrxfHrso9_R-ITP4y"); 
    // const connection = new ethers.providers.AlchemyProvider( "polygon", "https://polygon-mumbai.g.alchemy.com/v2/kV8qIfhZYAYxIzeQrxfHrso9_R-ITP4y"); 
    console.log("connection",connection);
    
    const gasPrice = connection.getGasPrice();

    let manager = new ethers.Wallet("0xcfef501368429026b0f473dfcb0ed844897a3858d5cb54078b58f4a7be40af69", connection);
   let walletSigner = manager.connect(connection);
   
    // const gasPrice = connection.getGasPrice();

    let owner = new ethers.Wallet(privKey);
     console.log('owner', owner.address);
     setOwner(owner)
     
   
    
    console.log("wallet fetched - ", manager.address);
    console.log("wallet ", manager, connection);
    


    let zefiWalletFactory = new ethers.Contract(WALLET_FACTORY_POLYGON_MUMBAI, walletFactory.abi, walletSigner);

    // let nonce = await multisigWrapper.nonce();

    // console.log('Nonce: ', nonce.toNumber());
    // const multisigExecutor = new MultisigExecutor(multisigWrapper, manager, false);

    // let isManager = await zefiWalletFactory.connect(manager).managers(manager.address);
    // console.log('isManager: ', isManager)

 
    // Create Wallet
    console.log("Creating new wallet...");

    const modules = [
        ZEFITRANSFER_POLYGON_MUMBAI,
        AAVEV2_POLYGON_MUMBAI
    ];

    let salt = ethers.BigNumber.from(randomBytes(32)).toHexString(); 
    
    //salt = '0x142f842a96a4c9e3afe0f5a36f2b571e21813ba74f50454e7d0fabfe23b1aafb'
    console.log(`Salt of future address of the wallet is: ${salt}`);
    
    console.log("wallet ", manager, connection);

    let read = await zefiWalletFactory.getAddressForCounterfactualWallet(owner.address, modules, salt);
    console.log('read', read);
    let create = await zefiWalletFactory.connect(manager).createCounterfactualWallet(owner.address, modules, salt);
    await create.wait();
    console.log('create', create);
    zefiAccounts.push(read);
  //   const tx = {
  //     data: zefiWalletFactory.createCounterfactualWallet(owner.address, modules, salt),
  //     //data: contract.mint(receiverAddress),
  //     gasPrice: await gasPrice,
  //     gasLimit: ethers.utils.hexlify(350000),
  //     nonce: await connection.getTransactionCount(manager.address, 'latest')

  // }

  // console.log(tx);

  //    const trans = await walletSigner.sendTransaction(tx);
  //    await trans.wait();
     console.log('done');

  }

  async function deposit() { 


    const connection = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/kV8qIfhZYAYxIzeQrxfHrso9_R-ITP4y"); 
    // const connection = new ethers.providers.AlchemyProvider( "polygon", "https://polygon-mumbai.g.alchemy.com/v2/kV8qIfhZYAYxIzeQrxfHrso9_R-ITP4y"); 
    console.log("connection",connection);
    
    const gasPrice = connection.getGasPrice();
    
    let owner = new ethers.Wallet(privKey, connection );
    console.log('owner', owner.address);
    setOwner(owner)
    let walletSigner = owner.connect(connection);
     
  
     let aaveV2 = new ethers.Contract(AAVEV2_POLYGON_MUMBAI, aavev2.abi, walletSigner );
    try {
      let IERC20 = new ethers.Contract(USDC, ierc20.abi, walletSigner);
      let balanceUSDC = await IERC20.balanceOf(mainZefiAccount);
      let balance = Number(balanceUSDC)/1000000
      setUSDCbalance(balance)
      console.log('balance of usdc of xefi account', balanceUSDC, "usdc", balance);
      
      const tx = await aaveV2.connect(owner).addInvestment(mainZefiAccount, USDC, balanceUSDC, { gasLimit: 4000000 });
      
      let txReceipt = await tx.wait();
      console.log('done deposit');
      let eventInvestmentAdded = txReceipt.events.filter(event => event.event)[0].event;

      console.log(`USDC deposited by ${owner.address} with event as ${eventInvestmentAdded}.`);


    } catch (error) {
      console.log('error = ', error);
      
      
    }
   

  }
  async function withdraw() { 


    const connection = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/kV8qIfhZYAYxIzeQrxfHrso9_R-ITP4y"); 
    // const connection = new ethers.providers.AlchemyProvider( "polygon", "https://polygon-mumbai.g.alchemy.com/v2/kV8qIfhZYAYxIzeQrxfHrso9_R-ITP4y"); 
    console.log("connection",connection);
    
    const gasPrice = connection.getGasPrice();
    
    let owner = new ethers.Wallet(privKey, connection );
    console.log('owner', owner.address);
    setOwner(owner)
    let walletSigner = owner.connect(connection);
     
  
     let aaveV2 = new ethers.Contract(AAVEV2_POLYGON_MUMBAI, aavev2.abi, walletSigner );
    try {
      let IERC20 = new ethers.Contract(aUSDC, ierc20.abi, walletSigner);
      let balanceUSDC = await IERC20.balanceOf(mainZefiAccount);
      let balance = Number(balanceUSDC)/1000000
      // setUSDCbalance(balance)
      console.log('balance of usdc of xefi account', balanceUSDC, "usdc", balance);
      
      const tx = await aaveV2.connect(owner).removeInvestment(mainZefiAccount, USDC, balanceUSDC, { gasLimit: 4000000 });
      
      let txReceipt = await tx.wait();
      console.log('done withdrawal');

      let eventInvestmentRemoved = txReceipt.events.filter(event => event.event)[0].event;
      console.log(`USDC withdrawal by ${owner.address} with event as ${eventInvestmentRemoved}.`);


    } catch (error) {
      console.log('error = ', error);
      
      
    }
   

  }


  async function fetchWallet( ) {
    const connection = new ethers.providers.JsonRpcProvider(""); 
    const gasPrice = connection.getGasPrice();
    
    let wallet = new ethers.Wallet(privateKey);
    let walletSigner = wallet.connect(connection);
    setOwner(wallet.address);
    if(privKey);
    const contract = new ethers.Contract(contractAddress, abi, walletSigner);

    const tx = {
        data: contract.transferFrom(senderAddress, receiverAddress, 679),
        //data: contract.mint(receiverAddress),
        gasPrice: gasPrice,
        gasLimit: ethers.utils.hexlify(340000),
        nonce: connection.getTransactionCount(wallet.address, 'latest')
    }

    const trans = await walletSigner.sendTransaction(tx);
   }

  const handleTransfer = async () => {
    try {
      await Moralis.transfer({
        amount: Moralis.Units.ETH("0.001"),
        receiver: "0x0dd68c06Af920CA069CDc27d05AA9EB65F85990A",
        type: "native",
      }).then((e) => {
        alert("sucesfully transfered");
      });
      await fetchBalance();
    } catch {}
  };

  return (
    <div className={signOutStyle.signOutCard}>
      <h4>Welcome To Zefi</h4>
      <button className={`${signOutStyle.refresh}`} onClick={fetchBalance}>
        Refresh
      </button>
      <p className={signOutStyle.subHeader}>Details:</p>

      <div className={signOutStyle.detailsDiv}>
        <div>
          <h5>Account: Web3Auth</h5>
          
          <p>{user.attributes.accounts}</p>

        
          <h5>Account: Zefi</h5>
          
          <p>{mainZefiAccount}</p>

           <button onClick={fetchZefiWalletsOfUser}> fetch Accounts  </button>
        </div>
    
        <div>
          <h5>Balance (Matic)</h5>
          <p>{balance} </p>
          <h5>Balance (zefi - USDC)</h5>
          <p> {balanceUSDC} </p>
        </div>
    
        <div>
          <h5> deposited (aUSDC) </h5>
          <p> 0  </p>
          <h5>aUSDC balance (zefi - aUSDC)</h5>
          <p> {balanceamUSDC} </p>
        </div>
      </div>

      <div className={signOutStyle.fotter}>
        <button className={styles.loginButton} onClick={createWallet}>
          createWallet
        </button>
        <button className={styles.loginButton} onClick={deposit}>
          deposit all
        </button>
        <button className={styles.loginButton} onClick={withdraw}>
          withdraw all
        </button>
        <button className={styles.loginButton} onClick={logout}>
          Sign Out
        </button>
      </div>
    </div>
  );
};
