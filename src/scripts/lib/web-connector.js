"use strict";

import extension from "extensionizer";

//Backend runs in content-script
export function ExternalConnectorBackend() {
  document.addEventListener("wallid_request", function(event) {
    extension.runtime.sendMessage(event.detail, function(response) {
      const event = new CustomEvent("wallid_response", { detail: response });

      document.dispatchEvent(event);
    });
  });
}

//Frontend injected into webpage context
export function ExternalConnectorFrontend() {
  var nonce = 0;
  function newResponseListener(resolve, reject, _nonce) {
    var listener = function(event) {
      if (event.detail.nonce == _nonce) {
        if (event.detail.error) reject(event.detail.error);
        else resolve(event.detail.data);

        document.removeEventListener("wallid_response", listener);
      }
    };
    document.addEventListener("wallid_response", listener);
  }

//   const ready_event = new Event("wallid_event_ready");

  return function(method, params) {
    const detail = { method, params, nonce, origin: window.location.origin };
    const event = new CustomEvent("wallid_request", { detail });
    const promise = new Promise((resolve, reject) =>
      newResponseListener(resolve, reject, nonce)
    );

    nonce++;
    document.dispatchEvent(event);

    return promise;
  };
}
