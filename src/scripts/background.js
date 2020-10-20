import extension from "extensionizer";
import AppController from "./app-controller";

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

extension.runtime.onInstalled.addListener(function(object) {
  chrome.tabs.create({ url: `https://www.dev.wallid.io/import` }, function(
    tab
  ) {
    console.log("options page opened");
    //https://www.dev.wallid.io/import http://localhost:8080/import
  });
});

// Locks App when user closes the browser window
extension.windows.onRemoved.addListener((id) => {
  const popups = App.getActivePopups();
  popups.includes(id) ? App.updateActivePopups(id, true) : App.lockApp();
});
