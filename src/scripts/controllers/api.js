
// External API controller imported to AppController
export class ExternalAPIController {
    nonce = 0
    RequestAPIMethods = [
        'wallid_sign_token',
        'wallid_token',
        'wallet_encrypt',
        'wallet_decrypt',
        'getAddress'
    ]

    constructor(_wallet, _connections) {
        this.wallet = _wallet
        this.connections = _connections
    }

    isValidMethod(method) {
        return this.RequestAPIMethods.includes(method)
    }
    
    newPendingConnection(url, icon, name, description) {
        return Promise.resolve(this.connections)
            .then(conn => conn.newConnection(url, icon, name, description))
    }

    signTransaction() {

    }

    encryptData() {

    }

    decryptData() {

    }

    getAddress() {
        return this.wallet.getAddress()
    }
}