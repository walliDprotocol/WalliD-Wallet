const InitState = {
  credentials: [],
};

export default class CredentialsController {
  #credentials;

  constructor(credentials = []) {
    this.#credentials = credentials;
  }

  serialize() {
    if (this.#credentials.length == 0) {
      return JSON.stringify([]);
    }
    return JSON.stringify(this.#credentials);
  }

  static deserialize(_credentials) {
    if (
      !_credentials ||
      (!Array.isArray(_credentials) && typeof _credentials != 'string') ||
      _credentials.length == 0
    ) {
      return new CredentialsController();
    }
    let credentials = JSON.parse(_credentials);
    return new CredentialsController(credentials);
  }

  addCredentialSign(id, sig, verifySig) {
    return new Promise((resolve, reject) => {
      console.log('log id update', id);
      console.log('credentials', this.#credentials);
      const index = this.#credentials.findIndex((cred) => cred.id == id);
      console.log('index', this.#credentials[index]);
      if (index != -1) {
        console.log('EXISTs ', this.#credentials[index].id);

        this.#credentials[index].status = 'active';
        this.#credentials[index].userData.sig = sig;
        this.#credentials[index].userData.verifySig = verifySig;
      } else {
        console.log('Does not exists', index);
        return reject(`Credential id  ${id}  doesn´t exists`);
      }
      return resolve();
    });
  }

  deleteCredential(id) {
    return new Promise((resolve, reject) => {
      const index = this.#credentials.findIndex((cred) => cred.id == id);

      if (index != -1) {
        console.log('EXISTs w/ ', index);
        this.#credentials.splice(index, 1);
        return resolve();
      } else {
        return reject(`Credential id  ${id}  doesn´t exists`);
      }
    });
  }
  addCredential(id, credName, caName, photoURL, userData, status, ow, expDate) {
    return new Promise((resolve, reject) => {
      console.log('log id add', id);
      console.log('credentials', this.#credentials);
      const index = this.#credentials.findIndex((cred) => cred.id == id);
      console.log('index', index);
      if (index != -1 && ow) {
        console.log('ALREADY EXISTs w/ OW', index);
        this.#credentials.splice(index, 1);
      } else if (index != -1) {
        console.log('ALREADY EXISTs', index);
        return reject(`ERR_CRED_ALREADY_EXISTS`);
      }
      this.#credentials.push({
        id,
        credName,
        caName,
        photoURL,
        userData,
        status,
        expDate,
      });

      return resolve();
    });
  }

  importAsset(id, assetData, expDate, ow = true) {
    return new Promise((resolve, reject) => {
      console.log('log id add', id);
      console.log('credentials', this.#credentials);
      const index = this.#credentials.findIndex((cred) => cred.id == id);
      console.log('index', index);
      if (index != -1 && ow) {
        console.log('ALREADY EXISTs w/ OW', index);
        this.#credentials.splice(index, 1);
      } else if (index != -1) {
        console.log('ALREADY EXISTs', index);
        return reject(`ERR_CRED_ALREADY_EXISTS`);
      }
      this.#credentials.push({
        id,
        ...assetData,
        expDate,
      });

      return resolve({
        id,
        ...assetData,
        expDate,
        vaultName: 'putCredentials',
      });
    });
  }

  getCredential(id) {
    return new Promise((resolve, reject) => {
      console.log('log id get', id);
      const index = this.#credentials.findIndex((cred) => cred.id == id);
      if (index == -1) {
        console.log('ALREADY EXISTs', index);
        return reject(`ERR_CRED_INEXISTENT`);
      }
      return resolve(this.#credentials[index]);
    });
  }

  exportAsset(id) {
    return new Promise((resolve, reject) => {
      console.log('log id get', id);
      const index = this.#credentials.findIndex((cred) => cred.id == id);
      if (index == -1) {
        console.log('ALREADY EXISTs', index);
        return reject(`ERR_CRED_INEXISTENT`);
      }
      return resolve(this.#credentials[index]);
    });
  }
  get() {
    return this.#credentials;
  }

  getIDTsList() {
    return this.#credentials.map((id) => id.id);
  }
  getList() {
    return this.#credentials.map((id) => {
      return {
        id: id.id,
        assetName: id.assetName,
        username: id.username,
      };
    });
  }
}
