const InitState = {
  profiles: [],
};

export default class ProfilesController {
  #profiles;

  constructor(profiles = []) {
    this.#profiles = profiles;
  }

  serialize() {
    if (this.#profiles.length == 0) {
      return JSON.stringify([]);
    }
    return JSON.stringify(this.#profiles);
  }

  static deserialize(_profiles) {
    if (
      !_profiles ||
      (!Array.isArray(_profiles) && typeof _profiles != 'string') ||
      _profiles.length == 0
    ) {
      return new ProfilesController();
    }
    let profiles = JSON.parse(_profiles);
    return new ProfilesController(profiles);
  }

  deleteProfiles(id) {
    return new Promise((resolve, reject) => {
      const index = this.#profiles.findIndex((cred) => cred.id == id);

      if (index != -1) {
        console.log('EXISTs w/ ', index);
        this.#profiles.splice(index, 1);
        return resolve();
      } else {
        return reject(`Profile id  ${id}  doesn´t exists`);
      }
    });
  }

  addProfile(id, credName, caName, photoURL, userData, status, ow, expDate) {
    return new Promise((resolve, reject) => {
      console.log('log id add', id);
      console.log('profiles', this.#profiles);
      const index = this.#profiles.findIndex((cred) => cred.id == id);
      console.log('index', index);
      if (index != -1 && ow) {
        console.log('ALREADY EXISTs w/ OW', index);
        this.#profiles.splice(index, 1);
      } else if (index != -1) {
        console.log('ALREADY EXISTs', index);
        return reject(`ERR_CRED_ALREADY_EXISTS`);
      }
      this.#profiles.push({
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

  getProfile(id) {
    return new Promise((resolve, reject) => {
      console.log('log id get', id);
      const index = this.#profiles.findIndex((cred) => cred.id == id);
      if (index == -1) {
        console.log('ALREADY EXISTs', index);
        return reject(`ERR_CRED_INEXISTENT`);
      }
      return resolve(this.#profiles[index]);
    });
  }

  get() {
    return this.#profiles;
  }

  getIDTsList() {
    return this.#profiles.map((id) => id.id);
  }
}
