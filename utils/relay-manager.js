//const ps = require('ps-node');
const { signOffchain } = require("./utilities.js");
const { ethers, waffle } = require("hardhat");

class RelayManager{
    constructor(_relayer = null, _network = 'ganache') {
        this.network = _network;
        this.relayer = _relayer;
    }
    async getCurrentBlock() {
        let block = await waffle.provider.getBlockNumber();
        return block;
    }

    async getTimestamp(blockNumber) {
        let block = await waffle.provider.getBlock(blockNumber);
        return block.timestamp;
    }

    async getNonceForRelay() {
        let block = await waffle.provider.getBlockNumber();
        let timestamp = (new Date()).getTime();
        return '0x' + ethers.utils.hexZeroPad(ethers.utils.hexlify(block), 16).slice(2) + ethers.utils.hexZeroPad(ethers.utils.hexlify(timestamp), 16).slice(2);
    }

    async relay(_target, _method, _wallet, _signers, _relayer = this.relayer, _gasLimit = 700000) {
        const nonce = await this.getNonceForRelay();
        const signatures = await signOffchain(_signers, _target.address, _wallet.address, 0, _method, nonce, 0, _gasLimit);
        const tx = await _target.connect(_relayer).execute(_wallet.address, _method, nonce, signatures, 0, _gasLimit, { gasLimit: _gasLimit });
        const txReceipt = await tx.wait();
        return txReceipt;
    }


    async increaseTime(seconds) {
        await waffle.provider.send('evm_increaseTime', seconds);
        await waffle.provider.send('evm_mine');
    }
}

module.exports = RelayManager;