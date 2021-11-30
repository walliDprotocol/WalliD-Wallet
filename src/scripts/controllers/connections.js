export default class ConnectionsController {
  #connections; //array of connections

  constructor(connections = []) {
    this.#connections = connections;
  }

  serialize() {
    if (this.#connections.length == 0) {
      return JSON.stringify([]);
    }

    return JSON.stringify(this.#connections);
  }

  static deserialize(_conns) {
    if (
      !_conns ||
      (!Array.isArray(_conns) && typeof _conns != 'string') ||
      _conns.length == 0
    ) {
      return new ConnectionsController();
    }
    let conns = JSON.parse(_conns);
    return new ConnectionsController(conns);
  }

  addConnected(url, icon, name, level) {
    return new Promise((resolve, reject) => {
      if (level < 1 && level > 2) return reject('ERR_INV_ACCESS_LEVEL');
      if (this.#connections.findIndex((c) => c.url == url) != -1) {
        return reject(`ERR_CONN_ALREADY_EXISTS`);
      }
      this.#connections.push({ url, icon, name, level });
      return resolve();
    });
  }

  removeConnected(url) {
    return Promise.resolve(
      this.#connections.findIndex((c) => c.url == url)
    ).then((index) => {
      if (index != -1) this.#connections.splice(index, 1);
    });
  }

  getAllConnections() {
    return this.#connections;
  }

  isConnected(url) {
    return Promise.resolve(
      this.#connections.findIndex((c) => c.url == url)
    ).then((index) => index != -1);
  }

  getConnectionAccessLevel(url) {
    return Promise.resolve(
      this.#connections.findIndex((c) => c.url == url)
    ).then((index) =>
      index == -1
        ? Promise.resolve(-1)
        : Promise.resolve(this.#connections[index].level)
    );
  }
}
