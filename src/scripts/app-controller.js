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
    #vault;

    constructor() {
        console.log('NEW APP CONTroLER')
        this.initController()
    }

    initController() {
        this.#store = new StateStore(InitState)
        this.#vault = new Vault()

        this.#vault.loadFromLocalStorage()

        this.#store.updateState({
            //vault: new Vault(),
            api: new ExternalAPIController()
        })

        //this.#store.getState().vault.loadFromLocalStorage()
    }

    //=============================================================================
    // APP CONTROLLER INTERFACE
    //=============================================================================

    getState() {
        const wallet = this.#store.getState().wallet
        const connections = this.#store.getState().connections

        console.log('getState()',  {
            initialized: !this.#vault.isEmpty(),
            unlocked: this.#vault.isUnlocked(),
            address: this.#vault.isUnlocked()? wallet.getAddress() : undefined,
            connections: this.#vault.isUnlocked()? connections.getConnected() : undefined,
            mnemonic: this.#vault.isUnlocked()? this.#vault.getMnemonic() : undefined
        })

        return {
            initialized: !this.#vault.isEmpty(),
            unlocked: this.#vault.isUnlocked(),
            address: this.#vault.isUnlocked()? wallet.getAddress() : undefined,
            connections: this.#vault.isUnlocked()? connections.getConnected() : undefined,
            mnemonic: this.#vault.isUnlocked()? this.#vault.getMnemonic() : undefined
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
     * If vault not unlocked, promise is rejected.
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
        return Promise.resolve(this.#vault.createNewAndPersist(mnemonic, password))
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
    resetVault(password) {
        return Promise.resolve(this.#vault.submitPassword(password))
            .then(this.#vault.fullReset())
            .then(() => this.#store.putState({ wallet: {}, connections: [] }))
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
        if(this.#vault.isEmpty()) {
            return Promise.reject('Vault is empty!')
        }

        return Promise.resolve(this.#vault.unlock(password))
            .then(() => this.#store.updateState({
                wallet: WalletController.deserialize(this.#vault.getWallet()),
                connections: ConnectionsController.deserialize(this.#vault.getConnections()),
                password
            }))
            .then(() => this.#store.updateState({ api: new ExternalAPIController(this.#store.getState().wallet, this.#store.getState().connections) }))
    }

    /**
     * Locks the app and clears app's runtime state.
     * App's state is wiped clean and vault is locked.
     * 
     * @returns {Promise}
     */
    lockApp() {
        return Promise.resolve(this.#vault.lock())
            .then(() => this.#store.putState(InitState))
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
        return Promise.resolve(this.#vault.submitPassword(password))
            .then(() => Promise.resolve(true))
            .catch(() => Promise.resolve(false))
    }

    //
    //  CONNECTIONS MANAGEMENT FUNCTIONS
    //
    approvePendingConnection(url) {
        if(!this.#vault.isUnlocked()) {
            return Promise.reject('Plugin is locked')
        }

        return Promise.resolve(this.#store.getState().connections)
            .then(conn => conn.approvePending(url).then(() => Promise.resolve(conn)))
            .then(console.log('PASSWORD', this.#store.password))
            .then(conn => this.#vault.putConnections(conn.serialize(), this.#store.getState().password))
    }

    rejectPendingConnection(url) {
        if(!this.#vault.isUnlocked()) {
            return Promise.reject('Plugin is locked')
        }

        return Promise.resolve(this.#store.getState().connections)
            .then(conn => conn.rejectPending(url))
    }

    removeConnected(url) {
        if(!this.#vault.isUnlocked()) {
            return Promise.reject('Plugin is locked')
        }

        return Promise.resolve(this.#store.getState().connections)
            .then(conn => conn.removeConnected(url).then(Promise.resolve(conn)))
            .then(conn => this.#vault.putConnections(conn.serialize(), this.#store.getState().password))
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
        const api = this.#store.getState().api

        if(!api.isValidMethod(method)) {
            return Promise.reject('Invalid method call')
        }

        if(!this.#vault.isUnlocked()) {
            return Promise.reject('Plugin is locked')
        }
        
        return Promise.resolve(this.#store.getState().api.getAddress())
    }
}