import * as bip39 from 'bip39';
import passworder from 'browser-passworder';
import WalletController from './wallet';
import StateStore from '../lib/store';

const InitState = {
  vault: {},
  data: {},
  unlocked: false,
  empty: true,
};

/**
 * @class Vault
 *
 * Class for managing plugin's local storage.
 * Stores WalliD user wallet data.
 */

export default class Vault {
  #store;

  constructor() {
    this.#store = new StateStore(InitState);
  }

  // Tries to load instance with encrypted vault data from local storage, if available
  loadFromLocalStorage() {
    console.log('loadFromLocalStorage');
    return Promise.resolve(this.#store.getLocal('vault')).then((vault) =>
      vault ? this.#store.updateState({ vault, empty: false }) : undefined
    );
  }

  // Creates and a persists a new vault to local storage. Overwrites any pre-existing data
  createNewAndPersist(mnemonic, password) {
    if (typeof password != 'string') {
      return Promise.reject("Vault password must be of type 'string'");
    }

    if (!bip39.validateMnemonic(mnemonic)) {
      return Promise.reject('Invalid mnemonic phrase');
    }

    return (
      Promise.resolve(WalletController.initFromMnemonic(mnemonic))
        .then((wallet) => Promise.resolve([wallet.serialize(), mnemonic, []]))
        .then((data) => passworder.encrypt(password, data))
        .then((vault) => {
          this.#store.putLocal({ vault });
          return vault;
        })
        .then((vault) =>
          this.#store.putState({ vault, unlocked: false, empty: false })
        )
        //DEBUG LINE
        .then(() =>
          console.log(
            'New vault created and persisted to local storage',
            this.#store.getState().vault
          )
        )
    );
  }

  initFromPrivateKey(privateKey, password) {
    console.log('initFromPrivateKey', privateKey, password);
    if (typeof password != 'string') {
      return Promise.reject("Vault password must be of type 'string'");
    }

    // if (!bip39.validateMnemonic(mnemonic)) {
    //   return Promise.reject('Invalid mnemonic phrase');
    // }

    let mnemonic =
      "This account was initialized from a private Key isn't possible to retrieve it's seedphrase";

    return (
      Promise.resolve(WalletController.initFromPrivateKey(privateKey))
        .then((wallet) => Promise.resolve([wallet.serialize(), mnemonic, []]))
        .then((data) => passworder.encrypt(password, data))
        .then((vault) => {
          this.#store.putLocal({ vault });
          return vault;
        })
        .then((vault) =>
          this.#store.putState({ vault, unlocked: false, empty: false })
        )
        //DEBUG LINE
        .then(() =>
          console.log(
            'New vault created and persisted to local storage',
            this.#store.getState().vault
          )
        )
    );
  }

  // Fully resets the vault. Clears local storage and reverts instance to initial state
  fullReset() {
    return Promise.resolve(this.#store.putState(InitState)).then(() =>
      this.#store.removeLocal('vault')
    );
  }

  // Locks vault. Clears all state data
  lock() {
    if (!this.isUnlocked()) {
      return Promise.resolve();
    }

    return Promise.resolve(
      this.#store.updateState({
        data: {},
        unlocked: false,
        empty: this.isEmpty(),
      })
    );
  }

  // Tests @password. Throws an error if @password is wrong
  unlock(password) {
    if (this.isUnlocked() || this.isEmpty()) {
      return Promise.resolve();
    }

    if (typeof password != 'string') {
      return Promise.reject("Vault password must be of type 'string'");
    }

    return Promise.resolve(this.submitPassword(password)).then((data) =>
      this.#store.updateState({ data, unlocked: true })
    );
  }

  submitPassword(password) {
    if (this.isEmpty()) {
      return Promise.reject('Vault is empty!');
    }

    return Promise.resolve(this.#store.getState().vault).then((vault) =>
      passworder.decrypt(password, vault)
    );
  }

  // Returns serialized WalletController
  getWallet() {
    return this._getData(0);
  }

  getMnemonic() {
    return this._getData(1);
  }

  // Returns serialized ConnectionsController
  getConnections() {
    return this._getData(2);
  }

  // Returns serialized IdentitiesController
  getIdentities() {
    return this._getData(3);
  }

  // Returns serialized CredentialsController
  getCredentials() {
    return this._getData(4);
  }

  // Returns serialized ProfilesController
  getProfiles() {
    return this._getData(5);
  }

  // Returns serialized NetworksController
  getNetworks() {
    return this._getData(6);
  }

  // Returns serialized LuksoController
  getLukso() {
    return this._getData(7);
  }

  // Updates vault with @conns
  putConnections(conns, password) {
    console.log('putConnections', conns);
    return Promise.resolve(this._putData(2, conns, password));
  }

  // Updates vault with @conns
  putIdentities(ids, password) {
    console.log('putIdentities');
    return Promise.resolve(this._putData(3, ids, password));
  }

  // Updates vault with @credentials
  putCredentials(credentials, password) {
    console.log('putCredentials');
    return Promise.resolve(this._putData(4, credentials, password));
  }

  // Updates vault with @profiles
  putProfiles(profiles, password) {
    console.log('putProfiles');
    return Promise.resolve(this._putData(5, profiles, password));
  }

  // Updates vault with @networks
  putNetworks(networks, password) {
    console.log('putNetworks');
    return Promise.resolve(this._putData(6, networks, password));
  }
  // Updates vault with @networks
  putLukso(lukso, password) {
    console.log('putLukso', lukso);
    return Promise.resolve(this._putData(7, lukso, password));
  }

  isUnlocked() {
    return this.#store.getState().unlocked;
  }

  isEmpty() {
    return this.#store.getState().empty;
  }

  _getData(index) {
    if (!this.isUnlocked() || this.isEmpty()) {
      return undefined;
    }

    return index != undefined
      ? this.#store.getState().data[index]
      : this.#store.getState().data;
  }

  _putData(index, _data, password) {
    return Promise.resolve(this.submitPassword(password))
      .then((data) => {
        data[index] = _data;
        return data;
      })
      .then((data) =>
        passworder
          .encrypt(password, data)
          .then((vault) => Promise.resolve({ data, vault }))
      )
      .then((_vault) => {
        this.#store.updateState({
          vault: _vault.vault,
          unlocked: this.isUnlocked(),
          data: this.isUnlocked() ? _vault.data : null,
        });

        return _vault.vault;
      })
      .then((vault) => this.#store.putLocal({ vault }));
  }
}
