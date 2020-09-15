

// External API controller imported to AppController
export class ExternalAPIController {
    nonce = 0

    constructor(_wallet, _connections) {
        this.wallet = _wallet
        this.connections = _connections
    }
    
    call(method, params) {
        switch(method) {
            case 'wallid_connect': return this._newPendingConnection(...params)
            case 'wallid_disconnect': return this._removeConnected(...params)
            case 'wallet_encrypt': return this._encryptData(...params)
            case 'wallet_decrypt': return this._decryptData(...params)
            default: return Promise.reject('Invalid method call')
        }
    }

    _newPendingConnection(url, icon, name, description) {
        return Promise.resolve(this.connections)
            .then(conn => conn.newConnection(url, icon, name, description))
    }

    _removeConnected(url) {
        return Promise.resolve(this.connections)
            .then(conn => conn.removeConnected(url))
    }

    _signTransaction() {

    }

    _encryptData() {

    }

    _decryptData() {

    }

    _getAddress() {
        return this.wallet.getAddress()
    }
}