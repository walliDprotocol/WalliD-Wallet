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

//extension.runtime.onMessage.addListener(App.requestAPI.bind(App))

extension.tabs.onCreated.addListener(function(tab) {
    console.log('ON CREATED')
    chrome.tabs.executeScript(tab.ib, {
		file: 'scripts/content.bundle.js'
	});
})

extension.runtime.onSuspend.addListener(function() {
    console.log('SUSPEDN')
})
