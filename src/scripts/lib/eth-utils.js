'use strict'

const Web3 = require('web3')
const { ABI } = require('../resources/abi.json');

const web3 = new Web3(Web3.givenProvider);

export function setProvider(_provider) {
    return web3.setProvider(_provider)
}

export function abiEncode(types, data) {
    return web3.eth.abi.encodeParameters(types, data)
}

export function getdCANonce(address) {
    const WalliDV2dCA = new web3.eth.Contract(ABI.WalliDV2dCA, address);
    return Promise.resolve(WalliDV2dCA.methods.Nonce().call())
}