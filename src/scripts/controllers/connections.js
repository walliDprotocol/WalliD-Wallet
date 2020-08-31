export default class ConnectionsController {
    #connections; //array of connections

    constructor(connections = []) {
        this.#connections = connections
    }

    serialize() {
        if(!this.#connections) {
            return undefined
        }

        return JSON.stringify(this.#connections)
    }

    static deserialize(_conns) {
        let conns = JSON.parse(_conns)

        return new ConnectionsController(conns)
    }
}