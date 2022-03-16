const ethLib = require('ethers');
const readline = require('readline');
const ethereumUtil = require('ethereumjs-util');
const {ethers} = require("hardhat");
const { randomBytes } = require('ethers').utils;

module.exports = {
    createHash:(v, address) => {
        return ethLib.utils.solidityKeccak256(
            ['bytes32', 'address'],[v, address]
        )
    },

    createAddressFromPrivateKey: (pk) => {
        return new ethLib.Wallet(pk).address
    },

    createWalletUsingPk: (pk) => {
        new ethLib.Wallet(pk)
        return new ethLib.Wallet(pk)
    },

    createPrivateKey: () => {
        return ethLib.Wallet.createRandom().privateKey;
    },

    randomWallet: () => {
        //console.log('mnemonic: ', ethLib.Wallet.createRandom().mnemonic);
        console.log(ethLib.Wallet.fromMnemonic('clog resource cannon over captain relief seven have dice fat wolf bunker').privateKey)
        let pk = ethLib.Wallet.createRandom().privateKey;
        return new ethLib.Wallet(pk)
    },

    namehash: function (_name) {
        return ethLib.utils.namehash(_name);
    },

    sha3: (input) => {
        if (ethLib.utils.isHexString(input)) {
            return ethLib.utils.keccak256(input);
        }
        return ethLib.utils.keccak256(ethLib.utils.toUtf8Bytes(input));
    },

    asciiToBytes32: (input) => {
        return ethLib.utils.formatBytes32String(input);
        //return ethLib.utils.hexlify(ethLib.utils.toUtf8Bytes(input));
    },

    bigNumToBytes32: (input) => {
        return ethLib.utils.hexZeroPad(input.toHexString(), 32)
    },

    waitForUserInput: (text) => {
        return new Promise((resolve) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question(text, (answer) => {
                resolve(answer);
                rl.close();
            });
        });
    },

    signOffchain: async (signers, from, to, value, data, nonce, gasPrice, gasLimit) => {
        let input = '0x' + [
            '0x19',
            '0x00',
            from,
            to,
            ethLib.utils.hexZeroPad(ethLib.utils.hexlify(value), 32),
            data,
            nonce,
            ethLib.utils.hexZeroPad(ethLib.utils.hexlify(gasPrice), 32),
            ethLib.utils.hexZeroPad(ethLib.utils.hexlify(gasLimit), 32)
        ].map(hex => hex.slice(2)).join("");

        let signedData = ethLib.utils.keccak256(input);

        const tasks = signers.map(signer => signer.signMessage(ethLib.utils.arrayify(signedData)));
        const signatures = await Promise.all(tasks);
        const sigs = "0x" + signatures.map(signature => {
            const split = ethLib.utils.splitSignature(signature);
            return ethLib.utils.joinSignature(split).slice(2);
        }).join("");

        return sigs;
    },

    createWallet: async (factoryAddress, owner, modules) => {
        const salt = ethLib.BigNumber.from(randomBytes(32)).toHexString();
        let factory = await ethers.getContractAt("ZefiWalletFactory", factoryAddress);
        const tx = await factory.createCounterfactualWallet(owner, modules,  salt);
        let txReceipt = await tx.wait()
        let walletAddr = txReceipt.events.filter(event => event.event == 'WalletCreated')[0].args.wallet;
        return walletAddr;
    },

    sortWalletByAddress(wallets) {
        return wallets.sort((s1, s2) => {
            const bn1 = ethLib.utils.bigNumberify(s1.address);
            const bn2 = ethLib.utils.bigNumberify(s2.address);
            if (bn1.lt(bn2)) return -1;
            if (bn1.gt(bn2)) return 1;
            return 0;
        });
    },

    parseRelayReceipt(txReceipt) {
        return txReceipt.events.find(l => l.event === 'TransactionExecuted').args.success;
    },

    versionFingerprint(modules) {
        let concat = modules.map((module) => {
            return module.address;
        }).sort((m1, m2) => {
            const bn1 = ethLib.utils.bigNumberify(m1);
            const bn2 = ethLib.utils.bigNumberify(m2);
            if (bn1.lt(bn2)) {
                return 1;
            }
            if (bn1.gt(bn2)) {
                return -1;
            }
            return 0;
        }).reduce((prevValue, currentValue) => {
            return prevValue + currentValue.slice(2);
        }, "0x");
        return ethLib.utils.keccak256(concat).slice(0, 10);
    },
    getRandomAddress() {
        const from = Buffer.alloc(Math.floor(Math.random() * (100 - 0)));;
        const nonce = Buffer.alloc(Math.floor(Math.random() * (100 - 0)));;
        ethereumUtil.generateAddress2
        const addressBuffer = ethereumUtil.generateAddress(from, nonce);
       // const addressBuffer = ethereumUtil.generateAddress(Math.floor(Math.random() * (100 - 0)));
        const addressHex = ethereumUtil.bufferToHex(addressBuffer);
        return ethereumUtil.toChecksumAddress(addressHex);
    }
}
