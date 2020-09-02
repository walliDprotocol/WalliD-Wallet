import { ExternalConnectorBackend } from './lib/connector'

function injectScript(file) {
    var head = document.getElementsByTagName('head')[0]
    var script = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', file)
    head.appendChild(script);
}

injectScript(chrome.extension.getURL('/scripts/injector.bundle.js'));

ExternalConnectorBackend()