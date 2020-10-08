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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2V4dGVuc2lvbml6ZXIvZXh0ZW5zaW9uLWluc3RhbmNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9leHRlbnNpb25pemVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2NvbnRlbnQtc2NyaXB0LmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2xpYi9ldmVudC1waXBlLmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2xpYi93ZWItY29ubmVjdG9yLmpzIl0sIm5hbWVzIjpbImluamVjdFNjcmlwdCIsImZpbGUiLCJzY3JpcHRUYWciLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzcmMiLCJvbmxvYWQiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJjb250YWluZXIiLCJoZWFkIiwiZG9jdW1lbnRFbGVtZW50IiwiaW5zZXJ0QmVmb3JlIiwiY2hpbGRyZW4iLCJpbml0IiwiY2hyb21lIiwiZXh0ZW5zaW9uIiwiZ2V0VVJMIiwiRXh0ZXJuYWxDb25uZWN0b3JCYWNrZW5kIiwiZXZlbnRQaXBlT3V0IiwiZXZlbnRQaXBlSW4iLCJldmVudCIsImRhdGEiLCJ0YWJzIiwicXVlcnkiLCJhY3RpdmUiLCJjdXJyZW50V2luZG93Iiwic2VuZE1lc3NhZ2UiLCJpZCIsInJ1bnRpbWUiLCJvbk1lc3NhZ2UiLCJhZGRMaXN0ZW5lciIsInJlcXVlc3QiLCJkaXNwYXRjaEV2ZW50IiwiQ3VzdG9tRXZlbnQiLCJkZXRhaWwiLCJhZGRFdmVudExpc3RlbmVyIiwicmVzcG9uc2UiLCJFeHRlcm5hbENvbm5lY3RvckZyb250ZW5kIiwibm9uY2UiLCJuZXdSZXNwb25zZUxpc3RlbmVyIiwicmVzb2x2ZSIsInJlamVjdCIsIl9ub25jZSIsImxpc3RlbmVyIiwiZXJyb3IiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicmVhZHlfZXZlbnQiLCJFdmVudCIsIm1ldGhvZCIsInBhcmFtcyIsIm9yaWdpbiIsIndpbmRvdyIsImxvY2F0aW9uIiwicHJvbWlzZSIsIlByb21pc2UiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFD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bEIsQ0FBeEM7QUFBQSxLQUFaLENBQWhCO0FBRUFBLFNBQUs7QUFDTHBDLFlBQVEsQ0FBQzhCLGFBQVQsQ0FBdUJaLEtBQXZCO0FBRUEsV0FBT2lDLE9BQVA7QUFDSCxHQVREO0FBVUgsQyIsImZpbGUiOiJjb250ZW50LmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3NjcmlwdHMvY29udGVudC1zY3JpcHQuanNcIik7XG4iLCJjb25zdCBhcGlzID0gW1xuICAnYWxhcm1zJyxcbiAgJ2Jvb2ttYXJrcycsXG4gICdicm93c2VyQWN0aW9uJyxcbiAgJ2NvbW1hbmRzJyxcbiAgJ2NvbnRleHRNZW51cycsXG4gICdjb29raWVzJyxcbiAgJ2Rvd25sb2FkcycsXG4gICdldmVudHMnLFxuICAnZXh0ZW5zaW9uJyxcbiAgJ2V4dGVuc2lvblR5cGVzJyxcbiAgJ2hpc3RvcnknLFxuICAnaTE4bicsXG4gICdpZGxlJyxcbiAgJ25vdGlmaWNhdGlvbnMnLFxuICAncGFnZUFjdGlvbicsXG4gICdydW50aW1lJyxcbiAgJ3N0b3JhZ2UnLFxuICAndGFicycsXG4gICd3ZWJOYXZpZ2F0aW9uJyxcbiAgJ3dlYlJlcXVlc3QnLFxuICAnd2luZG93cycsXG5dXG5cbmNvbnN0IGhhc0Nocm9tZSA9IHR5cGVvZiBjaHJvbWUgIT09ICd1bmRlZmluZWQnXG5jb25zdCBoYXNXaW5kb3cgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuY29uc3QgaGFzQnJvd3NlciA9IHR5cGVvZiBicm93c2VyICE9PSAndW5kZWZpbmVkJ1xuXG5mdW5jdGlvbiBFeHRlbnNpb24gKCkge1xuICBjb25zdCBfdGhpcyA9IHRoaXNcblxuICBhcGlzLmZvckVhY2goZnVuY3Rpb24gKGFwaSkge1xuXG4gICAgX3RoaXNbYXBpXSA9IG51bGxcblxuICAgIGlmIChoYXNDaHJvbWUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChjaHJvbWVbYXBpXSkge1xuICAgICAgICAgIF90aGlzW2FwaV0gPSBjaHJvbWVbYXBpXVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhhc1dpbmRvdykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHdpbmRvd1thcGldKSB7XG4gICAgICAgICAgX3RoaXNbYXBpXSA9IHdpbmRvd1thcGldXG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzQnJvd3Nlcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGJyb3dzZXJbYXBpXSkge1xuICAgICAgICAgIF90aGlzW2FwaV0gPSBicm93c2VyW2FwaV1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgX3RoaXMuYXBpID0gYnJvd3Nlci5leHRlbnNpb25bYXBpXVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgfVxuICAgIH1cbiAgfSlcblxuICBpZiAoaGFzQnJvd3Nlcikge1xuICAgIHRyeSB7XG4gICAgICBpZiAoYnJvd3NlciAmJiBicm93c2VyLnJ1bnRpbWUpIHtcbiAgICAgICAgdGhpcy5ydW50aW1lID0gYnJvd3Nlci5ydW50aW1lXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBpZiAoYnJvd3NlciAmJiBicm93c2VyLmJyb3dzZXJBY3Rpb24pIHtcbiAgICAgICAgdGhpcy5icm93c2VyQWN0aW9uID0gYnJvd3Nlci5icm93c2VyQWN0aW9uXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgIH1cbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gRXh0ZW5zaW9uXG4iLCIvKiBFeHRlbnNpb24uanNcbiAqXG4gKiBBIG1vZHVsZSBmb3IgdW5pZnlpbmcgYnJvd3NlciBkaWZmZXJlbmNlcyBpbiB0aGUgV2ViRXh0ZW5zaW9uIEFQSS5cbiAqXG4gKiBJbml0aWFsbHkgaW1wbGVtZW50ZWQgYmVjYXVzZSBDaHJvbWUgaGlkZXMgYWxsIG9mIHRoZWlyIFdlYkV4dGVuc2lvbiBBUElcbiAqIGJlaGluZCBhIGdsb2JhbCBgY2hyb21lYCB2YXJpYWJsZSwgYnV0IHdlJ2QgbGlrZSB0byBzdGFydCBncm9vbWluZ1xuICogdGhlIGNvZGUtYmFzZSBmb3IgY3Jvc3MtYnJvd3NlciBleHRlbnNpb24gc3VwcG9ydC5cbiAqXG4gKiBZb3UgY2FuIHJlYWQgbW9yZSBhYm91dCB0aGUgV2ViRXh0ZW5zaW9uIEFQSSBoZXJlOlxuICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvQWRkLW9ucy9XZWJFeHRlbnNpb25zXG4gKi9cblxuY29uc3QgRXh0ZW5zaW9uID0gcmVxdWlyZSgnLi9leHRlbnNpb24taW5zdGFuY2UnKVxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRXh0ZW5zaW9uKClcbiIsImltcG9ydCB7IEV4dGVybmFsQ29ubmVjdG9yQmFja2VuZCB9IGZyb20gJy4vbGliL3dlYi1jb25uZWN0b3InXHJcbmltcG9ydCB7IGV2ZW50UGlwZU91dCB9IGZyb20gJy4vbGliL2V2ZW50LXBpcGUnXHJcblxyXG5mdW5jdGlvbiBpbmplY3RTY3JpcHQoZmlsZSkge1xyXG4gIC8vIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG4gIC8vIHNjcmlwdC5zcmMgPSBmaWxlO1xyXG4gIC8vIChkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuICB2YXIgc2NyaXB0VGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuICBzY3JpcHRUYWcuc3JjID0gZmlsZTtcclxuICBzY3JpcHRUYWcub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcyk7XHJcbiAgfTtcclxuICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgLy8gYXBwZW5kIGFzIGZpcnN0IGNoaWxkXHJcbiAgY29udGFpbmVyLmluc2VydEJlZm9yZShzY3JpcHRUYWcsIGNvbnRhaW5lci5jaGlsZHJlblswXSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBpbmplY3RTY3JpcHQoY2hyb21lLmV4dGVuc2lvbi5nZXRVUkwoJy9zY3JpcHRzL2luamVjdG9yLmJ1bmRsZS5qcycpKTtcclxuICAgIEV4dGVybmFsQ29ubmVjdG9yQmFja2VuZCgpXHJcbiAgICBldmVudFBpcGVPdXQoKVxyXG59XHJcblxyXG5pbml0KClcclxuIiwiLyoqXHJcbiAqIFJlbGF5cyBldmVudHMgZnJvbSB0aGUgYXBwJ3MgYmFja2dyb3VuZCB0byB0aGUgY29udGVudC1zY3JpcHQuXHJcbiAqIEV2ZW50cyBzZW50IHRocm91Z2ggdGhlIHBpcGUgY2FuIGJlIGxpc3RlbmVkIHRvIGluIHRoZSBjdXJyZW50bHkgYWN0aXZlIHRhYi5cclxuICogRXZlbnRzIGNhbiBiZSBwcm9wYWdhdGVkIHdpdGggYSBwYXlsb2FkLlxyXG4gKi9cclxuXHJcbmltcG9ydCBleHRlbnNpb24gZnJvbSAnZXh0ZW5zaW9uaXplcidcclxuXHJcbi8vIFVzZWQgYnkgYmFja2dyb3VuZCB0byBwaXBlIGV2ZW50cyB0byB0aGUgY29udGVudC1zY3JpcHRcclxuZXhwb3J0IGZ1bmN0aW9uIGV2ZW50UGlwZUluKGV2ZW50LCBkYXRhKSB7XHJcbiAgICBleHRlbnNpb24udGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9LCBmdW5jdGlvbih0YWJzKSB7XHJcbiAgICAgICAgZXh0ZW5zaW9uLnRhYnMuc2VuZE1lc3NhZ2UodGFic1swXS5pZCwgeyBldmVudCwgZGF0YSB9KVxyXG4gICAgfSlcclxufVxyXG5cclxuLy8gVXNlZCBieSBjb250ZW50LXNjcmlwdCB0byByZWxheSBldmVudHMgZW1pdHRlZCBieSB0aGUgYmFja2dyb3VuZFxyXG5leHBvcnQgZnVuY3Rpb24gZXZlbnRQaXBlT3V0KCkge1xyXG4gICAgZXh0ZW5zaW9uLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uKHJlcXVlc3QpIHtcclxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChyZXF1ZXN0LmV2ZW50LCB7IGRldGFpbDogcmVxdWVzdC5kYXRhIH0pKVxyXG4gICAgfSlcclxufSIsIid1c2Ugc3RyaWN0J1xyXG5cclxuaW1wb3J0IGV4dGVuc2lvbiBmcm9tICdleHRlbnNpb25pemVyJ1xyXG5cclxuLy9CYWNrZW5kIHJ1bnMgaW4gY29udGVudC1zY3JpcHRcclxuZXhwb3J0IGZ1bmN0aW9uIEV4dGVybmFsQ29ubmVjdG9yQmFja2VuZCgpIHtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3dhbGxpZF9yZXF1ZXN0JywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgZXh0ZW5zaW9uLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoZXZlbnQuZGV0YWlsLCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudCgnd2FsbGlkX3Jlc3BvbnNlJywgeyBkZXRhaWw6IHJlc3BvbnNlIH0pXHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59XHJcblxyXG4vL0Zyb250ZW5kIGluamVjdGVkIGludG8gd2VicGFnZSBjb250ZXh0XHJcbmV4cG9ydCBmdW5jdGlvbiBFeHRlcm5hbENvbm5lY3RvckZyb250ZW5kKCkge1xyXG4gICAgdmFyIG5vbmNlID0gMFxyXG4gICAgZnVuY3Rpb24gbmV3UmVzcG9uc2VMaXN0ZW5lcihyZXNvbHZlLCByZWplY3QsIF9ub25jZSkge1xyXG4gICAgICAgIHZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGlmKGV2ZW50LmRldGFpbC5ub25jZSA9PSBfbm9uY2UpIHtcclxuICAgICAgICAgICAgICAgIGlmKGV2ZW50LmRldGFpbC5lcnJvcikgcmVqZWN0KGV2ZW50LmRldGFpbC5lcnJvcilcclxuICAgICAgICAgICAgICAgIGVsc2UgcmVzb2x2ZShldmVudC5kZXRhaWwuZGF0YSlcclxuXHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd3YWxsaWRfcmVzcG9uc2UnLCBsaXN0ZW5lcilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd3YWxsaWRfcmVzcG9uc2UnLCBsaXN0ZW5lcilcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZWFkeV9ldmVudCA9IG5ldyBFdmVudCgnd2FsbGlkX2V2ZW50X3JlYWR5JylcclxuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQocmVhZHlfZXZlbnQpXHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG1ldGhvZCwgcGFyYW1zKSB7XHJcbiAgICAgICAgY29uc3QgZGV0YWlsID0geyBtZXRob2QsIHBhcmFtcywgbm9uY2UsIG9yaWdpbjogd2luZG93LmxvY2F0aW9uLm9yaWdpbiB9XHJcbiAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ3dhbGxpZF9yZXF1ZXN0JywgeyBkZXRhaWwgfSlcclxuICAgICAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gbmV3UmVzcG9uc2VMaXN0ZW5lcihyZXNvbHZlLCByZWplY3QsIG5vbmNlKSlcclxuXHJcbiAgICAgICAgbm9uY2UrK1xyXG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpXHJcblxyXG4gICAgICAgIHJldHVybiBwcm9taXNlXHJcbiAgICB9XHJcbn0iXSwic291cmNlUm9vdCI6IiJ9