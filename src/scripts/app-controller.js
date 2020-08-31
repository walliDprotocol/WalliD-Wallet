'use strict'

import StateStore from './lib/store';
import Vault from './lib/vault'
import WalletController from './controllers/wallet'
import ConnectionsController from './controllers/connections'



export default class AppController {
    #store
    #vault;

    constructor() {
        console.log('NEW VAIL CONTroLER')
        this.#store = new StateStore({
            wallet: {},
            connections: []        
        })

        this.#vault = new Vault()

        this.initController()
    }

    initController() {
        this.#vault.loadFromLocalStorage()
    }

    //=============================================================================
    // APP CONTROLLER INTERFACE
    //=============================================================================

    getState() {
        let wallet = this.#store.getState().wallet

        return {
            initialized: !this.#vault.isEmpty(),
            unlocked: this.#vault.isUnlocked(),
            address: this.#vault.isUnlocked()? wallet.getAddress() : null
        }
    }

    createNewVault(mnemonic, password) {
        return Promise.resolve(this.#vault.createNewAndPersist(mnemonic, password))
    }

    resetVault(password, force = false) {
        if(force) {
            return Promise.resolve(this.#vault.fullReset())
                .then(() => this.#store.putState({ wallet: {}, connections: [] }))
        }
        else {
            return Promise.resolve(this.#vault.submitPassword(password))
                .then(this.#vault.fullReset())
                .then(() => this.#store.putState({ wallet: {}, connections: [] }))
        }
    }

    unlockApp(password) {
        if(this.#vault.isEmpty()) {
            return Promise.reject('Vault is empty!')
        }

        return Promise.resolve(this.#vault.unlock(password))
            .then(() => this.#store.updateState({ wallet: WalletController.deserialize(this.#vault.getWallet()) }))
            //.then(() => this.#connections = ConnectionsController.deserialize(this.#vault.getConnections()))
    }

    lockApp() {
        return Promise.resolve(this.#vault.lock())
            .then(() => this.#store.putState({ wallet: {}, connections: [] }))
    }

    verifyPassword(password) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#vault.submitPassword(password)

                resolve(true)
            }
            catch(error) {
                console.log('Cath erro ', error)

                resolve(false)
            }
        })
        
        return Promise.resolve(this.#vault.submitPassword(password))
            .then(Promise.resolve(true))
            .catch(e => { return Promise.resolve(false) })
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