
import Image from "next/image";
import { useMoralis } from "react-moralis";
import styles from "../styles/Home.module.css";
import Logo from "./images/Web3Auth.svg";
import { useState, useEffect } from "react";
import OpenLogin from "@toruslabs/openlogin";
import { ethers } from "ethers";



export default function SignIn() {
  const { authenticate, authError, isAuthenticating, Moralis, account, connector, connectorType, provider } = useMoralis();
  const VERIFIER = {
    loginProvider: "google", // "facebook", "apple", "twitter", "reddit", etc. See full list of supported logins: https://docs.tor.us/direct-auth/verifiers
    clientId: "YOUR PROJECT ID",
  };
  const handleCustomLogin = async () => {
    await authenticate({
      provider: "web3Auth",
      clientId: "BAZA9R-WqW4LXycYuB9FeVf4GaqSOvCc8LQ4FoHw7IwfdKBzfNtHhknzF6R5UTivMgk13-Zo-YELzn_nWN4m1Lc",
      chainId: Moralis.Chains.ETH_RINKBEY,
    });

    

    
  };
  
  const [isLoading, setLoading] = useState(true);

  const [openlogin, setOpenLogin] = useState();
  const [privKey, setPrivKey] = useState();

  useEffect(() => console.log(privKey), [privKey])

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

  // useEffect(() => {
  //   onMount();
  // }, []);

 

  return (
    <div className={styles.card}>
      <Image className={styles.img} src={Logo} width={80} height={80} />
      {isAuthenticating && <p className={styles.green}>Authenticating</p>}
      {authError && (
        <p className={styles.error}>{JSON.stringify(authError.message)}</p>
      )}
      <div className={styles.buttonCard}>
        <button className={styles.loginButton} onClick={handleCustomLogin}>
          Login with Web3Auth
          
        </button>
      </div>
    </div>
  );
      }
