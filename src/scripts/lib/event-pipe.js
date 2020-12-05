/**
 * Relays events from the app's background to the content-script.
 * Events sent through the pipe can be listened to in the currently active tab.
 * Events can be propagated with a payload.
 */

import extension from "extensionizer";

var msgPort;

export function setPort(_msgPort) {
  msgPort = _msgPort;
}
// Used by background to pipe events to the content-script
export function eventPipeIn(event) {
  msgPort.postMessage({ event });
}

// Used by content-script to relay events emitted by the background
export function eventPipeOut() {
  msgPort = extension.runtime.connect({ name: "msgPort" });

  // fires when background script sends a message
  msgPort.onMessage.addListener(function(msg) {
    console.log("msg from frontend", msg);

    console.log(localStorage.getItem("REGISTRATION_IN_PROGRESS"));
    console.log(localStorage.getItem("REGISTRATION_IN_PROGRESS") == "true");

    if (
      msg.type == "plugin:installed" &&
      localStorage.getItem("REGISTRATION_IN_PROGRESS") == "true"
    ) {
      localStorage.setItem("REGISTRATION_IN_PROGRESS", "false");
      localStorage.setItem("PLUGIN_INSTALLED", "true");

      msgPort.postMessage({
        url: window.location.origin,
        type: "website:url",
      });
    } else if (msg.type == "plugin:installed") {
      console.log("send envent installed");
      document.dispatchEvent(new CustomEvent(msg.type));
    }
    document.dispatchEvent(new CustomEvent(msg.event, { detail: msg.data }));
  });
}
