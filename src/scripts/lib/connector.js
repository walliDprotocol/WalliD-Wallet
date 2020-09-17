'use strict'

import extension from 'extensionizer'

//Backend runs in content script
export function ExternalConnectorBackend() {
    document.addEventListener('wallid_request', function (event) {
        extension.runtime.sendMessage(event.detail, function(response) {
            let event = new CustomEvent('wallid_response', { detail: response })

            document.dispatchEvent(event)
        })
    })
}

//Frontend injected into webpage context
export function ExternalConnectorFrontend() {
    var nonce = 0
    function newResponseListener(resolve, reject, _nonce) {
        var listener = function(event) {
            if(event.detail.nonce == _nonce) {
                if(event.detail.error) reject(event.detail.error)
                else resolve(event.detail.data)

                document.removeEventListener('wallid_response', listener)
            }
        }

        document.addEventListener('wallid_response', listener)
    }

    return function(method, params) {
        let event = new CustomEvent('wallid_request', { detail: { method, params, nonce }})
        let promise = new Promise((resolve, reject) => newResponseListener(resolve, reject, nonce))

        nonce++

        document.dispatchEvent(event)

        return promise
    }
}