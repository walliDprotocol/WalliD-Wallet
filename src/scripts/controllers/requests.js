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
    #popupIDs = []
    #pendingRequests = [] // { <type> <data> <executor> }

    constructor() {}
    
    pushNewRequest(method, params) {
        if(!RequestAPIMethods.includes(method)) {
            return Promise.reject('Invalid method call')
        }

        this.#nonce++

        return new Promise((resolve, reject) => {
            var request = {
                type: method,
                nonce: this.#nonce,
                data: params,
                callback: function(err, result) {
                    if(err) return reject(err)
                    else return resolve(result)
                }
            }

            this.#pendingRequests.push(request)
        })
    }

    getNextRequest() {
        return this.#pendingRequests.shift()
    }

    getOpenNotificationPopups() {
        return this.#popupIDs
    }

    isPopup(method) {
        return MethodsPopupMap[method] || false
    }
}