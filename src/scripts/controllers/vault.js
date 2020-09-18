import * as bip39 from 'bip39'
import passworder from 'browser-passworder'
import WalletController from './wallet'
import StateStore from '../lib/store'


const InitState = {
    vault: {},
    data: {},
    unlocked: false,
    empty: true
}

/**
 * @class Vault
 * 
 * Class for managing plugin's local storage.
 * Stores WalliD user wallet data.
 */

export default class Vault {
    #store;

    constructor() {
        this.#store = new StateStore(InitState)
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
            .then(wallet => Promise.resolve([wallet.serialize(), mnemonic, []]))
            .then(data => passworder.encrypt(password, data))
            .then(vault => { this.#store.putLocal({ vault }); return vault })
            .then(vault => this.#store.putState({ vault, unlocked: false, empty: false }))
            //DEBUG LINE
            .then(() => console.log('New vault created and persisted to local storage', this.#store.getState().vault))
    }

    // Fully resets the vault. Clears local storage and reverts instance to initial state
    fullReset() {
        return Promise.resolve(this.#store.putState(InitState))
            .then(() => this.#store.removeLocal('vault'))
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

    // Tests @password. Throws an error if @password is wrong
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

    // Returns serialized WalletController
    getWallet() {
        return this._getData(0)
    }

    getMnemonic() {
        return this._getData(1)
    }

    // Returns serialized ConnectionsController
    getConnections() {
        return this._getData(2)
    }

    // Updates vault with @conns
    putConnections(conns, password) {
        console.log('putConnections')
        return Promise.resolve(this.submitPassword(password))
            .then(data => { data[2] = conns; return data })
            .then(data => passworder.encrypt(password, data).then(vault => Promise.resolve({ data, vault })))
            .then(_data => {
                this.#store.updateState({
                    vault: _data.vault,
                    unlocked: this.isUnlocked(),
                    data: this.isUnlocked()? _data.data : null
                })

                return _data.vault
            })
            .then(vault => this.#store.putLocal({ vault }))
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

        return index != undefined? this.#store.getState().data[index] : this.#store.getState().data
    }
}