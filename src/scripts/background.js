import extension from "extensionizer";
import AppController from "./app-controller";
import { setPort } from "./lib/event-pipe";

var msgPort;
var forwarderURL = "https://www.dev.wallid.io/import";

function connected(prt) {
  msgPort = prt;
  setPort(msgPort);
  msgPort.postMessage({ type: "plugin:installed" });
  msgPort.onMessage.addListener(gotMessage);
}

// fires when content script sends a message
function gotMessage(msg) {
  // store the message
  console.log(msg);

  if (msg.type == "website:url") {
    forwarderURL = msg.url;
    // chrome.tabs.create({ url: forwarderURL }, function(tab) {
    //   console.log("options page opened");
    //   //     //https://www.dev.wallid.io/import http://localhost:8080/import
    // });

    chrome.tabs.query({ url: forwarderURL + "/*" }, (tab) => {
      console.log("tab", tab);
      chrome.tabs.get(tab[0].id, function(tab) {
        chrome.tabs.highlight(
          {
            windowId: tab.windowId,
            tabs: tab.index,
          },
          function() {}
        );
      });
    });
  }
}

extension.runtime.onConnect.addListener(connected);

// extension.runtime.onInstalled.addListener(function() {
//   chrome.tabs.query({ url: "https://*.wallid.io/*" }, (tab) => {
//     console.log("tab", tab);
//     chrome.tabs.get(tab[0].id, function(tab) {
//       chrome.tabs.highlight(
//         {
//           windowId: tab.windowId,
//           tabs: tab.index,
//         },
//         function() {}
//       );
//     });
//   });
// });

// Initialize main application controller
const App = new AppController();

// Inject internal API into UI subsystem
window.API = App.getAPI();

// Connects the external web connector to the App's RequestAPI
extension.runtime.onMessage.addListener(function(
  request,
  sender,
  sendResponse
) {
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
  popups.includes(id) ? App.updateActivePopups(id, true) : App.lockApp();
});
