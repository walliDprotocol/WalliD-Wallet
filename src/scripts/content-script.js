import {
  ExternalConnectorBackend,
  ExternalConnectorFrontend,
} from './lib/web-connector';
import { eventPipeOut } from './lib/event-pipe';
import extension from 'extensionizer';

function injectScript(file) {
  var scriptTag = document.createElement('script');
  scriptTag.src = file;
  scriptTag.onload = function() {
    // this.parentNode.removeChild(this);
    this.remove();
  };
  var container = document.head || document.documentElement;
  // append as first child
  // container.insertBefore(scriptTag, container.children[0]);
  container.appendChild(scriptTag);
}

function init() {
  injectScript(extension.extension.getURL('/scripts/injector.bundle.js'));
  ExternalConnectorBackend();
  eventPipeOut();
}

init();

// exportFunction(ExternalConnectorFrontend, window, { defineAs: 'wallid' });
