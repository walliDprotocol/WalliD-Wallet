/* -------------------------------------------------- */

/*  Start of Webpack Chrome Hot Extension Middleware  */

/* ================================================== */

/*  This will be converted into a lodash templ., any  */

/*  external argument must be provided using it       */

/* -------------------------------------------------- */
(function (chrome, window) {
  var signals = JSON.parse('{"SIGN_CHANGE":"SIGN_CHANGE","SIGN_RELOAD":"SIGN_RELOAD","SIGN_RELOADED":"SIGN_RELOADED","SIGN_LOG":"SIGN_LOG","SIGN_CONNECT":"SIGN_CONNECT"}');
  var config = JSON.parse('{"RECONNECT_INTERVAL":2000,"SOCKET_ERR_CODE_REF":"https://tools.ietf.org/html/rfc6455#section-7.4.1"}');
  var reloadPage = "true" === "true";
  var wsHost = "ws://localhost:9090";
  var SIGN_CHANGE = signals.SIGN_CHANGE,
      SIGN_RELOAD = signals.SIGN_RELOAD,
      SIGN_RELOADED = signals.SIGN_RELOADED,
      SIGN_LOG = signals.SIGN_LOG,
      SIGN_CONNECT = signals.SIGN_CONNECT;
  var RECONNECT_INTERVAL = config.RECONNECT_INTERVAL,
      SOCKET_ERR_CODE_REF = config.SOCKET_ERR_CODE_REF;
  var runtime = chrome.runtime,
      tabs = chrome.tabs;
  var manifest = runtime.getManifest(); // =============================== Helper functions ======================================= //

  var formatter = function formatter(msg) {
    return "[ WCER: ".concat(msg, " ]");
  };

  var logger = function logger(msg) {
    var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "info";
    return console[level](formatter(msg));
  };

  var timeFormatter = function timeFormatter(date) {
    return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  }; // ========================== Called only on content scripts ============================== //


  function contentScriptWorker() {
    runtime.sendMessage({
      type: SIGN_CONNECT
    }, function (msg) {
      return console.info(msg);
    });
    runtime.onMessage.addListener(function (_ref) {
      var type = _ref.type,
          payload = _ref.payload;

      switch (type) {
        case SIGN_RELOAD:
          logger("Detected Changes. Reloading ...");
          reloadPage && window.location.reload();
          break;

        case SIGN_LOG:
          console.info(payload);
          break;
      }
    });
  } // ======================== Called only on background scripts ============================= //


  function backgroundWorker(socket) {
    runtime.onMessage.addListener(function (action, sender, sendResponse) {
      if (action.type === SIGN_CONNECT) {
        sendResponse(formatter("Connected to Chrome Extension Hot Reloader"));
      }
    });
    socket.addEventListener("message", function (_ref2) {
      var data = _ref2.data;

      var _JSON$parse = JSON.parse(data),
          type = _JSON$parse.type,
          payload = _JSON$parse.payload;

      if (type === SIGN_CHANGE) {
        tabs.query({
          status: "complete"
        }, function (loadedTabs) {
          loadedTabs.forEach(function (tab) {
            return tab.id && tabs.sendMessage(tab.id, {
              type: SIGN_RELOAD
            });
          });
          socket.send(JSON.stringify({
            type: SIGN_RELOADED,
            payload: formatter("".concat(timeFormatter(new Date()), " - ").concat(manifest.name, " successfully reloaded"))
          }));
          runtime.reload();
        });
      } else {
        runtime.sendMessage({
          type: type,
          payload: payload
        });
      }
    });
    socket.addEventListener("close", function (_ref3) {
      var code = _ref3.code;
      logger("Socket connection closed. Code ".concat(code, ". See more in ").concat(SOCKET_ERR_CODE_REF), "warn");
      var intId = setInterval(function () {
        logger("Attempting to reconnect (tip: Check if Webpack is running)");
        var ws = new WebSocket(wsHost);
        ws.addEventListener("open", function () {
          clearInterval(intId);
          logger("Reconnected. Reloading plugin");
          runtime.reload();
        });
      }, RECONNECT_INTERVAL);
    });
  } // ======================= Bootstraps the middleware =========================== //


  runtime.reload ? backgroundWorker(new WebSocket(wsHost)) : contentScriptWorker();
})(chrome, window);
/* ----------------------------------------------- */

