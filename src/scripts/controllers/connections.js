export default class ConnectionsController {
    #connections; //array of connections

    constructor(connections = []) {
        this.#connections = connections
    }

    serialize() {
        if(this.#connections.length == 0) {
            return JSON.stringify([])
        }

        return JSON.stringify(this.#connections)
    }

    static deserialize(_conns) {
        if(!_conns || (!Array.isArray(_conns) && typeof _conns != 'string') || _conns.length == 0) {
            return new ConnectionsController()
        }

        let conns = JSON.parse(_conns)

        return new ConnectionsController(conns)
    }

    addConnected(url, icon, name) {
        if(this.#connections.findIndex(c => c.url == url) != -1) {
            return Promise.reject(`Connection for url ${url} already exists`)
        }

        this.#connections.push({ url, icon, name, level: 1 })

        return Promise.resolve()
    }

    removeConnected(url) {
        let index = this.#connections.findIndex(c => c.url == url)

        if(index == -1) {
            return Promise.reject(`Connection for ${url} does not exist`)
        }

        this.#connections.splice(index, 1)

        return Promise.resolve()
    }

    getAllConnections() {
        return this.#connections
    }

    isConnected(url) {
        if(this.#connections.findIndex(c => c.url == url) != -1) {
            return Promise.resolve(true)
        }

        return Promise.resolve(false)
    }

    getConnectionAccessLevel(url) {
        let index = this.#connections.findIndex(c => c.url == url)

        if(index == -1) {
            return Promise.resolve(0)
        }
        else {
            return Promise.resolve(this.#connections[index].level)
        }
    }
}


/*
approvePending(url) {
        let index = this.#pending.findIndex(c => c.url == url)

        if(index == -1) {
            return Promise.reject(`No pending connection for ${url}`)
        }

        this.#connections.push(this.#pending[index])
        this.#pending.splice(index, 1)

        return Promise.resolve()
    }

    rejectPending(url) {
        let index = this.#pending.findIndex(c => c.url == url)

        if(index == -1) {
            return Promise.reject(`No pending connection for ${url}`)
        }

        this.#pending.splice(index, 1)

        return Promise.resolve()
    } */