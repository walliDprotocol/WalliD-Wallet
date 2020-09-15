'use strict'

import StateStore from './lib/store';
import Vault from './lib/vault'
import seed from './lib/seed-phrase'
import WalletController from './controllers/wallet'
import ConnectionsController from './controllers/connections'
import { ExternalAPIController } from './controllers/api'
import { mnemonicToSeedSync } from 'bip39';


const InitState = {
    wallet: {},
    connections: {},
    api: {},
    password: '',
}

export default class AppController {
    #store

    constructor() {
        console.log('NEW APP CONTroLER')

        this.#store = new StateStore(InitState)

        this.#store.updateState({
            vault: new Vault(),
            api: new ExternalAPIController()
        })

        this.#store.getState().vault.loadFromLocalStorage()
    }

    //=============================================================================
    // APP CONTROLLER INTERFACE
    //=============================================================================

    getState() {
        const vault = this.#store.getState().vault
        const wallet = this.#store.getState().wallet
        const connections = this.#store.getState().connections

        console.log('getState()',  {
            initialized: !vault.isEmpty(),
            unlocked: vault.isUnlocked(),
            address: vault.isUnlocked()? wallet.getAddress() : undefined,
            connections: vault.isUnlocked()? connections.getConnected() : undefined,
            mnemonic: vault.isUnlocked()? vault.getMnemonic() : undefined
        })

        return {
            initialized: !vault.isEmpty(),
            unlocked: vault.isUnlocked(),
            address: vault.isUnlocked()? wallet.getAddress() : undefined,
            connections: vault.isUnlocked()? connections.getConnected() : undefined,
            mnemonic: vault.isUnlocked()? vault.getMnemonic() : undefined
        }
    }

    //
    //  ONBOARDING FUNCTIONS
    //

    /**
     * Returns a randomly generated, 12 word mnemonic phrase according to BIP39.
     * 
     * @returns {string} - seedphrase
     */
    generateSeedPhrase() {
        return seed.generate()
    }

    /**
     * Checks if provided string matches the currently stored mnemonic phrase.
     * Validates string against BIP39.
     * Promise rejects if vault is locked.
     * 
     * @param {string} - test
     * 
     * @returns {Promise<boolean>} - valid
     */
    validateSeedPhrase(test) {
        if(!this.isUnlocked()){
            Promise.reject('Vault is locked')
        }

        let mnemonic = this.#store.getState().mnemonic

        return Promise.resolve(seed.validate(test) && mnemonic == test)
    }

    //
    //  WALLET MANAGEMENT FUNCTIONS
    //

    //
    //  VAULT MANAGEMENT FUNCTIONS
    //

    /**
     * Creates a new vault with @password, persisting it to local storage.
     * Creates a new wallet from the provided @mnemonic.
     * Overwrites any pre-existing data.
     * 
     * @param {string} - mnemonic 
     * @param {string} - password 
     * 
     * @returns {Promise}
     */
    createNewVault(mnemonic, password) {
        const vault = this.#store.getState().vault
        return Promise.resolve(vault.createNewAndPersist(mnemonic, password))
    }

    /**
     * Tries to remove vault data from  a new vault with @password, persisting it to local storage.
     * Creates a new wallet from the provided @mnemonic.
     * Throws error if provided password is incorrect.
     * 
     * @param {string} - password 
     * 
     * @returns {Promise}
     */
    resetVault() {
        const vault = this.#store.getState().vault
        
        if(!vault.isUnlocked()){
            Promise.reject('Vault is locked')
        }

        return Promise.resolve(vault.submitPassword(this.#store.getState().password))
            .then(vault.fullReset())
            .then(() => this.#store.updateState(InitState))
    }

    /**
     * Tries to unlock the App with provided password.
     * Loads wallet, connections and password to runtime state.
     * Throws error if provided password is incorrect.
     * 
     * @param {string} - password 
     * 
     * @returns {Promise}
     */
    unlockApp(password) {
        const vault = this.#store.getState().vault
 
        if(vault.isEmpty()) {
            return Promise.reject('Vault is empty!')
        }

        return Promise.resolve(vault.unlock(password))
            .then(() => this.#store.updateState({
                wallet: WalletController.deserialize(vault.getWallet()),
                connections: ConnectionsController.deserialize(vault.getConnections()),
                password
            }))
            .then(() => this.#store.updateState({
                api: new ExternalAPIController(this.#store.getState().wallet, this.#store.getState().connections)
            }))
    }

    /**
     * Locks the app and clears app's runtime state.
     * App's state is wiped clean and vault is locked.
     * 
     * @returns {Promise}
     */
    lockApp() {
        console.log('lockAPP')
        const vault = this.#store.getState().vault
        return Promise.resolve(vault.lock())
            .then(() => this.#store.updateState(InitState))
    }

    /**
     * Tries to unlock vault with @password.
     * Resolves to true in case password is valid and to false otherwise.
     * 
     * @param {string} - password
     * 
     * @returns {Promise<boolean>} - verified
     */
    verifyPassword(password) {
        const vault = this.#store.getState().vault
        return Promise.resolve(vault.submitPassword(password))
            .then(() => Promise.resolve(true))
            .catch(() => Promise.resolve(false))
    }


    //
    //  CONNECTIONS MANAGEMENT FUNCTIONS
    //

    /**
     * Approves a pending connection request.
     * Promise rejects if @url does not match any pending connections, or if vault is locked.
     * 
     * @param {string} - url Identifier of the pendding connection
     * 
     * @returns {Promise} - result
     */
    approvePendingConnection(url) {
        const vault = this.#store.getState().vault
        const connections = this.#store.getState().connections

        if(!vault.isUnlocked()) {
            return Promise.reject('Plugin is locked')
        }

        return Promise.resolve(connections.approvePending(url))
            .then(vault.putConnections(connections.serialize(), this.#store.getState().password))
    }

    /**
     * Rejects a pending connection request.
     * Promise rejects if @url does not match any pending connections, or if vault is locked.
     * 
     * @param {string} - url Identifier of the pendding connection
     * 
     * @returns {Promise} - result
     */
    rejectPendingConnection(url) {
        const vault = this.#store.getState().vault
        const connections = this.#store.getState().connections

        if(!vault.isUnlocked()) {
            return Promise.reject('Plugin is locked')
        }

        return Promise.resolve(connections.rejectPending(url))
    }

    /**
     * Removes connection identified by @url from list of connected websites.
     * Promise rejects if @url does not match any approved connections, or if vault is locked.
     * 
     * @param {string} - url Identifier of the pendding connection
     * 
     * @returns {Promise} - result
     */
    removeConnected(url) {
        const vault = this.#store.getState().vault
        const connections = this.#store.getState().connections

        if(!vault.isUnlocked()) {
            return Promise.reject('Plugin is locked')
        }

        return Promise.resolve(connections.removeConnected(url))
            .then(vault.putConnections(connections.serialize(), this.#store.getState().password))
    }

    //=============================================================================
    // EXPOSED TO THE UI SUBSYSTEM
    //=============================================================================

    /**
     * Returns an object with the controller's functions.
     * Expose the controller functionalities to the UI subsystem.  
     * 
     * @returns {Object} - api
     */
    getAPI() {
        return {
            getState: this.getState.bind(this),
            generateSeedPhrase: this.generateSeedPhrase.bind(this),
            validateSeedPhrase: this.validateSeedPhrase.bind(this),
            createNewVault: this.createNewVault.bind(this),
            resetVault: this.resetVault.bind(this),
            verifyPassword: this.verifyPassword.bind(this),
            unlockApp: this.unlockApp.bind(this),
            lockApp: this.lockApp.bind(this),
            newConnection: this.newPendingConnection.bind(this),
            approvePendingConnection: this.approvePendingConnection.bind(this),
            rejectPendingConnection: this.rejectPendingConnection.bind(this),
            removeConnected: this.removeConnected.bind(this)
        }
    }

    newPendingConnection(url, icon, name, description) {
        console.log('newnewPendingConnection')
        return Promise.resolve(this.#store.getState().connections)
            .then(conn => conn.newConnection(url, icon, name, description))
    }

    //=============================================================================
    // EXTERNAL REQUEST API
    //=============================================================================

    requestAPI(method, params) {
        const vault = this.#store.getState().vault
        const api = this.#store.getState().api

        if(!vault.isUnlocked()) {
            return Promise.reject('Plugin is locked')
        }
    
        if(!api.isValidMethod(method)) {
            return Promise.reject('Invalid method call')
        }
        
        return Promise.resolve(api.getAddress())
    }
}