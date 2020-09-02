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
    connections: [],
    api: {},
    password: '',
}

const RequestAPIMethods = [
    'wallid_sign_token',
    'wallid_token',
    'wallet_encrypt',
    'wallet_decrypt',
    'getAddress'
]

export default class AppController {
    #store
    #vault;

    constructor() {
        console.log('NEW APP CONTroLER')
        this.#store = new StateStore(InitState)

        this.#vault = new Vault()

        this.initController()
    }

    initController() {
        this.#vault.loadFromLocalStorage()
        this.#store.updateState({ api: new ExternalAPIController() })
    }

    //=============================================================================
    // APP CONTROLLER INTERFACE
    //=============================================================================

    getState() {
        let wallet = this.#store.getState().wallet

        return {
            initialized: !this.#vault.isEmpty(),
            unlocked: this.#vault.isUnlocked(),
            address: this.#vault.isUnlocked()? wallet.getAddress() : undefined,
            mnemonic: this.#vault.getMnemonic()
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
            .then(() => this.#store.updateState({ api: new ExternalAPIController(WalletController.deserialize(this.#vault.getWallet()), ConnectionsController.deserialize(this.#vault.getConnections())) }))
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

    newConnection() {
        return Promise.resolve(this.#store.getState().connections)
            .then(conn => {

            })
    }

    removeConnection() {

    }

    approveConnection() {

    }

    //=============================================================================
    // EXTERNAL REQUEST API
    //=============================================================================

    requestAPI(method, params) {
        if(!RequestAPIMethods.includes(method)) {
            return Promise.reject('Invalid method call')
        }
 
        return Promise.resolve(this.#store.getState().api.getAddress())
    }

    //=============================================================================
    // EXPOSED TO THE UI SUBSYSTEM
    //=============================================================================

    /**
     * Returns an object with the controller's functions.
     * Expose the controller functionalities to the UI susbsystem.  
     * 
     * @returns {Object} - api
     */
    getAPI() {
        return {
            getState: this.getState.bind(this),
            createNewVault: this.createNewVault.bind(this),
            resetVault: this.resetVault.bind(this),
            unlockApp: this.unlockApp.bind(this),
            lockApp: this.lockApp.bind(this),
            verifyPassword: this.verifyPassword.bind(this)
        }
    }
}