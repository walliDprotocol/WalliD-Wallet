const Web3 = require('web3')
const { ABI } = require('../resources/abi.json');
const InfuraHTTPSProvider = "https://rinkeby.infura.io/v3/96f71504c4da4ad5b87e567aa3a79c9b"

const web3 = new Web3(new Web3.providers.HttpProvider(InfuraHTTPSProvider));

export function abiEncode(types, data) {
    return web3.eth.abi.encodeParameters(types, data)
}

export function getdCANonce(address) {
    const WalliDV2dCA = new web3.eth.Contract(ABI.WalliDV2dCA, address);
    return Promise.resolve(WalliDV2dCA.methods.Nonce().call())
}