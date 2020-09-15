const Status = {
    PEN: 'summer',
    WINTER: 'winter',
    SPRING: 'spring',
}

class Connection {
    constructor(_url, _icon, _name, _description) {
        this.url = _url
        this.icon = _icon
        this.name = _name
        this.description = _description
    }

    serialize() {
        return JSON.stringify([this.url, this.icon, this.name, this.description])
    }

    static deserialize(data) {
        let params = JSON.parse(data)

        return new Connection(...params)
    }
}


export default class ConnectionsController {
    #connections; //array of connections
    #pending;

    constructor(connections = []) {
        this.#connections = connections
        this.#pending = []
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

    newConnection(url, icon, name, description) {
        if(this.#pending.findIndex(c => c.url == url) != -1) {
            return Promise.reject(`Connection for url ${url} is already pending approval`)
        }

        if(this.#connections.findIndex(c => c.url == url) != -1) {
            return Promise.reject(`Connection for url ${url} already exists`)
        }

        this.#pending.push({ url, icon, name, description })

        return Promise.resolve()
    }

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
    }
    
    getPending() {
        return this.#pending
    }

    getConnected() {
        return this.#connections
    }

    removeConnected(url) {
        let index = this.#connections.findIndex(c => c.url == url)

        if(index == -1) {
            return Promise.reject(`Connection for ${url} does not exist`)
        }

        this.#connections.splice(index, 1)

        return Promise.resolve()
    }

    isConnected(url) {
        if(this.#connections.findIndex(c => c.url == url) != -1) {
            return Promise.resolve(true)
        }

        return Promise.resolve(false)
    }
}