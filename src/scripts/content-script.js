import { ExternalConnectorBackend } from "./lib/web-connector";

function injectScript(file) {
  // var script = document.createElement("script");
  // script.src = file;
  // (document.head || document.documentElement).appendChild(script);
  var scriptTag = document.createElement("script");
  scriptTag.src = file;
  scriptTag.onload = function() {
    this.parentNode.removeChild(this);
  };
  var container = document.head || document.documentElement;
  // append as first child
  container.insertBefore(scriptTag, container.children[0]);
}

injectScript(chrome.extension.getURL("/scripts/injector.bundle.js"));

ExternalConnectorBackend();
