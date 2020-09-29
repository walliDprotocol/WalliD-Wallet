import { ExternalConnectorBackend } from './lib/web-connector'
import { eventPipeOut } from './lib/event-pipe'

function injectScript(file) {
    var head = document.getElementsByTagName('head')[0]
    var script = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', file)
    head.appendChild(script);
}

function init() {
    injectScript(chrome.extension.getURL('/scripts/injector.bundle.js'));
    ExternalConnectorBackend()
    eventPipeOut()
}

init()