import extension from 'extensionizer'

export default function() {
    return new Promise((resolve) => {
        extension.windows.create({
            url: extension.runtime.getURL("notification.html"),
            type: "popup",
            width: 360,
            height: 550
        }, win => resolve(win.id))
    })
}