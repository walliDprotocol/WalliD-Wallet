import extension from 'extensionizer'
import AppController from './app-controller'

// Initialize main application controller
const App = new AppController()

// Inject internal API into UI subsystem
window.API = App.getAPI()

extension.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        
    });
});

chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'google.com' },
        })
    ],
    actions: [new chrome.declarativeContent.ShowPageAction()]
}]);

var WINWIN = 0
// Connects the external web connector to the App's RequestAPI
extension.runtime.onMessage.addListener(function(request, res, f) {
    console.log('ON MESSAGE RECEIVED BACK', request)

    if(request.method)
    chrome.windows.create({
        url: chrome.runtime.getURL("notification.html"),
        type: "popup",
        width: 360,
        height: 550
      }, win => WINWIN = win.id);
    
    //App.requestAPI(request.method, request.params)
    //    .then(result => f({ data: result, error: null }))
    //    .catch(error => f({ data: null, error }))
})

// Locks App when user closes the browser window
extension.windows.onRemoved.addListener(id => {
    console.log(WINWIN)
    if(id != WINWIN)
        App.lockApp()
})
// Starts 
//extension.windows.onCreated.addListener(initApp)
