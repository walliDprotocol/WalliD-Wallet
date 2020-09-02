import { ExternalConnectorFrontend } from './lib/connector'

window.wallid = ExternalConnectorFrontend()

console.warn('WalliD: external app connector injected into webpage context',  )