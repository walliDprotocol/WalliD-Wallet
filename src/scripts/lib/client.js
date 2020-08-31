import extension from 'extensionizer'


export default function(method, params) {
    console.log('CALL REQUEST')
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage({greeting: "hello"}, function(response) {
            console.log('SENT RECEIVED');
          });
        //extension.runtime.sendMessage(method, params, function() {
        //    resolve(data)
        //})
    })
}