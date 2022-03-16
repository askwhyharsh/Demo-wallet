/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require("@nomiclabs/hardhat-ganache");
//  require("@nomiclabs/hardhat-waffle");
//  require("@nomiclabs/hardhat-web3");
 
 module.exports = {
   defaultNetwork: "matic",
   networks: {
     hardhat: {
     },
     matic: {
       url: "https://rpc-mumbai.maticvigil.com",
       gas: 6000000,           // Gas sent with each transaction (default: ~6700000)
       gasPrice: 3000000000,  // 3 gwei (in wei) (default: 100 gwei)
       confirmations: 2,
       timeoutBlocks: 200,
       skipDryRun: true,
       accounts: [
                   process.env.PK_MANAGER
                 ]
     }
   },
   solidity: {
     compilers: [
       {
         version: "0.5.7",
       },
       {
         version: "0.8.3",
         optimizer: {
           enabled: true,
           runs: 999,
         },
       },
       {
         version: "0.8.0",
         optimizer: {
           enabled: true,
           runs: 999,
         },
       }
     ],
     overrides: {
       "contracts/v_0_5_7/*.sol": {
         version: "0.5.7",
         settings: { }
       },
       "contracts/test/uniswapV2/libraries/WETH9.sol": {
         version: "0.5.4",
         settings: { }
       }
     }
   }
 }