/* End of Webpack Chrome Hot Extension Middleware  */

/* ----------------------------------------------- *//******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/scripts/content-script.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/extensionizer/extension-instance.js":
/*!**********************************************************!*\
  !*** ./node_modules/extensionizer/extension-instance.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

const apis = [
  'alarms',
  'bookmarks',
  'browserAction',
  'commands',
  'contextMenus',
  'cookies',
  'downloads',
  'events',
  'extension',
  'extensionTypes',
  'history',
  'i18n',
  'idle',
  'notifications',
  'pageAction',
  'runtime',
  'storage',
  'tabs',
  'webNavigation',
  'webRequest',
  'windows',
]

const hasChrome = typeof chrome !== 'undefined'
const hasWindow = typeof window !== 'undefined'
const hasBrowser = typeof browser !== 'undefined'

function Extension () {
  const _this = this

  apis.forEach(function (api) {

    _this[api] = null

    if (hasChrome) {
      try {
        if (chrome[api]) {
          _this[api] = chrome[api]
        }
      } catch (e) {
      }
    }

    if (hasWindow) {
      try {
        if (window[api]) {
          _this[api] = window[api]
        }
      } catch (e) {
      }
    }

    if (hasBrowser) {
      try {
        if (browser[api]) {
          _this[api] = browser[api]
        }
      } catch (e) {
      }
      try {
        _this.api = browser.extension[api]
      } catch (e) {
      }
    }
  })

  if (hasBrowser) {
    try {
      if (browser && browser.runtime) {
        this.runtime = browser.runtime
      }
    } catch (e) {
    }

    try {
      if (browser && browser.browserAction) {
        this.browserAction = browser.browserAction
      }
    } catch (e) {
    }
  }

}

module.exports = Extension


/***/ }),

/***/ "./node_modules/extensionizer/index.js":
/*!*********************************************!*\
  !*** ./node_modules/extensionizer/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* Extension.js
 *
 * A module for unifying browser differences in the WebExtension API.
 *
 * Initially implemented because Chrome hides all of their WebExtension API
 * behind a global `chrome` variable, but we'd like to start grooming
 * the code-base for cross-browser extension support.
 *
 * You can read more about the WebExtension API here:
 * https://developer.mozilla.org/en-US/Add-ons/WebExtensions
 */

const Extension = __webpack_require__(/*! ./extension-instance */ "./node_modules/extensionizer/extension-instance.js")
module.exports = new Extension()


/***/ }),

/***/ "./src/scripts/content-script.js":
/*!***************************************!*\
  !*** ./src/scripts/content-script.js ***!
  \***************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_web_connector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/web-connector */ "./src/scripts/lib/web-connector.js");
/* harmony import */ var _lib_event_pipe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/event-pipe */ "./src/scripts/lib/event-pipe.js");



function injectScript(file) {
  // var script = document.createElement("script");
  // script.src = file;
  // (document.head || document.documentElement).appendChild(script);
  var scriptTag = document.createElement("script");
  scriptTag.src = file;

  scriptTag.onload = function () {
    this.parentNode.removeChild(this);
  };

  var container = document.head || document.documentElement; // append as first child

  container.insertBefore(scriptTag, container.children[0]);
}

function init() {
  injectScript(chrome.extension.getURL('/scripts/injector.bundle.js'));
  Object(_lib_web_connector__WEBPACK_IMPORTED_MODULE_0__["ExternalConnectorBackend"])();
  Object(_lib_event_pipe__WEBPACK_IMPORTED_MODULE_1__["eventPipeOut"])();
}

init();

/***/ }),

/***/ "./src/scripts/lib/event-pipe.js":
/*!***************************************!*\
  !*** ./src/scripts/lib/event-pipe.js ***!
  \***************************************/
