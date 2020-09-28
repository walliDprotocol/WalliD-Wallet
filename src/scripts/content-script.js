import { ExternalConnectorBackend } from "./lib/web-connector";

function injectScript(file) {
  var script = document.createElement("script");
  script.src = file;
  (document.head || document.documentElement).appendChild(script);
}

injectScript(chrome.extension.getURL("/scripts/injector.bundle.js"));

ExternalConnectorBackend();
