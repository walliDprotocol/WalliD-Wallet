class Connection {
    url //url of the web app
    status //unapproved, connected, blacklisted
    name //user friendly name of the connected app
    description //description of the connected app

    constructor(_url, _status, _name, _description) {
        this.status = _status || 'unnaproved'
        this.url = _url
        this.name = _name
        this.description = _description
    }

    serialize() {
        return JSON.stringify([this.url, this.status, this.status, this.description])
    }

    static deserialize(data) {
        let init = JSON.parse(data)

        return new Connection(...init)
    }
}


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

    addConnection() {

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