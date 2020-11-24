import Wallet from "ethereumjs-wallet";
import * as ethUtil from "ethereumjs-util";
import * as ethSigUtil from "eth-sig-util";
import { hdkey } from "ethereumjs-wallet";
import * as bip39 from "bip39";
import { getdCANonce, abiEncode } from "../lib/eth-utils";

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
	static HDPath = `m/44'/60'/0'/0`;
	#wallet; //instance of 'ethereumjs-wallet' class

	constructor(wallet) {
		if (!wallet) {
			throw new Error("An ethereumjs-wallet instance must be provided to the constructor");
		}
		this.#wallet = wallet;
	}

	serialize() {
		if (!this.#wallet) {
			return undefined;
		}
		return this.#wallet.getPrivateKey().toString("hex");
	}

	static deserialize(_pk) {
		let pk = Buffer.from(_pk, "hex");
			return new WalletController(Wallet.fromPrivateKey(pk));
		}
		static initFromMnemonic(mnemonic) {
		const seed = bip39.mnemonicToSeedSync(mnemonic).toString("hex");
		const hdwallet = hdkey.fromMasterSeed(seed);
		const root = hdwallet.derivePath(this.HDPath);
		const firstChild = root.deriveChild(1);
		return new WalletController(firstChild.getWallet());
	}

	// Returns
	getAddress() {
		return "0x" + this.#wallet.getAddress().toString("hex");
	}

	// tx is an instance of 'ethereumjs-transaction' class
	signEthereumTransaction(tx) {
		const privateKey = this.#wallet.getPrivateKey();
		tx.sign(privateKey);
		return Promise.resolve(tx);
	}

	signEthereumMessage(_message) {
		const message = ethUtil.stripHexPrefix(Buffer.from(_message));
		const privateKey = this.#wallet.getPrivateKey();
		const msgSig = ethSigUtil.personalSign(privateKey, { data: message });
		return Promise.resolve(msgSig);
	}

	verifyEthereumSignedMessage(message, signature) {
		const recovered = ethSigUtil.recoverPersonalSignature({
			data: message,
			sig: signature,
		});
		return Promise.resolve(recovered == this.getAddress());
	}

	signERC191Message = function(target, data) {
		return Promise.resolve(getdCANonce(target))
			.then(nonce => abiEncode(
				['bytes1', 'bytes1', 'address', 'bytes32', 'uint256'],
				['0x19', '0x00', target, data, nonce]
			))
			.then(encoded => ethUtil.keccak(Buffer.from(encoded.slice(2), 'hex')))
			.then(hash => ethUtil.stripHexPrefix(Buffer.from(hash)))
			.then(message => ethUtil.ecsign(Buffer.from(message), this.#wallet.getPrivateKey()))
			.then(({ v, r, s}) => Promise.resolve([data, v, '0x' + r.toString('hex'), '0x' + s.toString('hex')]))
	}

	signMessage() {
		const message = ethUtil.stripHexPrefix(Buffer.from(data));
		const privateKey = this.#wallet.getPrivateKey();
		const msgSig = ethUtil.ecsign(Buffer.from(message, "hex"), privateKey);
		const rawMsgSig = ethSigUtil.concatSig(msgSig.v, msgSig.r, msgSig.s);
		return Promise.resolve(rawMsgSig);
	}

	encryptData(data) {
		const privKey = ethUtil.toBuffer(this.#wallet.getPrivateKey());
		const publicKey = ethSigUtil.getEncryptionPublicKey(privKey);
		const cipher = ethSigUtil.encrypt(publicKey, { data }, "x25519-xsalsa20-poly1305");
		return Promise.resolve(cipher);
	}

	decryptData(cipher) {
		const privateKey = ethUtil.stripHexPrefix(this.#wallet.getPrivateKey());
		const data = ethSigUtil.decrypt(cipher, privateKey);
		return Promise.resolve(data);
	}
}