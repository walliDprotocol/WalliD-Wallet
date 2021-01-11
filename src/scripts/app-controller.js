"use strict";

import StateStore from "./lib/store";
import * as seed from "./lib/seed-phrase";
import { getRequestDetails } from "./lib/requests";
import * as WalliD from "./lib/wallid";
import launchNotificationPopup from "./lib/launch-notification-popup";
import { eventPipeIn } from "./lib/event-pipe";
import VaultController from "./controllers/vault";
import WalletController from "./controllers/wallet";
import ConnectionsController from "./controllers/connections";
import IdentitiesController from "./controllers/identities";
import CredentialsController from "./controllers/credentials";
import ConfigurationsController from "./controllers/configuration";
import { setProvider } from "./lib/eth-utils";

const InitState = {
  wallet: {},
  connections: {},
  identities: {},
  credentials: {},
  configurations: {},
  password: "",
  popups: [],
  requests: [],
};

export default class AppController {
  #store;

  constructor() {
    console.log("NEW APP CONTroLER");
    this.#store = new StateStore(InitState);
    const vault = new VaultController();
    vault.loadFromLocalStorage();
    this.#store.updateState({ vault });
  }

  //=============================================================================
  // APP CONTROLLER INTERFACE
  //=============================================================================

  //
  // ONBOARDING RELATED METHODS
  //

  /**
   * Returns a randomly generated, 12 word mnemonic phrase according to BIP39.
   *
   * @returns {string} - seedphrase
   */
  generateSeedPhrase() {
    return seed.generate();
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
    if (!this.isUnlocked()) {
      Promise.reject("Vault is locked");
    }
    let mnemonic = this.#store.getState().mnemonic;
    return Promise.resolve(seed.validate(test) && mnemonic == test);
  }

