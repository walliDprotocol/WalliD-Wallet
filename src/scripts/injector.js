import { ExternalConnectorFrontend } from './lib/connector'

window.wallid = ExternalConnectorFrontend().bind(this)

console.warn('WalliD: external app connector injected into webpage context',  )