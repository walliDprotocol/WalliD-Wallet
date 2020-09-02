import extension from 'extensionizer'
import AppController from './app-controller'

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

const App = new AppController()

window.API = App.getAPI()

// Connects the external web connector to the App's RequestAPI
extension.runtime.onMessage.addListener(function(request, res, f) {
    console.log('ON MESSAGE RECEIVED BACK', request)

    App.requestAPI(request.method, request.params)
        .then(result => f(result))
})

// Locks App when user closes the browser window
chrome.windows.onRemoved.addListener(() => App.lockApp())