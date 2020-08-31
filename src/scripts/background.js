import extension from 'extensionizer'
import AppController from './app-controller'

extension.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostEquals: 'developer.chrome.com' },
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});


const App = new AppController()

window.API = App.getAPI()

console.log('BACKGROUND', App.getAPI())

extension.runtime.onSuspend.addListener(function() {
    console.log('SUSPEDN')
})