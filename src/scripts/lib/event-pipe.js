import extension from 'extensionizer'

// Background to Content-Script
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


