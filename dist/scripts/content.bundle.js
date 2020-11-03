/******/ (function(modules) { // webpackBootstrap
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
/*! exports provided: setPort, eventPipeIn, eventPipeOut */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setPort", function() { return setPort; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "eventPipeIn", function() { return eventPipeIn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "eventPipeOut", function() { return eventPipeOut; });
/* harmony import */ var extensionizer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! extensionizer */ "./node_modules/extensionizer/index.js");
/* harmony import */ var extensionizer__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(extensionizer__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Relays events from the app's background to the content-script.
 * Events sent through the pipe can be listened to in the currently active tab.
 * Events can be propagated with a payload.
 */

var msgPort;
function setPort(_msgPort) {
  msgPort = _msgPort;
} // Used by background to pipe events to the content-script

function eventPipeIn(event) {
  msgPort.postMessage({
    event: event
  });
} // Used by content-script to relay events emitted by the background

function eventPipeOut() {
  msgPort = extensionizer__WEBPACK_IMPORTED_MODULE_0___default.a.runtime.connect({
    name: "msgPort"
  }); // fires when background script sends a message

  msgPort.onMessage.addListener(function (msg) {
    console.log(msg);
    document.dispatchEvent(new CustomEvent(msg.event, {
      detail: msg.data
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
  document.addEventListener("wallid_request", function (event) {
    extensionizer__WEBPACK_IMPORTED_MODULE_0___default.a.runtime.sendMessage(event.detail, function (response) {
      var event = new CustomEvent("wallid_response", {
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
        document.removeEventListener("wallid_response", listener);
      }
    };

    document.addEventListener("wallid_response", listener);
  } //   const ready_event = new Event("wallid_event_ready");


  return function (method, params) {
    var detail = {
      method: method,
      params: params,
      nonce: nonce,
      origin: window.location.origin
    };
    var event = new CustomEvent("wallid_request", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2V4dGVuc2lvbml6ZXIvZXh0ZW5zaW9uLWluc3RhbmNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9leHRlbnNpb25pemVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2NvbnRlbnQtc2NyaXB0LmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2xpYi9ldmVudC1waXBlLmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2xpYi93ZWItY29ubmVjdG9yLmpzIl0sIm5hbWVzIjpbImluamVjdFNjcmlwdCIsImZpbGUiLCJzY3JpcHRUYWciLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzcmMiLCJvbmxvYWQiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJjb250YWluZXIiLCJoZWFkIiwiZG9jdW1lbnRFbGVtZW50IiwiaW5zZXJ0QmVmb3JlIiwiY2hpbGRyZW4iLCJpbml0IiwiY2hyb21lIiwiZXh0ZW5zaW9uIiwiZ2V0VVJMIiwiRXh0ZXJuYWxDb25uZWN0b3JCYWNrZW5kIiwiZXZlbnRQaXBlT3V0IiwibXNnUG9ydCIsInNldFBvcnQiLCJfbXNnUG9ydCIsImV2ZW50UGlwZUluIiwiZXZlbnQiLCJwb3N0TWVzc2FnZSIsInJ1bnRpbWUiLCJjb25uZWN0IiwibmFtZSIsIm9uTWVzc2FnZSIsImFkZExpc3RlbmVyIiwibXNnIiwiY29uc29sZSIsImxvZyIsImRpc3BhdGNoRXZlbnQiLCJDdXN0b21FdmVudCIsImRldGFpbCIsImRhdGEiLCJhZGRFdmVudExpc3RlbmVyIiwic2VuZE1lc3NhZ2UiLCJyZXNwb25zZSIsIkV4dGVybmFsQ29ubmVjdG9yRnJvbnRlbmQiLCJub25jZSIsIm5ld1Jlc3BvbnNlTGlzdGVuZXIiLCJyZXNvbHZlIiwicmVqZWN0IiwiX25vbmNlIiwibGlzdGVuZXIiLCJlcnJvciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJtZXRob2QiLCJwYXJhbXMiLCJvcmlnaW4iLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInByb21pc2UiLCJQcm9taXNlIl0sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztB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T0FBUDtBQUNELEdBWEQ7QUFZRCxDIiwiZmlsZSI6ImNvbnRlbnQuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvc2NyaXB0cy9jb250ZW50LXNjcmlwdC5qc1wiKTtcbiIsImNvbnN0IGFwaXMgPSBbXG4gICdhbGFybXMnLFxuICAnYm9va21hcmtzJyxcbiAgJ2Jyb3dzZXJBY3Rpb24nLFxuICAnY29tbWFuZHMnLFxuICAnY29udGV4dE1lbnVzJyxcbiAgJ2Nvb2tpZXMnLFxuICAnZG93bmxvYWRzJyxcbiAgJ2V2ZW50cycsXG4gICdleHRlbnNpb24nLFxuICAnZXh0ZW5zaW9uVHlwZXMnLFxuICAnaGlzdG9yeScsXG4gICdpMThuJyxcbiAgJ2lkbGUnLFxuICAnbm90aWZpY2F0aW9ucycsXG4gICdwYWdlQWN0aW9uJyxcbiAgJ3J1bnRpbWUnLFxuICAnc3RvcmFnZScsXG4gICd0YWJzJyxcbiAgJ3dlYk5hdmlnYXRpb24nLFxuICAnd2ViUmVxdWVzdCcsXG4gICd3aW5kb3dzJyxcbl1cblxuY29uc3QgaGFzQ2hyb21lID0gdHlwZW9mIGNocm9tZSAhPT0gJ3VuZGVmaW5lZCdcbmNvbnN0IGhhc1dpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG5jb25zdCBoYXNCcm93c2VyID0gdHlwZW9mIGJyb3dzZXIgIT09ICd1bmRlZmluZWQnXG5cbmZ1bmN0aW9uIEV4dGVuc2lvbiAoKSB7XG4gIGNvbnN0IF90aGlzID0gdGhpc1xuXG4gIGFwaXMuZm9yRWFjaChmdW5jdGlvbiAoYXBpKSB7XG5cbiAgICBfdGhpc1thcGldID0gbnVsbFxuXG4gICAgaWYgKGhhc0Nocm9tZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGNocm9tZVthcGldKSB7XG4gICAgICAgICAgX3RoaXNbYXBpXSA9IGNocm9tZVthcGldXG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzV2luZG93KSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAod2luZG93W2FwaV0pIHtcbiAgICAgICAgICBfdGhpc1thcGldID0gd2luZG93W2FwaV1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYXNCcm93c2VyKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoYnJvd3NlclthcGldKSB7XG4gICAgICAgICAgX3RoaXNbYXBpXSA9IGJyb3dzZXJbYXBpXVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBfdGhpcy5hcGkgPSBicm93c2VyLmV4dGVuc2lvblthcGldXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIGlmIChoYXNCcm93c2VyKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChicm93c2VyICYmIGJyb3dzZXIucnVudGltZSkge1xuICAgICAgICB0aGlzLnJ1bnRpbWUgPSBicm93c2VyLnJ1bnRpbWVcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGlmIChicm93c2VyICYmIGJyb3dzZXIuYnJvd3NlckFjdGlvbikge1xuICAgICAgICB0aGlzLmJyb3dzZXJBY3Rpb24gPSBicm93c2VyLmJyb3dzZXJBY3Rpb25cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgfVxuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFeHRlbnNpb25cbiIsIi8qIEV4dGVuc2lvbi5qc1xuICpcbiAqIEEgbW9kdWxlIGZvciB1bmlmeWluZyBicm93c2VyIGRpZmZlcmVuY2VzIGluIHRoZSBXZWJFeHRlbnNpb24gQVBJLlxuICpcbiAqIEluaXRpYWxseSBpbXBsZW1lbnRlZCBiZWNhdXNlIENocm9tZSBoaWRlcyBhbGwgb2YgdGhlaXIgV2ViRXh0ZW5zaW9uIEFQSVxuICogYmVoaW5kIGEgZ2xvYmFsIGBjaHJvbWVgIHZhcmlhYmxlLCBidXQgd2UnZCBsaWtlIHRvIHN0YXJ0IGdyb29taW5nXG4gKiB0aGUgY29kZS1iYXNlIGZvciBjcm9zcy1icm93c2VyIGV4dGVuc2lvbiBzdXBwb3J0LlxuICpcbiAqIFlvdSBjYW4gcmVhZCBtb3JlIGFib3V0IHRoZSBXZWJFeHRlbnNpb24gQVBJIGhlcmU6XG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9BZGQtb25zL1dlYkV4dGVuc2lvbnNcbiAqL1xuXG5jb25zdCBFeHRlbnNpb24gPSByZXF1aXJlKCcuL2V4dGVuc2lvbi1pbnN0YW5jZScpXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBFeHRlbnNpb24oKVxuIiwiaW1wb3J0IHsgRXh0ZXJuYWxDb25uZWN0b3JCYWNrZW5kIH0gZnJvbSAnLi9saWIvd2ViLWNvbm5lY3RvcidcclxuaW1wb3J0IHsgZXZlbnRQaXBlT3V0IH0gZnJvbSAnLi9saWIvZXZlbnQtcGlwZSdcclxuXHJcbmZ1bmN0aW9uIGluamVjdFNjcmlwdChmaWxlKSB7XHJcbiAgdmFyIHNjcmlwdFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcbiAgc2NyaXB0VGFnLnNyYyA9IGZpbGU7XHJcbiAgc2NyaXB0VGFnLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMpO1xyXG4gIH07XHJcbiAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gIC8vIGFwcGVuZCBhcyBmaXJzdCBjaGlsZFxyXG4gIGNvbnRhaW5lci5pbnNlcnRCZWZvcmUoc2NyaXB0VGFnLCBjb250YWluZXIuY2hpbGRyZW5bMF0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0KCkge1xyXG4gICAgaW5qZWN0U2NyaXB0KGNocm9tZS5leHRlbnNpb24uZ2V0VVJMKCcvc2NyaXB0cy9pbmplY3Rvci5idW5kbGUuanMnKSk7XHJcbiAgICBFeHRlcm5hbENvbm5lY3RvckJhY2tlbmQoKVxyXG4gICAgZXZlbnRQaXBlT3V0KClcclxufVxyXG5cclxuaW5pdCgpXHJcbiIsIi8qKlxyXG4gKiBSZWxheXMgZXZlbnRzIGZyb20gdGhlIGFwcCdzIGJhY2tncm91bmQgdG8gdGhlIGNvbnRlbnQtc2NyaXB0LlxyXG4gKiBFdmVudHMgc2VudCB0aHJvdWdoIHRoZSBwaXBlIGNhbiBiZSBsaXN0ZW5lZCB0byBpbiB0aGUgY3VycmVudGx5IGFjdGl2ZSB0YWIuXHJcbiAqIEV2ZW50cyBjYW4gYmUgcHJvcGFnYXRlZCB3aXRoIGEgcGF5bG9hZC5cclxuICovXHJcblxyXG5pbXBvcnQgZXh0ZW5zaW9uIGZyb20gXCJleHRlbnNpb25pemVyXCI7XHJcblxyXG52YXIgbXNnUG9ydDtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRQb3J0KF9tc2dQb3J0KSB7XHJcbiAgbXNnUG9ydCA9IF9tc2dQb3J0O1xyXG59XHJcbi8vIFVzZWQgYnkgYmFja2dyb3VuZCB0byBwaXBlIGV2ZW50cyB0byB0aGUgY29udGVudC1zY3JpcHRcclxuZXhwb3J0IGZ1bmN0aW9uIGV2ZW50UGlwZUluKGV2ZW50KSB7XHJcbiAgbXNnUG9ydC5wb3N0TWVzc2FnZSh7IGV2ZW50IH0pO1xyXG59XHJcblxyXG4vLyBVc2VkIGJ5IGNvbnRlbnQtc2NyaXB0IHRvIHJlbGF5IGV2ZW50cyBlbWl0dGVkIGJ5IHRoZSBiYWNrZ3JvdW5kXHJcbmV4cG9ydCBmdW5jdGlvbiBldmVudFBpcGVPdXQoKSB7XHJcbiAgbXNnUG9ydCA9IGV4dGVuc2lvbi5ydW50aW1lLmNvbm5lY3QoeyBuYW1lOiBcIm1zZ1BvcnRcIiB9KTtcclxuXHJcbiAgLy8gZmlyZXMgd2hlbiBiYWNrZ3JvdW5kIHNjcmlwdCBzZW5kcyBhIG1lc3NhZ2VcclxuICBtc2dQb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbihtc2cpIHtcclxuICAgIGNvbnNvbGUubG9nKG1zZyk7XHJcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChtc2cuZXZlbnQsIHsgZGV0YWlsOiBtc2cuZGF0YSB9KSk7XHJcbiAgfSk7XHJcbn1cclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5pbXBvcnQgZXh0ZW5zaW9uIGZyb20gXCJleHRlbnNpb25pemVyXCI7XHJcblxyXG4vL0JhY2tlbmQgcnVucyBpbiBjb250ZW50LXNjcmlwdFxyXG5leHBvcnQgZnVuY3Rpb24gRXh0ZXJuYWxDb25uZWN0b3JCYWNrZW5kKCkge1xyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ3YWxsaWRfcmVxdWVzdFwiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgZXh0ZW5zaW9uLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoZXZlbnQuZGV0YWlsLCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudChcIndhbGxpZF9yZXNwb25zZVwiLCB7IGRldGFpbDogcmVzcG9uc2UgfSk7XHJcblxyXG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59XHJcblxyXG4vL0Zyb250ZW5kIGluamVjdGVkIGludG8gd2VicGFnZSBjb250ZXh0XHJcbmV4cG9ydCBmdW5jdGlvbiBFeHRlcm5hbENvbm5lY3RvckZyb250ZW5kKCkge1xyXG4gIHZhciBub25jZSA9IDA7XHJcbiAgZnVuY3Rpb24gbmV3UmVzcG9uc2VMaXN0ZW5lcihyZXNvbHZlLCByZWplY3QsIF9ub25jZSkge1xyXG4gICAgdmFyIGxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgaWYgKGV2ZW50LmRldGFpbC5ub25jZSA9PSBfbm9uY2UpIHtcclxuICAgICAgICBpZiAoZXZlbnQuZGV0YWlsLmVycm9yKSByZWplY3QoZXZlbnQuZGV0YWlsLmVycm9yKTtcclxuICAgICAgICBlbHNlIHJlc29sdmUoZXZlbnQuZGV0YWlsLmRhdGEpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwid2FsbGlkX3Jlc3BvbnNlXCIsIGxpc3RlbmVyKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ3YWxsaWRfcmVzcG9uc2VcIiwgbGlzdGVuZXIpO1xyXG4gIH1cclxuXHJcbi8vICAgY29uc3QgcmVhZHlfZXZlbnQgPSBuZXcgRXZlbnQoXCJ3YWxsaWRfZXZlbnRfcmVhZHlcIik7XHJcblxyXG4gIHJldHVybiBmdW5jdGlvbihtZXRob2QsIHBhcmFtcykge1xyXG4gICAgY29uc3QgZGV0YWlsID0geyBtZXRob2QsIHBhcmFtcywgbm9uY2UsIG9yaWdpbjogd2luZG93LmxvY2F0aW9uLm9yaWdpbiB9O1xyXG4gICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJ3YWxsaWRfcmVxdWVzdFwiLCB7IGRldGFpbCB9KTtcclxuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxyXG4gICAgICBuZXdSZXNwb25zZUxpc3RlbmVyKHJlc29sdmUsIHJlamVjdCwgbm9uY2UpXHJcbiAgICApO1xyXG5cclxuICAgIG5vbmNlKys7XHJcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuXHJcbiAgICByZXR1cm4gcHJvbWlzZTtcclxuICB9O1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=