import * as bip39 from 'bip39'
import extension from 'extensionizer'
import passworder from 'browser-passworder'
import WalletController from '../controllers/wallet'
import ConnectionsController from '../controllers/connections'
import StateStore from './store'

/**
 * @class Vault
 * 
 * Class for managing plugin's local storage.
 * Stores WalliD user wallet data.
 */

export default class Vault {
    #store;
    #initState = {
        vault: {},
        data: {},
        unlocked: false,
        empty: true
    }

    constructor() {
        console.log('constructor')

        this.#store = new StateStore(this.#initState)
    }

    // Tries to load instance with encrypted vault data from local storage, if available
    loadFromLocalStorage() {
        console.log('loadFromLocalStorage')
        return Promise.resolve(this.#store.getLocal('vault'))
            .then(vault => vault? this.#store.updateState({ vault, empty: false }) : undefined)
    }

    // Creates and a persists a new vault to local storage. Overwrites any pre-existing data
    createNewAndPersist(mnemonic, password) {
        if(typeof password != 'string') {
            return Promise.reject("Vault password must be of type 'string'")
        }

        if(!bip39.validateMnemonic(mnemonic)) {
            return Promise.reject('Invalid mnemonic phrase')
        }

        return Promise.resolve(WalletController.initFromMnemonic(mnemonic))
            .then(wallet => passworder.encrypt(password, [wallet.serialize(),[]]))
            .then(vault => { this.#store.putLocal({ vault }); return vault })
            .then(vault => this.#store.putState({ vault, unlocked: false, empty: false }))
            //DEBUG LINE
            .then(() => console.log('New vault created and persisted to local storage', this.#store.getState().vault))
    }

    // Fully resets the vault. Clears local storage and returns instance to initial state
    fullReset() {
        return Promise.resolve(this.#store.putState(this.#initState))
            .then(() => this.#store.removeLocal('vault'))
            .then(() => console.log('full reset', this.#store.getState()))
    }

    // Locks vault. Clears all state data
    lock() {
        if(!this.isUnlocked()) {
            return Promise.resolve()
        }

        return Promise.resolve(this.#store.updateState({ 
            data: {},
            unlocked: false,
            empty: this.isEmpty()
        }))
    }

    // Tests provided password. Throws an error if @password is wrong
    unlock(password) {
        if(this.isUnlocked() || this.isEmpty()) {
            return Promise.resolve()
        }

        if(typeof password != 'string') {
            return Promise.reject("Vault password must be of type 'string'")
        }

        return Promise.resolve(this.submitPassword(password))  
            .then(data => this.#store.updateState({ data, unlocked: true }))
    }

    submitPassword(password) {
        if(this.isEmpty()) {
            return Promise.reject('Vault is empty!')
        }

        return Promise.resolve(this.#store.getState().vault)  
            .then(vault => passworder.decrypt(password, vault))
    }

    // Returns a new WalletController instance initialized with the vault's data
    getWallet() {
        return this._getData(0)
    }

    // Returns a new ConnectionsController instance initialized with the vault's data
    getConnections() {
        return this._getData(1)
    }

    isUnlocked() {
        return this.#store.getState().unlocked
    }

    isEmpty() {
        return this.#store.getState().empty
    }

    _getData(index) {
        if(!this.isUnlocked() || this.isEmpty()) {
            return undefined
        }

        return this.#store.getState().data[index]
    }
}