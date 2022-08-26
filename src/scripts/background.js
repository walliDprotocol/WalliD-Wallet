import extension from 'extensionizer';
import AppController from './app-controller';
import { setPort } from './lib/event-pipe';

import { EventEmitter } from 'events';

var msgPort;
var forwarderURL = 'https://www.wallid.io/';

function connected(prt) {
  msgPort = prt;
  setPort(msgPort);
  msgPort.postMessage({ type: 'plugin:installed' });
  msgPort.onMessage.addListener(gotMessage);
  // extension.runtime.onConnect.removeListener(connected);
}

// fires when content script sends a message
function gotMessage(msg) {
  // store the message
  console.log(msg);

  if (msg.type == 'website:url') {
    forwarderURL = msg.url;
    // browser.tabs.create({ url: forwarderURL }, function(tab) {
    //   console.log("options page opened");
    //   //     //https://www.dev.wallid.io/import http://localhost:8080/import
    // });

    extension.tabs.query({ url: forwarderURL + '/*' }, (tab) => {
      console.log('tab', tab);
      extension.tabs.get(tab[0].id, function (tab) {
        extension.tabs.highlight(
          {
            windowId: tab.windowId,
            tabs: tab.index,
          },
          function () {}
        );
      });
    });
  }
}

extension.runtime.onConnect.addListener(connected);
// This cannot happens because of mycredentials
// extension.runtime.onInstalled.addListener(function(object) {
//   if (object.reason === 'install') {
//     browser.tabs.create({ url: 'https://www.wallid.io/Setup' }, function(tab) {
//       console.log('New tab launched with installed.html for user SignUp');
//     });
//   }
// });

const eventEmitter = new EventEmitter();

window.eventEmitter = eventEmitter;

// Initialize main application controller
const App = new AppController();

// Inject internal API into UI subsystem
window.API = App.getAPI();

// Connects the external web connector to the App's RequestAPI
extension.runtime.onMessage.addListener(function (
  request,
  sender,
  sendResponse
) {
  console.log('onMessage listener');
  App.requestAPI(request.method, request.params, sender.origin)
    .then((result) =>
      sendResponse({ data: result, error: null, nonce: request.nonce })
    )
    .catch((error) =>
      sendResponse({ data: null, error, nonce: request.nonce })
    );

  return true;
});

// Locks App when user closes the browser window
extension.windows.onRemoved.addListener((id) => {
  const popups = App.getActivePopups();
  popups.includes(id) ? App.updateActivePopups(id, true) : null; //App.lockApp();
});
