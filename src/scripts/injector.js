import { ExternalConnectorFrontend } from "./lib/web-connector";

window.wallid = ExternalConnectorFrontend();

console.warn("WalliD: external app connector injected into webpage context");
document.dispatchEvent(new CustomEvent("wallid_event_ready"));
