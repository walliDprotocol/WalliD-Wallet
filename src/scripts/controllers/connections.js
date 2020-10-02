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
        return new Promise((resolve, reject) => {
            if(this.#connections.findIndex(c => c.url == url) != -1) {
                return reject(`Connection for url ${url} already exists`)
            }
            this.#connections.push({ url, icon, name })
            return resolve()
        })
        
    }

    removeConnected(url) {
        return Promise.resolve(this.#connections.findIndex(c => c.url == url))
            .then(index => { if(index != -1) this.#connections.splice(index, 1) })
    }

    getAllConnections() {
        return this.#connections
    }

    isConnected(url) {
        return Promise.resolve(this.#connections.findIndex(c => c.url == url))
            .then(index => index != -1)
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