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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/scripts/injector.js");
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

/***/ "./src/scripts/injector.js":
/*!*********************************!*\
  !*** ./src/scripts/injector.js ***!
  \*********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_web_connector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/web-connector */ "./src/scripts/lib/web-connector.js");

window.wallid = Object(_lib_web_connector__WEBPACK_IMPORTED_MODULE_0__["ExternalConnectorFrontend"])();
console.warn('WalliD: external app connector injected into webpage context');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2V4dGVuc2lvbml6ZXIvZXh0ZW5zaW9uLWluc3RhbmNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9leHRlbnNpb25pemVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2luamVjdG9yLmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2xpYi93ZWItY29ubmVjdG9yLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIndhbGxpZCIsIkV4dGVybmFsQ29ubmVjdG9yRnJvbnRlbmQiLCJjb25zb2xlIiwid2FybiIsIkV4dGVybmFsQ29ubmVjdG9yQmFja2VuZCIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwiZXh0ZW5zaW9uIiwicnVudGltZSIsInNlbmRNZXNzYWdlIiwiZGV0YWlsIiwicmVzcG9uc2UiLCJDdXN0b21FdmVudCIsImRpc3BhdGNoRXZlbnQiLCJub25jZSIsIm5ld1Jlc3BvbnNlTGlzdGVuZXIiLCJyZXNvbHZlIiwicmVqZWN0IiwiX25vbmNlIiwibGlzdGVuZXIiLCJlcnJvciIsImRhdGEiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicmVhZHlfZXZlbnQiLCJFdmVudCIsIm1ldGhvZCIsInBhcmFtcyIsIm9yaWdpbiIsImxvY2F0aW9uIiwicHJvbWlzZSIsIlByb21pc2UiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFF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QUFwQjtBQUNBcEIsVUFBUSxDQUFDUyxhQUFULENBQXVCVSxXQUF2QjtBQUVBLFNBQU8sVUFBU0UsTUFBVCxFQUFpQkMsTUFBakIsRUFBeUI7QUFDNUIsUUFBTWhCLE1BQU0sR0FBRztBQUFFZSxZQUFNLEVBQU5BLE1BQUY7QUFBVUMsWUFBTSxFQUFOQSxNQUFWO0FBQWtCWixXQUFLLEVBQUxBLEtBQWxCO0FBQXlCYSxZQUFNLEVBQUU3QixNQUFNLENBQUM4QixRQUFQLENBQWdCRDtBQUFqRCxLQUFmO0FBQ0EsUUFBTXJCLEtBQUssR0FBRyxJQUFJTSxXQUFKLENBQWdCLGdCQUFoQixFQUFrQztBQUFFRixZQUFNLEVBQU5BO0FBQUYsS0FBbEMsQ0FBZDtBQUNBLFFBQU1tQixPQUFPLEdBQUcsSUFBSUMsT0FBSixDQUFZLFVBQUNkLE9BQUQsRUFBVUMsTUFBVjtBQUFBLGFBQXFCRixtQkFBbUIsQ0FBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQWtCSCxLQUFsQixDQUF4QztBQUFBLEtBQVosQ0FBaEI7QUFFQUEsU0FBSztBQUNMVixZQUFRLENBQUNTLGFBQVQsQ0FBdUJQLEtBQXZCO0FBRUEsV0FBT3VCLE9BQVA7QUFDSCxHQVREO0FBVUgsQyIsImZpbGUiOiJpbmplY3Rvci5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9zY3JpcHRzL2luamVjdG9yLmpzXCIpO1xuIiwiY29uc3QgYXBpcyA9IFtcbiAgJ2FsYXJtcycsXG4gICdib29rbWFya3MnLFxuICAnYnJvd3NlckFjdGlvbicsXG4gICdjb21tYW5kcycsXG4gICdjb250ZXh0TWVudXMnLFxuICAnY29va2llcycsXG4gICdkb3dubG9hZHMnLFxuICAnZXZlbnRzJyxcbiAgJ2V4dGVuc2lvbicsXG4gICdleHRlbnNpb25UeXBlcycsXG4gICdoaXN0b3J5JyxcbiAgJ2kxOG4nLFxuICAnaWRsZScsXG4gICdub3RpZmljYXRpb25zJyxcbiAgJ3BhZ2VBY3Rpb24nLFxuICAncnVudGltZScsXG4gICdzdG9yYWdlJyxcbiAgJ3RhYnMnLFxuICAnd2ViTmF2aWdhdGlvbicsXG4gICd3ZWJSZXF1ZXN0JyxcbiAgJ3dpbmRvd3MnLFxuXVxuXG5jb25zdCBoYXNDaHJvbWUgPSB0eXBlb2YgY2hyb21lICE9PSAndW5kZWZpbmVkJ1xuY29uc3QgaGFzV2luZG93ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbmNvbnN0IGhhc0Jyb3dzZXIgPSB0eXBlb2YgYnJvd3NlciAhPT0gJ3VuZGVmaW5lZCdcblxuZnVuY3Rpb24gRXh0ZW5zaW9uICgpIHtcbiAgY29uc3QgX3RoaXMgPSB0aGlzXG5cbiAgYXBpcy5mb3JFYWNoKGZ1bmN0aW9uIChhcGkpIHtcblxuICAgIF90aGlzW2FwaV0gPSBudWxsXG5cbiAgICBpZiAoaGFzQ2hyb21lKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoY2hyb21lW2FwaV0pIHtcbiAgICAgICAgICBfdGhpc1thcGldID0gY2hyb21lW2FwaV1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYXNXaW5kb3cpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICh3aW5kb3dbYXBpXSkge1xuICAgICAgICAgIF90aGlzW2FwaV0gPSB3aW5kb3dbYXBpXVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhhc0Jyb3dzZXIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChicm93c2VyW2FwaV0pIHtcbiAgICAgICAgICBfdGhpc1thcGldID0gYnJvd3NlclthcGldXG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIF90aGlzLmFwaSA9IGJyb3dzZXIuZXh0ZW5zaW9uW2FwaV1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbiAgaWYgKGhhc0Jyb3dzZXIpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKGJyb3dzZXIgJiYgYnJvd3Nlci5ydW50aW1lKSB7XG4gICAgICAgIHRoaXMucnVudGltZSA9IGJyb3dzZXIucnVudGltZVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgaWYgKGJyb3dzZXIgJiYgYnJvd3Nlci5icm93c2VyQWN0aW9uKSB7XG4gICAgICAgIHRoaXMuYnJvd3NlckFjdGlvbiA9IGJyb3dzZXIuYnJvd3NlckFjdGlvblxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICB9XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEV4dGVuc2lvblxuIiwiLyogRXh0ZW5zaW9uLmpzXG4gKlxuICogQSBtb2R1bGUgZm9yIHVuaWZ5aW5nIGJyb3dzZXIgZGlmZmVyZW5jZXMgaW4gdGhlIFdlYkV4dGVuc2lvbiBBUEkuXG4gKlxuICogSW5pdGlhbGx5IGltcGxlbWVudGVkIGJlY2F1c2UgQ2hyb21lIGhpZGVzIGFsbCBvZiB0aGVpciBXZWJFeHRlbnNpb24gQVBJXG4gKiBiZWhpbmQgYSBnbG9iYWwgYGNocm9tZWAgdmFyaWFibGUsIGJ1dCB3ZSdkIGxpa2UgdG8gc3RhcnQgZ3Jvb21pbmdcbiAqIHRoZSBjb2RlLWJhc2UgZm9yIGNyb3NzLWJyb3dzZXIgZXh0ZW5zaW9uIHN1cHBvcnQuXG4gKlxuICogWW91IGNhbiByZWFkIG1vcmUgYWJvdXQgdGhlIFdlYkV4dGVuc2lvbiBBUEkgaGVyZTpcbiAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL0FkZC1vbnMvV2ViRXh0ZW5zaW9uc1xuICovXG5cbmNvbnN0IEV4dGVuc2lvbiA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9uLWluc3RhbmNlJylcbm1vZHVsZS5leHBvcnRzID0gbmV3IEV4dGVuc2lvbigpXG4iLCJpbXBvcnQgeyBFeHRlcm5hbENvbm5lY3RvckZyb250ZW5kIH0gZnJvbSAnLi9saWIvd2ViLWNvbm5lY3RvcidcclxuXHJcbndpbmRvdy53YWxsaWQgPSBFeHRlcm5hbENvbm5lY3RvckZyb250ZW5kKClcclxuXHJcbmNvbnNvbGUud2FybignV2FsbGlEOiBleHRlcm5hbCBhcHAgY29ubmVjdG9yIGluamVjdGVkIGludG8gd2VicGFnZSBjb250ZXh0JykiLCIndXNlIHN0cmljdCdcclxuXHJcbmltcG9ydCBleHRlbnNpb24gZnJvbSAnZXh0ZW5zaW9uaXplcidcclxuXHJcbi8vQmFja2VuZCBydW5zIGluIGNvbnRlbnQtc2NyaXB0XHJcbmV4cG9ydCBmdW5jdGlvbiBFeHRlcm5hbENvbm5lY3RvckJhY2tlbmQoKSB7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd3YWxsaWRfcmVxdWVzdCcsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGV4dGVuc2lvbi5ydW50aW1lLnNlbmRNZXNzYWdlKGV2ZW50LmRldGFpbCwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ3dhbGxpZF9yZXNwb25zZScsIHsgZGV0YWlsOiByZXNwb25zZSB9KVxyXG5cclxuICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudClcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxufVxyXG5cclxuLy9Gcm9udGVuZCBpbmplY3RlZCBpbnRvIHdlYnBhZ2UgY29udGV4dFxyXG5leHBvcnQgZnVuY3Rpb24gRXh0ZXJuYWxDb25uZWN0b3JGcm9udGVuZCgpIHtcclxuICAgIHZhciBub25jZSA9IDBcclxuICAgIGZ1bmN0aW9uIG5ld1Jlc3BvbnNlTGlzdGVuZXIocmVzb2x2ZSwgcmVqZWN0LCBfbm9uY2UpIHtcclxuICAgICAgICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICBpZihldmVudC5kZXRhaWwubm9uY2UgPT0gX25vbmNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZihldmVudC5kZXRhaWwuZXJyb3IpIHJlamVjdChldmVudC5kZXRhaWwuZXJyb3IpXHJcbiAgICAgICAgICAgICAgICBlbHNlIHJlc29sdmUoZXZlbnQuZGV0YWlsLmRhdGEpXHJcblxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignd2FsbGlkX3Jlc3BvbnNlJywgbGlzdGVuZXIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignd2FsbGlkX3Jlc3BvbnNlJywgbGlzdGVuZXIpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVhZHlfZXZlbnQgPSBuZXcgRXZlbnQoJ3dhbGxpZF9ldmVudF9yZWFkeScpXHJcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KHJlYWR5X2V2ZW50KVxyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbihtZXRob2QsIHBhcmFtcykge1xyXG4gICAgICAgIGNvbnN0IGRldGFpbCA9IHsgbWV0aG9kLCBwYXJhbXMsIG5vbmNlLCBvcmlnaW46IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gfVxyXG4gICAgICAgIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KCd3YWxsaWRfcmVxdWVzdCcsIHsgZGV0YWlsIH0pXHJcbiAgICAgICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IG5ld1Jlc3BvbnNlTGlzdGVuZXIocmVzb2x2ZSwgcmVqZWN0LCBub25jZSkpXHJcblxyXG4gICAgICAgIG5vbmNlKytcclxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KVxyXG5cclxuICAgICAgICByZXR1cm4gcHJvbWlzZVxyXG4gICAgfVxyXG59Il0sInNvdXJjZVJvb3QiOiIifQ==