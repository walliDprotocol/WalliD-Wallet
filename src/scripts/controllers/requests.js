import extension from 'extensionizer'

const RequestAPIMethods = [
    'wallid_connect',
    'wallid_disconnect',
    'wallid_address',
    'wallet_encrypt',
    'wallet_decrypt'
]

const MethodsPopupMap = {
    'wallid_connect': true,
    'wallid_disconnect': false,
    'wallid_address': false,
    'wallet_encrypt': true,
    'wallet_decrypt': true
}

// External API controller imported to AppController
export class RequestAPIController {
    #nonce = -1
    #popupID = 0
    #requestIndex = -1
    #pendingRequests = [] // { <type> <data> <executor> }

    constructor() {}
    
    pushNewRequest(method, params) {
        if(!RequestAPIMethods.includes(method)) {
            return Promise.reject('Invalid method call')
        }

        return new Promise((resolve, reject) => {
            this.#nonce++

            this.#pendingRequests.push({
                type: method,
                nonce: this.#nonce,
                data: params,
                callback: function(err, result) {
                    if(err) return reject(err)
                    else return resolve(result)
                }.bind(this)
            })

            if(MethodsPopupMap[method]) {
                this._openNotificationPopup()
            }
        })
    }

    getNextRequest() {
        return this.#pendingRequests.shift()
    }

    popFromQueue(nonce) {
        this.#pendingRequests = this.#pendingRequests.filter(pr => pr.nonce != nonce)

        return Promise.resolve()
    }

    getOpenPopup() {
        return this.#popupID
    }

    _openNotificationPopup() {
        console.log('OPEN NOTIFICATION POPUP')
        extension.windows.create({
            url: extension.runtime.getURL("notification.html"),
            type: "popup",
            width: 360,
            height: 550
        }, win => this.#popupID = win.id)
    }

    _newPendingConnection(url, icon, name, description) {
        console.log('_newPendingConn')
        return Promise.resolve(this.connections)
            .then(conn => conn.newConnection(url, icon, name, description))
    }

    _removeConnected(url) {
        return Promise.resolve(this.connections)
            .then(conn => conn.removeConnected(url))
    }
}