/*! exports provided: eventPipeIn, eventPipeOut */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "eventPipeIn", function() { return eventPipeIn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "eventPipeOut", function() { return eventPipeOut; });
/* harmony import */ var extensionizer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! extensionizer */ "./node_modules/extensionizer/index.js");
/* harmony import */ var extensionizer__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(extensionizer__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Relays events from the app's background to the content-script.
 * Events sent through the pipe can be listened to in the currently active tab.
 * Events can be propagated with a payload.
 */
 // Used by background to pipe events to the content-script

function eventPipeIn(event, data) {
  extensionizer__WEBPACK_IMPORTED_MODULE_0___default.a.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    extensionizer__WEBPACK_IMPORTED_MODULE_0___default.a.tabs.sendMessage(tabs[0].id, {
      event: event,
      data: data
    });
  });
} // Used by content-script to relay events emitted by the background

function eventPipeOut() {
  extensionizer__WEBPACK_IMPORTED_MODULE_0___default.a.runtime.onMessage.addListener(function (request) {
    document.dispatchEvent(new CustomEvent(request.event, {
      detail: request.data
    }));
  });
}

/***/ }),

/***/ "./src/scripts/lib/web-connector.js":
/*!******************************************!*\
  !*** ./src/scripts/lib/web-connector.js ***!
  \******************************************/
/*! exports provided: ExternalConnectorBackend, ExternalConnectorFrontend */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExternalConnectorBackend", function() { return ExternalConnectorBackend; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExternalConnectorFrontend", function() { return ExternalConnectorFrontend; });
/* harmony import */ var extensionizer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! extensionizer */ "./node_modules/extensionizer/index.js");
/* harmony import */ var extensionizer__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(extensionizer__WEBPACK_IMPORTED_MODULE_0__);


 //Backend runs in content-script

function ExternalConnectorBackend() {
  document.addEventListener('wallid_request', function (event) {
    extensionizer__WEBPACK_IMPORTED_MODULE_0___default.a.runtime.sendMessage(event.detail, function (response) {
      var event = new CustomEvent('wallid_response', {
        detail: response
      });
      document.dispatchEvent(event);
    });
  });
} //Frontend injected into webpage context

