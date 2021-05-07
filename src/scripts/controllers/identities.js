const InitState = {
  identities: [],
};

export default class IdentitiesController {
  #identities;

  constructor(identities = []) {
    this.#identities = identities;
  }

  serialize() {
    if (this.#identities.length == 0) {
      return JSON.stringify([]);
    }
    return JSON.stringify(this.#identities);
  }

  static deserialize(_ids) {
    if (
      !_ids ||
      (!Array.isArray(_ids) && typeof _ids != 'string') ||
      _ids.length == 0
    ) {
      return new IdentitiesController();
    }
    let identities = JSON.parse(_ids);
    return new IdentitiesController(identities);
  }

  addIdentity(idt, data, ow, expDate, idtName) {
    return new Promise((resolve, reject) => {
      const index = this.#identities.findIndex((id) => id.idt == idt);
      if (index != -1 && ow) {
        console.log('ALREADY EXISTs w/ OW', index);
        this.#identities.splice(index, 1);
      } else if (index != -1) {
        console.log('ALREADY EXISTs', index);

        return reject(`Identity type ${idt} already exists`);
      }
      this.#identities.push({ idt, data, expDate, idtName });

      return resolve();
    });
  }

  extractIdentity(idt) {
    return new Promise((resolve, reject) => {
      console.log(this.#identities);
      console.log(idt);
      const index = this.#identities.findIndex((id) => id.idt == idt);
      if (index == -1) {
        console.log('DOES NOT EXIST', index);
        return reject(`Identity type ${idt} DOES NOT exist`);
      } else {
        console.log('EXISTs', index);
        resolve(this.#identities[index]);
      }
    });
  }

  deleteIdentity(idt) {
    return Promise.resolve(
      this.#identities.findIndex((id) => id.idt == idt)
    ).then((index) => {
      if (index != -1) this.#identities.splice(index, 1);
    });
  }

  get() {
    return this.#identities;
  }

  getIDTsList() {
    return this.#identities.map((id) => {
      return {
        idt: id.idt,
        idtName: id.idtName,
      };
    });
  }
}
