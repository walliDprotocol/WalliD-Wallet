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
    var listener = function(event) {}
    function newResponseListener(resolve, reject) {
        return function(event) {
            if(event.detail.error) reject(event.detail.error)
            else resolve(event.detail.data)
        }
    }
    function updateResponseListener(resolve, reject) {
        document.removeEventListener('wallid_response', listener)
        listener = newResponseListener(resolve, reject)
        document.addEventListener('wallid_response', listener)

    }

    return function(method, params) {
        let event = new CustomEvent('wallid_request', { detail: { method, params }})

        document.dispatchEvent(event)

        return new Promise((resolve, reject) => updateResponseListener(resolve, reject))
    }
}