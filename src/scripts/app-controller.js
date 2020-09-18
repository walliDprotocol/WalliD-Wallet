'use strict'

import extension from 'extensionizer'
import StateStore from './lib/store';
import Vault from './lib/vault'
import seed from './lib/seed-phrase'
import WalletController from './controllers/wallet'
import ConnectionsController from './controllers/connections'
import { RequestAPIController } from './controllers/requests'


const InitState = {
    wallet: {},
    connections: {},
    password: '',
    popups : []
}

export default class AppController {
    #store

    constructor() {
        console.log('NEW APP CONTroLER')

        this.#store = new StateStore(InitState)

        this.#store.updateState({
            vault: new Vault(),
            api: new RequestAPIController()
        })

        this.#store.getState().vault.loadFromLocalStorage()
    }

    //=============================================================================
    // APP CONTROLLER INTERFACE
    //=============================================================================

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
     * Resets the vault and clears plugin's local storage.
     * This action is definitive. All plugin data is permanently lost.
     * Throws error if plugin is locked.
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
     * @param {string} password 
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
     * @param {string} password
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
     * Promise rejects if a connection with same @url already exists, or if vault is locked.
     * 
     * @param {string} url - Identifier of the pendding connection
     * 
     * @returns {Promise} - result
     */
    approveConnection(url) {
        const vault = this.#store.getState().vault
        const connections = this.#store.getState().connections

        if(!vault.isUnlocked()) {
            return Promise.reject('Plugin is locked')
        }

        return Promise.resolve(connections.addConnected(url))
            .then(vault.putConnections(connections.serialize(), this.#store.getState().password))
    }

    /**
     * Removes connection identified by @url from list of connected websites.
     * Promise rejects if @url does not match any approved connections, or if vault is locked.
     * 
     * @param {string} url - Identifier of the pendding connection
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

    //
    // WALLET INTERFACE
    //

    encryptData(data) {
        const vault = this.#store.getState().vault
        const wallet = this.#store.getState().wallet

        if(!vault.isUnlocked()) {
            return Promise.reject('Plugin is locked')
        }

        return wallet.encryptData(data)
    }

    decryptData(data) {
        const vault = this.#store.getState().vault
        const wallet = this.#store.getState().wallet

        if(!vault.isUnlocked()) {
            return Promise.reject('Plugin is locked')
        }

        return wallet.decryptData(data)
    }


    /**
     * Pops and returns the next request on queue.
     *
     * @returns {Array} request - Request object with format { <type> <data> <callback> }
     */
    getNextRequest() {
        const api = this.#store.getState().api
        return api.getNextRequest()
    }

    /**
     * Returns the window ID of currently open popups.
     * 
     * @returns {Array} popups - List of currentlu active popups' IDs
     */
    getActivePopups() {
        return this.#store.getState().popups
    }

    //=============================================================================
    // EXPOSED TO THE UI SUBSYSTEM
    //=============================================================================

    getState() {
        const vault = this.#store.getState().vault
        const wallet = this.#store.getState().wallet
        const connections = this.#store.getState().connections

        console.log('getState()',  {
            initialized: !vault.isEmpty(),
            unlocked: vault.isUnlocked(),
            address: vault.isUnlocked()? wallet.getAddress() : null,
            connections: vault.isUnlocked()? connections.getAllConnections() : null,
            mnemonic: vault.isUnlocked()? vault.getMnemonic() : null
        })

        return {
            initialized: !vault.isEmpty(),
            unlocked: vault.isUnlocked(),
            address: vault.isUnlocked()? wallet.getAddress() : null,
            connections: vault.isUnlocked()? connections.getAllConnections() : null,
            mnemonic: vault.isUnlocked()? vault.getMnemonic() : null
        }
    }

    /**
     * Returns an object with the controller's functions.
     * Exposes the controller's functionalities to the UI subsystem.  
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
            removeConnected: this.removeConnected.bind(this),
            encryptData: this.encryptData.bind(this),
            decryptData: this.decryptData.bind(this),
            getNextRequest: this.getNextRequest.bind(this)
        }
    }

    //=============================================================================
    // EXTERNAL REQUEST API
    //=============================================================================

    requestAPI(method, params) {
        const api = this.#store.getState().api

        const promise = api.pushNewRequest(method, params)

        if(api.isPopup(method)) {
            const updateActivePopups = function(id) {
                let popups = this.#store.getState().popups
                popups.push(id)
                this.#store.updateState({ popups })
            }.bind(this)

            extension.windows.create({
                url: extension.runtime.getURL("notification.html"),
                type: "popup",
                width: 360,
                height: 550
            }, win => updateActivePopups(win.id))
        }
        else {
            api.executeMethod(method)
        }

        return promise
    }
}