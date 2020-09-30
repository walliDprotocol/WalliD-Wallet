/**
 * Relays events from the app's background to the content-script.
 * Events sent through the pipe can be listened to in the currently active tab.
 * Events can be propagated with a payload.
 */

import extension from 'extensionizer'

export function eventPipeIn(event, data) {
    extension.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        extension.tabs.sendMessage(tabs[0].id, { event, data })
    })
}

export function eventPipeOut() {
    extension.runtime.onMessage.addListener(function(request) {
        document.dispatchEvent(new CustomEvent(request.event, { detail: request.data }))
    })
}