function ExternalConnectorFrontend() {
  var nonce = 0;

  function newResponseListener(resolve, reject, _nonce) {
    var listener = function listener(event) {
      if (event.detail.nonce == _nonce) {
        if (event.detail.error) reject(event.detail.error);else resolve(event.detail.data);
        document.removeEventListener('wallid_response', listener);
      }
    };

    document.addEventListener('wallid_response', listener);
  }

  var ready_event = new Event('wallid_event_ready');
  document.dispatchEvent(ready_event);
  return function (method, params) {
    var detail = {
      method: method,
      params: params,
      nonce: nonce,
      origin: window.location.origin
    };
    var event = new CustomEvent('wallid_request', {
      detail: detail
    });
    var promise = new Promise(function (resolve, reject) {
      return newResponseListener(resolve, reject, nonce);
    });
    nonce++;
    document.dispatchEvent(event);
    return promise;
  };
}

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2V4dGVuc2lvbml6ZXIvZXh0ZW5zaW9uLWluc3RhbmNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9leHRlbnNpb25pemVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2NvbnRlbnQtc2NyaXB0LmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2xpYi9ldmVudC1waXBlLmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2xpYi93ZWItY29ubmVjdG9yLmpzIl0sIm5hbWVzIjpbImluamVjdFNjcmlwdCIsImZpbGUiLCJzY3JpcHRUYWciLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzcmMiLCJvbmxvYWQiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJjb250YWluZXIiLCJoZWFkIiwiZG9jdW1lbnRFbGVtZW50IiwiaW5zZXJ0QmVmb3JlIiwiY2hpbGRyZW4iLCJpbml0IiwiY2hyb21lIiwiZXh0ZW5zaW9uIiwiZ2V0VVJMIiwiRXh0ZXJuYWxDb25uZWN0b3JCYWNrZW5kIiwiZXZlbnRQaXBlT3V0IiwiZXZlbnRQaXBlSW4iLCJldmVudCIsImRhdGEiLCJ0YWJzIiwicXVlcnkiLCJhY3RpdmUiLCJjdXJyZW50V2luZG93Iiwic2VuZE1lc3NhZ2UiLCJpZCIsInJ1bnRpbWUiLCJvbk1lc3NhZ2UiLCJhZGRMaXN0ZW5lciIsInJlcXVlc3QiLCJkaXNwYXRjaEV2ZW50IiwiQ3VzdG9tRXZlbnQiLCJkZXRhaWwiLCJhZGRFdmVudExpc3RlbmVyIiwicmVzcG9uc2UiLCJFeHRlcm5hbENvbm5lY3RvckZyb250ZW5kIiwibm9uY2UiLCJuZXdSZXNwb25zZUxpc3RlbmVyIiwicmVzb2x2ZSIsInJlamVjdCIsIl9ub25jZSIsImxpc3RlbmVyIiwiZXJyb3IiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicmVhZHlfZXZlbnQiLCJFdmVudCIsIm1ldGhvZCIsInBhcmFtcyIsIm9yaWdpbiIsIndpbmRvdyIsImxvY2F0aW9uIiwicHJvbWlzZSIsIlByb21pc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7O0FBRUE7Ozs7Ozs7Ozs7OztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtCQUFrQixtQkFBTyxDQUFDLGdGQUFzQjtBQUNoRDs7Ozs7Ozs7Ozs7OztBQ2JBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7O0FBRUEsU0FBU0EsWUFBVCxDQUFzQkMsSUFBdEIsRUFBNEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0EsTUFBSUMsU0FBUyxHQUFHQyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBaEI7QUFDQUYsV0FBUyxDQUFDRyxHQUFWLEdBQWdCSixJQUFoQjs7QUFDQUMsV0FBUyxDQUFDSSxNQUFWLEdBQW1CLFlBQVc7QUFDNUIsU0FBS0MsVUFBTCxDQUFnQkMsV0FBaEIsQ0FBNEIsSUFBNUI7QUFDRCxHQUZEOztBQUdBLE1BQUlDLFNBQVMsR0FBR04sUUFBUSxDQUFDTyxJQUFULElBQWlCUCxRQUFRLENBQUNRLGVBQTFDLENBVDBCLENBVTFCOztBQUNBRixXQUFTLENBQUNHLFlBQVYsQ0FBdUJWLFNBQXZCLEVBQWtDTyxTQUFTLENBQUNJLFFBQVYsQ0FBbUIsQ0FBbkIsQ0FBbEM7QUFDRDs7QUFFRCxTQUFTQyxJQUFULEdBQWdCO0FBQ1pkLGNBQVksQ0FBQ2UsTUFBTSxDQUFDQyxTQUFQLENBQWlCQyxNQUFqQixDQUF3Qiw2QkFBeEIsQ0FBRCxDQUFaO0FBQ0FDLHFGQUF3QjtBQUN4QkMsc0VBQVk7QUFDZjs7QUFFREwsSUFBSSxHOzs7Ozs7Ozs7Ozs7QUN2Qko7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7OztDQVFBOztBQUNPLFNBQVNNLFdBQVQsQ0FBcUJDLEtBQXJCLEVBQTRCQyxJQUE1QixFQUFrQztBQUNyQ04sc0RBQVMsQ0FBQ08sSUFBVixDQUFlQyxLQUFmLENBQXFCO0FBQUVDLFVBQU0sRUFBRSxJQUFWO0FBQWdCQyxpQkFBYSxFQUFFO0FBQS9CLEdBQXJCLEVBQTRELFVBQVNILElBQVQsRUFBZTtBQUN2RVAsd0RBQVMsQ0FBQ08sSUFBVixDQUFlSSxXQUFmLENBQTJCSixJQUFJLENBQUMsQ0FBRCxDQUFKLENBQVFLLEVBQW5DLEVBQXVDO0FBQUVQLFdBQUssRUFBTEEsS0FBRjtBQUFTQyxVQUFJLEVBQUpBO0FBQVQsS0FBdkM7QUFDSCxHQUZEO0FBR0gsQyxDQUVEOztBQUNPLFNBQVNILFlBQVQsR0FBd0I7QUFDM0JILHNEQUFTLENBQUNhLE9BQVYsQ0FBa0JDLFNBQWxCLENBQTRCQyxXQUE1QixDQUF3QyxVQUFTQyxPQUFULEVBQWtCO0FBQ3REN0IsWUFBUSxDQUFDOEIsYUFBVCxDQUF1QixJQUFJQyxXQUFKLENBQWdCRixPQUFPLENBQUNYLEtBQXhCLEVBQStCO0FBQUVjLFlBQU0sRUFBRUgsT0FBTyxDQUFDVjtBQUFsQixLQUEvQixDQUF2QjtBQUNILEdBRkQ7QUFHSCxDOzs7Ozs7Ozs7Ozs7QUNwQkQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztDQUlBOztBQUNPLFNBQVNKLHdCQUFULEdBQW9DO0FBQ3ZDZixVQUFRLENBQUNpQyxnQkFBVCxDQUEwQixnQkFBMUIsRUFBNEMsVUFBVWYsS0FBVixFQUFpQjtBQUN6REwsd0RBQVMsQ0FBQ2EsT0FBVixDQUFrQkYsV0FBbEIsQ0FBOEJOLEtBQUssQ0FBQ2MsTUFBcEMsRUFBNEMsVUFBU0UsUUFBVCxFQUFtQjtBQUMzRCxVQUFNaEIsS0FBSyxHQUFHLElBQUlhLFdBQUosQ0FBZ0IsaUJBQWhCLEVBQW1DO0FBQUVDLGNBQU0sRUFBRUU7QUFBVixPQUFuQyxDQUFkO0FBRUFsQyxjQUFRLENBQUM4QixhQUFULENBQXVCWixLQUF2QjtBQUNILEtBSkQ7QUFLSCxHQU5EO0FBT0gsQyxDQUVEOztBQUNPLFNBQVNpQix5QkFBVCxHQUFxQztBQUN4QyxNQUFJQyxLQUFLLEdBQUcsQ0FBWjs7QUFDQSxXQUFTQyxtQkFBVCxDQUE2QkMsT0FBN0IsRUFBc0NDLE1BQXRDLEVBQThDQyxNQUE5QyxFQUFzRDtBQUNsRCxRQUFJQyxRQUFRLEdBQUcsU0FBWEEsUUFBVyxDQUFTdkIsS0FBVCxFQUFnQjtBQUMzQixVQUFHQSxLQUFLLENBQUNjLE1BQU4sQ0FBYUksS0FBYixJQUFzQkksTUFBekIsRUFBaUM7QUFDN0IsWUFBR3RCLEtBQUssQ0FBQ2MsTUFBTixDQUFhVSxLQUFoQixFQUF1QkgsTUFBTSxDQUFDckIsS0FBSyxDQUFDYyxNQUFOLENBQWFVLEtBQWQsQ0FBTixDQUF2QixLQUNLSixPQUFPLENBQUNwQixLQUFLLENBQUNjLE1BQU4sQ0FBYWIsSUFBZCxDQUFQO0FBRUxuQixnQkFBUSxDQUFDMkMsbUJBQVQsQ0FBNkIsaUJBQTdCLEVBQWdERixRQUFoRDtBQUNIO0FBQ0osS0FQRDs7QUFRQXpDLFlBQVEsQ0FBQ2lDLGdCQUFULENBQTBCLGlCQUExQixFQUE2Q1EsUUFBN0M7QUFDSDs7QUFFRCxNQUFNRyxXQUFXLEdBQUcsSUFBSUMsS0FBSixDQUFVLG9CQUFWLENBQXBCO0FBQ0E3QyxVQUFRLENBQUM4QixhQUFULENBQXVCYyxXQUF2QjtBQUVBLFNBQU8sVUFBU0UsTUFBVCxFQUFpQkMsTUFBakIsRUFBeUI7QUFDNUIsUUFBTWYsTUFBTSxHQUFHO0FBQUVjLFlBQU0sRUFBTkEsTUFBRjtBQUFVQyxZQUFNLEVBQU5BLE1BQVY7QUFBa0JYLFdBQUssRUFBTEEsS0FBbEI7QUFBeUJZLFlBQU0sRUFBRUMsTUFBTSxDQUFDQyxRQUFQLENBQWdCRjtBQUFqRCxLQUFmO0FBQ0EsUUFBTTlCLEtBQUssR0FBRyxJQUFJYSxXQUFKLENBQWdCLGdCQUFoQixFQUFrQztBQUFFQyxZQUFNLEVBQU5BO0FBQUYsS0FBbEMsQ0FBZDtBQUNBLFFBQU1tQixPQUFPLEdBQUcsSUFBSUMsT0FBSixDQUFZLFVBQUNkLE9BQUQsRUFBVUMsTUFBVjtBQUFBLGFBQXFCRixtQkFBbUIsQ0FBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQWtCSCxLQUFsQixDQUF4QztBQUFBLEtBQVosQ0FBaEI7QUFFQUEsU0FBSztBQUNMcEMsWUFBUSxDQUFDOEIsYUFBVCxDQUF1QlosS0FBdkI7QUFFQSxXQUFPaUMsT0FBUDtBQUNILEdBVEQ7QUFVSCxDIiwiZmlsZSI6ImNvbnRlbnQuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvc2NyaXB0cy9jb250ZW50LXNjcmlwdC5qc1wiKTtcbiIsImNvbnN0IGFwaXMgPSBbXG4gICdhbGFybXMnLFxuICAnYm9va21hcmtzJyxcbiAgJ2Jyb3dzZXJBY3Rpb24nLFxuICAnY29tbWFuZHMnLFxuICAnY29udGV4dE1lbnVzJyxcbiAgJ2Nvb2tpZXMnLFxuICAnZG93bmxvYWRzJyxcbiAgJ2V2ZW50cycsXG4gICdleHRlbnNpb24nLFxuICAnZXh0ZW5zaW9uVHlwZXMnLFxuICAnaGlzdG9yeScsXG4gICdpMThuJyxcbiAgJ2lkbGUnLFxuICAnbm90aWZpY2F0aW9ucycsXG4gICdwYWdlQWN0aW9uJyxcbiAgJ3J1bnRpbWUnLFxuICAnc3RvcmFnZScsXG4gICd0YWJzJyxcbiAgJ3dlYk5hdmlnYXRpb24nLFxuICAnd2ViUmVxdWVzdCcsXG4gICd3aW5kb3dzJyxcbl1cblxuY29uc3QgaGFzQ2hyb21lID0gdHlwZW9mIGNocm9tZSAhPT0gJ3VuZGVmaW5lZCdcbmNvbnN0IGhhc1dpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG5jb25zdCBoYXNCcm93c2VyID0gdHlwZW9mIGJyb3dzZXIgIT09ICd1bmRlZmluZWQnXG5cbmZ1bmN0aW9uIEV4dGVuc2lvbiAoKSB7XG4gIGNvbnN0IF90aGlzID0gdGhpc1xuXG4gIGFwaXMuZm9yRWFjaChmdW5jdGlvbiAoYXBpKSB7XG5cbiAgICBfdGhpc1thcGldID0gbnVsbFxuXG4gICAgaWYgKGhhc0Nocm9tZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGNocm9tZVthcGldKSB7XG4gICAgICAgICAgX3RoaXNbYXBpXSA9IGNocm9tZVthcGldXG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzV2luZG93KSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAod2luZG93W2FwaV0pIHtcbiAgICAgICAgICBfdGhpc1thcGldID0gd2luZG93W2FwaV1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYXNCcm93c2VyKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoYnJvd3NlclthcGldKSB7XG4gICAgICAgICAgX3RoaXNbYXBpXSA9IGJyb3dzZXJbYXBpXVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBfdGhpcy5hcGkgPSBicm93c2VyLmV4dGVuc2lvblthcGldXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIGlmIChoYXNCcm93c2VyKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChicm93c2VyICYmIGJyb3dzZXIucnVudGltZSkge1xuICAgICAgICB0aGlzLnJ1bnRpbWUgPSBicm93c2VyLnJ1bnRpbWVcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGlmIChicm93c2VyICYmIGJyb3dzZXIuYnJvd3NlckFjdGlvbikge1xuICAgICAgICB0aGlzLmJyb3dzZXJBY3Rpb24gPSBicm93c2VyLmJyb3dzZXJBY3Rpb25cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgfVxuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFeHRlbnNpb25cbiIsIi8qIEV4dGVuc2lvbi5qc1xuICpcbiAqIEEgbW9kdWxlIGZvciB1bmlmeWluZyBicm93c2VyIGRpZmZlcmVuY2VzIGluIHRoZSBXZWJFeHRlbnNpb24gQVBJLlxuICpcbiAqIEluaXRpYWxseSBpbXBsZW1lbnRlZCBiZWNhdXNlIENocm9tZSBoaWRlcyBhbGwgb2YgdGhlaXIgV2ViRXh0ZW5zaW9uIEFQSVxuICogYmVoaW5kIGEgZ2xvYmFsIGBjaHJvbWVgIHZhcmlhYmxlLCBidXQgd2UnZCBsaWtlIHRvIHN0YXJ0IGdyb29taW5nXG4gKiB0aGUgY29kZS1iYXNlIGZvciBjcm9zcy1icm93c2VyIGV4dGVuc2lvbiBzdXBwb3J0LlxuICpcbiAqIFlvdSBjYW4gcmVhZCBtb3JlIGFib3V0IHRoZSBXZWJFeHRlbnNpb24gQVBJIGhlcmU6XG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9BZGQtb25zL1dlYkV4dGVuc2lvbnNcbiAqL1xuXG5jb25zdCBFeHRlbnNpb24gPSByZXF1aXJlKCcuL2V4dGVuc2lvbi1pbnN0YW5jZScpXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBFeHRlbnNpb24oKVxuIiwiaW1wb3J0IHsgRXh0ZXJuYWxDb25uZWN0b3JCYWNrZW5kIH0gZnJvbSAnLi9saWIvd2ViLWNvbm5lY3RvcidcbmltcG9ydCB7IGV2ZW50UGlwZU91dCB9IGZyb20gJy4vbGliL2V2ZW50LXBpcGUnXG5cbmZ1bmN0aW9uIGluamVjdFNjcmlwdChmaWxlKSB7XG4gIC8vIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAvLyBzY3JpcHQuc3JjID0gZmlsZTtcbiAgLy8gKGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICB2YXIgc2NyaXB0VGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgc2NyaXB0VGFnLnNyYyA9IGZpbGU7XG4gIHNjcmlwdFRhZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcyk7XG4gIH07XG4gIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgLy8gYXBwZW5kIGFzIGZpcnN0IGNoaWxkXG4gIGNvbnRhaW5lci5pbnNlcnRCZWZvcmUoc2NyaXB0VGFnLCBjb250YWluZXIuY2hpbGRyZW5bMF0pO1xufVxuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGluamVjdFNjcmlwdChjaHJvbWUuZXh0ZW5zaW9uLmdldFVSTCgnL3NjcmlwdHMvaW5qZWN0b3IuYnVuZGxlLmpzJykpO1xuICAgIEV4dGVybmFsQ29ubmVjdG9yQmFja2VuZCgpXG4gICAgZXZlbnRQaXBlT3V0KClcbn1cblxuaW5pdCgpXG4iLCIvKipcbiAqIFJlbGF5cyBldmVudHMgZnJvbSB0aGUgYXBwJ3MgYmFja2dyb3VuZCB0byB0aGUgY29udGVudC1zY3JpcHQuXG4gKiBFdmVudHMgc2VudCB0aHJvdWdoIHRoZSBwaXBlIGNhbiBiZSBsaXN0ZW5lZCB0byBpbiB0aGUgY3VycmVudGx5IGFjdGl2ZSB0YWIuXG4gKiBFdmVudHMgY2FuIGJlIHByb3BhZ2F0ZWQgd2l0aCBhIHBheWxvYWQuXG4gKi9cblxuaW1wb3J0IGV4dGVuc2lvbiBmcm9tICdleHRlbnNpb25pemVyJ1xuXG4vLyBVc2VkIGJ5IGJhY2tncm91bmQgdG8gcGlwZSBldmVudHMgdG8gdGhlIGNvbnRlbnQtc2NyaXB0XG5leHBvcnQgZnVuY3Rpb24gZXZlbnRQaXBlSW4oZXZlbnQsIGRhdGEpIHtcbiAgICBleHRlbnNpb24udGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9LCBmdW5jdGlvbih0YWJzKSB7XG4gICAgICAgIGV4dGVuc2lvbi50YWJzLnNlbmRNZXNzYWdlKHRhYnNbMF0uaWQsIHsgZXZlbnQsIGRhdGEgfSlcbiAgICB9KVxufVxuXG4vLyBVc2VkIGJ5IGNvbnRlbnQtc2NyaXB0IHRvIHJlbGF5IGV2ZW50cyBlbWl0dGVkIGJ5IHRoZSBiYWNrZ3JvdW5kXG5leHBvcnQgZnVuY3Rpb24gZXZlbnRQaXBlT3V0KCkge1xuICAgIGV4dGVuc2lvbi5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbihyZXF1ZXN0KSB7XG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KHJlcXVlc3QuZXZlbnQsIHsgZGV0YWlsOiByZXF1ZXN0LmRhdGEgfSkpXG4gICAgfSlcbn0iLCIndXNlIHN0cmljdCdcblxuaW1wb3J0IGV4dGVuc2lvbiBmcm9tICdleHRlbnNpb25pemVyJ1xuXG4vL0JhY2tlbmQgcnVucyBpbiBjb250ZW50LXNjcmlwdFxuZXhwb3J0IGZ1bmN0aW9uIEV4dGVybmFsQ29ubmVjdG9yQmFja2VuZCgpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd3YWxsaWRfcmVxdWVzdCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBleHRlbnNpb24ucnVudGltZS5zZW5kTWVzc2FnZShldmVudC5kZXRhaWwsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudCgnd2FsbGlkX3Jlc3BvbnNlJywgeyBkZXRhaWw6IHJlc3BvbnNlIH0pXG5cbiAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpXG4gICAgICAgIH0pXG4gICAgfSlcbn1cblxuLy9Gcm9udGVuZCBpbmplY3RlZCBpbnRvIHdlYnBhZ2UgY29udGV4dFxuZXhwb3J0IGZ1bmN0aW9uIEV4dGVybmFsQ29ubmVjdG9yRnJvbnRlbmQoKSB7XG4gICAgdmFyIG5vbmNlID0gMFxuICAgIGZ1bmN0aW9uIG5ld1Jlc3BvbnNlTGlzdGVuZXIocmVzb2x2ZSwgcmVqZWN0LCBfbm9uY2UpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGlmKGV2ZW50LmRldGFpbC5ub25jZSA9PSBfbm9uY2UpIHtcbiAgICAgICAgICAgICAgICBpZihldmVudC5kZXRhaWwuZXJyb3IpIHJlamVjdChldmVudC5kZXRhaWwuZXJyb3IpXG4gICAgICAgICAgICAgICAgZWxzZSByZXNvbHZlKGV2ZW50LmRldGFpbC5kYXRhKVxuXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignd2FsbGlkX3Jlc3BvbnNlJywgbGlzdGVuZXIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignd2FsbGlkX3Jlc3BvbnNlJywgbGlzdGVuZXIpXG4gICAgfVxuXG4gICAgY29uc3QgcmVhZHlfZXZlbnQgPSBuZXcgRXZlbnQoJ3dhbGxpZF9ldmVudF9yZWFkeScpXG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChyZWFkeV9ldmVudClcblxuICAgIHJldHVybiBmdW5jdGlvbihtZXRob2QsIHBhcmFtcykge1xuICAgICAgICBjb25zdCBkZXRhaWwgPSB7IG1ldGhvZCwgcGFyYW1zLCBub25jZSwgb3JpZ2luOiB3aW5kb3cubG9jYXRpb24ub3JpZ2luIH1cbiAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ3dhbGxpZF9yZXF1ZXN0JywgeyBkZXRhaWwgfSlcbiAgICAgICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IG5ld1Jlc3BvbnNlTGlzdGVuZXIocmVzb2x2ZSwgcmVqZWN0LCBub25jZSkpXG5cbiAgICAgICAgbm9uY2UrK1xuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuXG4gICAgICAgIHJldHVybiBwcm9taXNlXG4gICAgfVxufSJdLCJzb3VyY2VSb290IjoiIn0=