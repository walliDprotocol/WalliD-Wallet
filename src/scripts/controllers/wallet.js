import Wallet from 'ethereumjs-wallet'
import * as ethUtil from 'ethereumjs-util'
import * as ethSigUtil from 'eth-sig-util'
import { hdkey } from 'ethereumjs-wallet'
import * as bip39 from 'bip39'

/**
 *  WalletController
 * 
 *  Class is wrapper for Wallet:ethereumjs-wallet
 *  Adds cryptographic capabilities to Wallet:
 *    - Sign Ethereum Transactions
 *    - Sign Messages
 *    - Encrypt/decrypt typed data objects
 */

export default class WalletController {
    static HDPath = `m/44'/60'/0'/0`
    #wallet; //instance of 'ethereumjs-wallet' class

    constructor(wallet) {
        if(!wallet) {
            throw new Error("An ethereumjs-wallet instance must be provided to the constructor")
        }

        this.#wallet = wallet
    }

    serialize() {
        if(!this.#wallet) {
            return undefined
        }

        return this.#wallet.getPrivateKey().toString('hex')
    }

    static deserialize(_pk) {
        let pk = Buffer.from(_pk, 'hex')

        return new WalletController(Wallet.fromPrivateKey(pk))
    }

    static initFromMnemonic(mnemonic) {
        const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex')
        const hdwallet = hdkey.fromMasterSeed(seed)
        const root = hdwallet.derivePath(this.HDPath)
        const firstChild = root.deriveChild(1)

        return new WalletController(firstChild.getWallet())
    }

    // Returns
    getAddress() {
        return this.#wallet.getAddress().toString('hex')
    }

    // tx is an instance of 'ethereumjs-transaction' class
    signEthereumTransaction(tx) {
        const privateKey = this.#wallet.getPrivateKey()
        tx.sign(privateKey)
        
        return Promise.resolve(tx)
    }

    signMessage (address, data, opts = {}) {
        const message = ethUtil.stripHexPrefix(data)
        const privateKey = this.#wallet.getPrivateKey()
        const msgSig = ethUtil.ecsign(Buffer.from(message, 'hex'), privateKey)
        const rawMsgSig = ethSigUtil.concatSig(msgSig.v, msgSig.r, msgSig.s)
        
        return Promise.resolve(rawMsgSig)
    }

    encryptData(data) {
        const publicKey = this.#wallet.getPublicKey()
        const enc = ethSigUtil.encrypt(publicKey, { data }, 'x25519-xsalsa20-poly1305')
        
        return Promise.resolve(enc)
    }

    decryptData(encryptedData) {
        const privateKey = ethUtil.stripHexPrefix(this.#wallet.getPrivateKey())
        const data = ethSigUtil.decrypt(encryptedData, privateKey)
        
        return Promise.resolve(data)
    }
}