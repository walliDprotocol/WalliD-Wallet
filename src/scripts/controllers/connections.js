class Connection {
    constructor(_url, _name, _status, _description) {
        this.status = _status
        this.url = _url
        this.name = _name
        this.description = _description
    }

    serialize() {
        return JSON.stringify([this.url, this.name, this.status, this.description])
    }

    static deserialize(data) {
        let params = JSON.parse(data)

        return new Connection(...params)
    }
}


export default class ConnectionsController {
    #connections; //array of connections

    constructor(connections = []) {
        this.#connections = connections
    }

    serialize() {
        if(this.#connections.length == 0) {
            return JSON.stringify([])
        }

        return JSON.stringify(this.#connections.map(c => c.serialize()))
    }

    static deserialize(_conns) {
        if(Array.isArray(_conns) && _conns.length == 0) {
            return new ConnectionsController()
        }

        let conns = JSON.parse(_conns)

        return new ConnectionsController(conns)
    }

    addConnection(url, name) {
        this.#connections.push(new Connection())
    }

    removeConnection() {

    }

    isConnected(url) {
        for(let it = 0; it < this.#connections.length; it++) {
            if(this.#connections[it].url == url && this.#connections[it].status == 'connected') {
                return true
            }
        }

        return false
    }
}