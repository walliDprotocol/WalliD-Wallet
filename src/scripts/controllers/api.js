
// External API controller imported to AppController
export class ExternalAPIController {
    nonce = 0

    constructor(_wallet, _connections) {
        this.wallet = _wallet
        this.connections = _connections
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