  //
  // VAULT CONTROLLER INTERFACE
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
    const vault = this.#store.getState().vault;
    return Promise.resolve(vault.createNewAndPersist(mnemonic, password))
      .then(() => {
        eventPipeIn("wallid_wallet_created");
      })
      .catch((err) => console.error(err));
  }

  /**
   * Resets the vault and clears plugin's local storage.
   * This action is definitive. All plugin data is permanently lost.
   * Throws error if plugin is locked.
   *
   * @returns {Promise}
   */
  resetVault() {
    const vault = this.#store.getState().vault;
    if (!vault.isUnlocked()) {
      Promise.reject("Vault is locked");
    }
    return Promise.resolve(
      vault.submitPassword(this.#store.getState().password)
    )
      .then(vault.fullReset())
      .then(() => this.#store.updateState(InitState));
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
    const vault = this.#store.getState().vault;
    if (vault.isEmpty()) {
      return Promise.reject("Vault is empty!");
    }
    return Promise.resolve(vault.unlock(password))
      .then(() =>
        this.#store.updateState({
          wallet: WalletController.deserialize(vault.getWallet()),
          connections: ConnectionsController.deserialize(
            vault.getConnections()
          ),
          identities: IdentitiesController.deserialize(vault.getIdentities()),
          credentials: CredentialsController.deserialize(
            vault.getCredentials()
          ),
          configurations: new ConfigurationsController(),
          password,
        })
      )
      .then(() => setProvider(this.#store.getState().configurations.getProvider()))
      .then(() => eventPipeIn("wallid_event_unlock"))
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   * Locks the app and clears app's runtime state.
   * App's state is wiped clean and vault is locked.
   *
   * @returns {Promise}
   */
  lockApp() {
    const vault = this.#store.getState().vault;
    return Promise.resolve(vault.lock())
      .then(() => this.#store.updateState(InitState))
      .then(() => eventPipeIn("wallid_event_lock"));
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
    const vault = this.#store.getState().vault;
    return Promise.resolve(vault.submitPassword(password))
      .then(() => Promise.resolve(true))
      .catch(() => Promise.resolve(false));
  }

  //
  // CONNECTIONS CONTROLLER INTERFACE
  //
  /**
   * Approves a pending connection request.
   * Promise rejects if a connection with same @url already exists, or if vault is locked.
   *
   * @param {string} url - Identifier of the pendding connection
   *
   * @returns {Promise} - result
   */
  approveConnection(url, icon, name) {
    const vault = this.#store.getState().vault;
    const connections = this.#store.getState().connections;
    if (!vault.isUnlocked()) {
      return Promise.reject("ERR_PLUGIN_LOCKED");
    }
    return Promise.resolve(connections.addConnected(url, icon, name))
      .then(
        vault.putConnections(
          connections.serialize(),
          this.#store.getState().password
        )
      )
      .then(() => eventPipeIn("wallid_wallet_connected"));
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
    const vault = this.#store.getState().vault;
    const connections = this.#store.getState().connections;
    if (!vault.isUnlocked()) {
      return Promise.reject("ERR_PLUGIN_LOCKED");
    }
    return Promise.resolve(connections.removeConnected(url)).then(
      vault.putConnections(
        connections.serialize(),
        this.#store.getState().password
      )
    );
  }
  /**
   *
   * @param {function} f - callback function
   */
  currentTab(f) {
    var query = { active: true, lastFocusedWindow: true };
    function callback(tabs) {
      var currentTab = tabs[0]; // there will be only one in this array
      f(currentTab);
    }
    chrome.tabs.query(query, callback);
  }

  //
  // CRYPTOGRAPHIC INTERFACE
  //

  /**
   * Signs @data using wallet.
   * Rejects if plugin is locked.
   *
   * @param {*} data - JSON serializable object to be encrypted
   *
   * @returns {Promise<Object>} cipher - Sign data
   */
  signPrivateKey(data) {
    const vault = this.#store.getState().vault;
    const wallet = this.#store.getState().wallet;
    if (!vault.isUnlocked()) {
      return Promise.reject("ERR_PLUGIN_LOCKED");
    }
    return wallet.signEthereumMessage(JSON.stringify(data));
  }

  /**
   * Encrypts @data using wallet.
   * Rejects if plugin is locked.
   *
   * @param {*} data - JSON serializable object to be encrypted
   *
   * @returns {Promise<Object>} cipher - Ciphered data
   */
  encryptData(data) {
    const vault = this.#store.getState().vault;
    const wallet = this.#store.getState().wallet;
    if (!vault.isUnlocked()) {
      return Promise.reject("ERR_PLUGIN_LOCKED");
    }
    return wallet.encryptData(JSON.stringify(data));
  }

  /**
   * Tries to decrypt @data using wallet.
   * Rejects if plugin is locked.
   *
   * @param {Object} data - Data as returned by <eth-sig-util>.encrypt method
   *
   * @returns {Promise<*>} cipher - Decrypted JSON serializable data
   */
  decryptData(data) {
    const vault = this.#store.getState().vault;
    const wallet = this.#store.getState().wallet;
    if (!vault.isUnlocked()) {
      return Promise.reject("ERR_PLUGIN_LOCKED");
    }
    return wallet.decryptData(data);
  }

  /**
   * Generates an ERC191 signature using local wallet.
   * Reject if plugin is locked.
   *
   * @param {*} data - JSON serializable object to be encrypted
   *
   * @returns {Promise<Object>} cipher - Ciphered data
   */
  generateERC191Signature(target, data) {
    const vault = this.#store.getState().vault;
    const wallet = this.#store.getState().wallet;
    if (!vault.isUnlocked()) {
      return Promise.reject("ERR_PLUGIN_LOCKED");
    }
    return wallet.signERC191Message(target, data);
  }

  /**
   * Generates an eliptic curve signature using wallet.
   * Resolve if plugin is locked.
   *
   * @param {string} data - 32 byte hexadecimal string without '0x' prefix
   *
   * @returns {Promise<Object>} signature - signed data
   */
  generateECSignature(data) {
    const vault = this.#store.getState().vault;
    const wallet = this.#store.getState().wallet;
    if (!vault.isUnlocked()) {
      return Promise.reject("ERR_PLUGIN_LOCKED");
    }
    return wallet.signECMessage(data);
  }
  //
  // WALLID RELATED METHODS
  //

  /**
   * Returns WalliD authorization token ready for use with WalliD API.
   * Rejects with HTTP status code from server if request fail.
   *
   * @param {string} idt
   * @param {string} operation
   */
  getAuthorizationToken() {
	const wallet = this.#store.getState().wallet;
	return Promise.resolve(WalliD.getAuthenticationChallenge(wallet.getAddress()))
		.then(({ ok, status, body }) => ok? 
			wallet.signECMessage(body.challenge)
				.then(signature => WalliD.buildAuthorizationToken_v1(body.challenge, signature))
			: Promise.reject({ status, error: 'ERR_AUTH_TOKEN', message: body? body.message : null })
		);
  }

  /**
   * Retrieves WalliD user's identity data.
   * Rejects with HTTP status code from server if identity doesn't exists, or request fail.
   *
   * @param {string} auth_token - WalliD authorization token
   */
  extractIdentityData_v1(auth_token) {
    return Promise.resolve(
      WalliD.extractIdentity(auth_token)
    ).then(({ ok, status, body }) =>
      ok && status != 202 ? Promise.resolve(body.data) : Promise.reject(status)
    );
  }

  /**
   * Imports a new identity of type @idt into WalliD Plugin.
   *
   * @param {string} idt - WalliD identity type tag
   * @param {string} data - encrypted identity data
   * @param {*} ow - overwrite flag
   */
  importIdentity_v2(idt, data, ow = false, expDate) {
    const vault = this.#store.getState().vault;
    if (!vault.isUnlocked()) {
      return Promise.reject("ERR_PLUGIN_LOCKED");
    }
    const identities = this.#store.getState().identities;
    return Promise.resolve(identities.addIdentity(idt, data, ow, expDate)).then(
      vault.putIdentities(
        identities.serialize(),
        this.#store.getState().password
      )
    );
  }

  /**
   * Imports a new credential with @id into WalliD Plugin.
   *
   * @param {string} id - WalliD credential id
   * @param {string} data - encrypted credential data
   * @param {*} ow - overwrite flag
   */
  importCredential(
    id,
    credName,
    caName,
    photoURL,
    userData,
    status,
    ow = false,
    expDate
  ) {
    const vault = this.#store.getState().vault;
    if (!vault.isUnlocked()) {
      return Promise.reject("ERR_PLUGIN_LOCKED");
    }
    const credentials = this.#store.getState().credentials;
    return Promise.resolve(
      credentials.addCredential(
        id,
        credName,
        caName,
        photoURL,
        userData,
        status,
        ow,
        expDate
      )
    ).then(
      vault.putCredentials(
        credentials.serialize(),
        this.#store.getState().password
      )
    );
  }
  /**
   * Imports a new credential with @id into WalliD Plugin.
   *
   * @param {string} id - WalliD credential id
   * @param {string} sig - encrypted sig data
   * @param {string} verifySig - encrypted verifySig data
   *
   * @param {*} ow - overwrite flag
   */
  importCredentialSign(id, sig, verifySig) {
    const vault = this.#store.getState().vault;
    if (!vault.isUnlocked()) {
      return Promise.reject("ERR_PLUGIN_LOCKED");
    }
    console.log(id);
    const credentials = this.#store.getState().credentials;
    return Promise.resolve(
      credentials.addCredentialSign(id, sig, verifySig)
    ).then(
      vault.putCredentials(
        credentials.serialize(),
        this.#store.getState().password
      )
    );
  }

  /**
   * Deletes a new credential with @id in WalliD Plugin.
   *
   * @param {string} id - WalliD credential id
   */
  deleteCredential(id) {
    const vault = this.#store.getState().vault;
    if (!vault.isUnlocked()) {
      return Promise.reject("ERR_PLUGIN_LOCKED");
    }
    console.log(id);
    const credentials = this.#store.getState().credentials;
    return Promise.resolve(credentials.deleteCredential(id)).then(
      vault.putCredentials(
        credentials.serialize(),
        this.#store.getState().password
      )
    );
  }

  //
  // PENDING REQUESTS RELATED METHODS
  //

  /**
   * Pushes a new pending request to the App's runtime requests queue.
   * Requests pushed to this queue need user interaction to be handled.
   *
   * @param {Object} _request - Object as generated by the request API
   */
  updatePendingRequests(_request) {
    let requests = this.#store.getState().requests;
    requests.push(_request);
    this.#store.updateState({ requests });
  }

  /**
   * Pops and returns the next request on queue.
   *
   * @returns {Object} request - Object as generated by the request API
   */
  getNextRequest() {
    let requests = this.#store.getState().requests;
    let next = requests.shift();
    this.#store.updateState({ requests });
    return next;
  }

  //
  // NOTIFICATION POPUP RELATED METHODS
  //

  /**
   * Pushes @id to the App's active popups list.
   * If @remove is set, tries to remove @id from the popups list.
   *
   * @param {number} id - ID of active popup window
   * @param {boolean} remove - remove flag
   */
  updateActivePopups(id, remove) {
    let popups = this.#store.getState().popups;
    if (remove) {
      popups.splice(popups.indexOf(id), 1);
    } else {
      popups.push(id);
    }
    this.#store.updateState({ popups });
  }

  /**
   * Returns App's active popups list.
   *
   * @returns {Array<number>} popups - List of currently active popup window IDs
   */
  getActivePopups() {
    return this.#store.getState().popups;
  }

  eventProxy(msg) {
    eventPipeIn(msg);
  }

  //=============================================================================
  // EXPOSED TO THE UI SUBSYSTEM
  //=============================================================================

  getState() {
    const vault = this.#store.getState().vault;
    const wallet = this.#store.getState().wallet;
    const connections = this.#store.getState().connections;
    const identities = this.#store.getState().identities;
    const credentials = this.#store.getState().credentials;

    return {
      initialized: !vault.isEmpty(),
      unlocked: vault.isUnlocked(),
      address: vault.isUnlocked() ? wallet.getAddress() : null,
      connections: vault.isUnlocked() ? connections.getAllConnections() : null,
      identities: vault.isUnlocked() ? identities.get() : null,
      credentials: vault.isUnlocked() ? credentials.get() : null,
      mnemonic: vault.isUnlocked() ? () => vault.getMnemonic() : null,
      key: vault.isUnlocked() ? () => vault.getWallet() : null,
    };
  }

  /**
   * Returns an object with the controller's functions.
   * Exposes the controller's functionalities to the UI subsystem.
   *
   * @returns {Object} api
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
      approveConnection: this.approveConnection.bind(this),
      removeConnected: this.removeConnected.bind(this),
      signPrivateKey: this.signPrivateKey.bind(this),
      encryptData: this.encryptData.bind(this),
      decryptData: this.decryptData.bind(this),
      getAuthorizationToken: this.getAuthorizationToken.bind(this),
      extractIdentityData_v1: this.extractIdentityData_v1.bind(this),
      importIdentity_v2: this.importIdentity_v2.bind(this),
      importCredential: this.importCredential.bind(this),
      getNextRequest: this.getNextRequest.bind(this),
      accessControl: this.accessControl.bind(this),
      currentTab: this.currentTab.bind(this),
      generateERC191Signature: this.generateERC191Signature.bind(this),
      generateECSignature: this.generateECSignature.bind(this),
      importCredentialSign: this.importCredentialSign.bind(this),
      deleteCredential: this.deleteCredential.bind(this),
      eventProxy: this.eventProxy.bind(this),
    };
  }

  //=============================================================================
  // EXTERNAL REQUEST API
  //=============================================================================

  /**
   * Resolves to a bool indicating if @origin has access level @level .
   *
   * @param {string} origin - url of the caller web site
   * @param {Number} level - request access level
   *
   * @returns {Promise<boolean>} - has access bool
   */
  accessControl(origin, level) {
    const vault = this.#store.getState().vault;
    if (!vault.isUnlocked()) {
      return undefined;
    }
    const connections = this.#store.getState().connections;
    return Promise.resolve(connections.getConnectionAccessLevel(origin)).then(
      (al) => al >= level
    );
  }

  requestAPI(method, params = [], origin) {
    const requestHandler = function(details) {
      let promise = {};
      if(details.popup) {
        promise = new Promise((resolve, reject) => {
          var _request = {
            origin,
            type: method,
            data: params,
            level: details.level,
            callback: function(err, result) {
              if (err) return reject(err);
              else return resolve(result);
            },
          };
          this.updatePendingRequests(_request);
        });
        launchNotificationPopup().then((id) => this.updateActivePopups(id));
      }
      else if(details.main_controller) {
        const vault = this.#store.getState().vault;
        if (!vault.isUnlocked()) {
          promise = Promise.reject("ERR_PLUGIN_LOCKED");
        } else {
          promise = Promise.resolve(this.accessControl(origin, details.level))
            .then((acc) => acc? this[details.executor[0]](...params): Promise.reject("ERR_NO_PERMISSION"))
        }
      }
      else {
        const vault = this.#store.getState().vault;
        if (!vault.isUnlocked()) {
          promise = Promise.reject("ERR_PLUGIN_LOCKED");
        } else {
          promise = Promise.resolve(this.accessControl(origin, details.level))
            .then((acc) => acc? Promise.resolve(this.#store.getState()) : Promise.reject("ERR_NO_PERMISSION"))
            .then((state) => state[details.executor[0]][details.executor[1]](...params));
        }
      }
      return promise;
    };

    return Promise.resolve(getRequestDetails(method)).then(
      requestHandler.bind(this)
    );
  }
}
