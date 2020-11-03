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
console.warn("WalliD: external app connector injected into webpage context");
document.dispatchEvent(new CustomEvent("wallid_event_ready"));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2V4dGVuc2lvbml6ZXIvZXh0ZW5zaW9uLWluc3RhbmNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9leHRlbnNpb25pemVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2luamVjdG9yLmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL2xpYi93ZWItY29ubmVjdG9yLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIndhbGxpZCIsIkV4dGVybmFsQ29ubmVjdG9yRnJvbnRlbmQiLCJjb25zb2xlIiwid2FybiIsImRvY3VtZW50IiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiRXh0ZXJuYWxDb25uZWN0b3JCYWNrZW5kIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwiZXh0ZW5zaW9uIiwicnVudGltZSIsInNlbmRNZXNzYWdlIiwiZGV0YWlsIiwicmVzcG9uc2UiLCJub25jZSIsIm5ld1Jlc3BvbnNlTGlzdGVuZXIiLCJyZXNvbHZlIiwicmVqZWN0IiwiX25vbmNlIiwibGlzdGVuZXIiLCJlcnJvciIsImRhdGEiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibWV0aG9kIiwicGFyYW1zIiwib3JpZ2luIiwibG9jYXRpb24iLCJwcm9taXNlIiwiUHJvbWlzZSJdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMv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YzVDOzs7QUFFRSxTQUFPLFVBQVNJLE1BQVQsRUFBaUJDLE1BQWpCLEVBQXlCO0FBQzlCLFFBQU1aLE1BQU0sR0FBRztBQUFFVyxZQUFNLEVBQU5BLE1BQUY7QUFBVUMsWUFBTSxFQUFOQSxNQUFWO0FBQWtCVixXQUFLLEVBQUxBLEtBQWxCO0FBQXlCVyxZQUFNLEVBQUUzQixNQUFNLENBQUM0QixRQUFQLENBQWdCRDtBQUFqRCxLQUFmO0FBQ0EsUUFBTWpCLEtBQUssR0FBRyxJQUFJSCxXQUFKLENBQWdCLGdCQUFoQixFQUFrQztBQUFFTyxZQUFNLEVBQU5BO0FBQUYsS0FBbEMsQ0FBZDtBQUNBLFFBQU1lLE9BQU8sR0FBRyxJQUFJQyxPQUFKLENBQVksVUFBQ1osT0FBRCxFQUFVQyxNQUFWO0FBQUEsYUFDMUJGLG1CQUFtQixDQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBa0JILEtBQWxCLENBRE87QUFBQSxLQUFaLENBQWhCO0FBSUFBLFNBQUs7QUFDTFgsWUFBUSxDQUFDQyxhQUFULENBQXVCSSxLQUF2QjtBQUVBLFdBQU9tQixPQUFQO0FBQ0QsR0FYRDtBQVlELEMiLCJmaWxlIjoiaW5qZWN0b3IuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvc2NyaXB0cy9pbmplY3Rvci5qc1wiKTtcbiIsImNvbnN0IGFwaXMgPSBbXG4gICdhbGFybXMnLFxuICAnYm9va21hcmtzJyxcbiAgJ2Jyb3dzZXJBY3Rpb24nLFxuICAnY29tbWFuZHMnLFxuICAnY29udGV4dE1lbnVzJyxcbiAgJ2Nvb2tpZXMnLFxuICAnZG93bmxvYWRzJyxcbiAgJ2V2ZW50cycsXG4gICdleHRlbnNpb24nLFxuICAnZXh0ZW5zaW9uVHlwZXMnLFxuICAnaGlzdG9yeScsXG4gICdpMThuJyxcbiAgJ2lkbGUnLFxuICAnbm90aWZpY2F0aW9ucycsXG4gICdwYWdlQWN0aW9uJyxcbiAgJ3J1bnRpbWUnLFxuICAnc3RvcmFnZScsXG4gICd0YWJzJyxcbiAgJ3dlYk5hdmlnYXRpb24nLFxuICAnd2ViUmVxdWVzdCcsXG4gICd3aW5kb3dzJyxcbl1cblxuY29uc3QgaGFzQ2hyb21lID0gdHlwZW9mIGNocm9tZSAhPT0gJ3VuZGVmaW5lZCdcbmNvbnN0IGhhc1dpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG5jb25zdCBoYXNCcm93c2VyID0gdHlwZW9mIGJyb3dzZXIgIT09ICd1bmRlZmluZWQnXG5cbmZ1bmN0aW9uIEV4dGVuc2lvbiAoKSB7XG4gIGNvbnN0IF90aGlzID0gdGhpc1xuXG4gIGFwaXMuZm9yRWFjaChmdW5jdGlvbiAoYXBpKSB7XG5cbiAgICBfdGhpc1thcGldID0gbnVsbFxuXG4gICAgaWYgKGhhc0Nocm9tZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGNocm9tZVthcGldKSB7XG4gICAgICAgICAgX3RoaXNbYXBpXSA9IGNocm9tZVthcGldXG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzV2luZG93KSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAod2luZG93W2FwaV0pIHtcbiAgICAgICAgICBfdGhpc1thcGldID0gd2luZG93W2FwaV1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYXNCcm93c2VyKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoYnJvd3NlclthcGldKSB7XG4gICAgICAgICAgX3RoaXNbYXBpXSA9IGJyb3dzZXJbYXBpXVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBfdGhpcy5hcGkgPSBicm93c2VyLmV4dGVuc2lvblthcGldXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIGlmIChoYXNCcm93c2VyKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChicm93c2VyICYmIGJyb3dzZXIucnVudGltZSkge1xuICAgICAgICB0aGlzLnJ1bnRpbWUgPSBicm93c2VyLnJ1bnRpbWVcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGlmIChicm93c2VyICYmIGJyb3dzZXIuYnJvd3NlckFjdGlvbikge1xuICAgICAgICB0aGlzLmJyb3dzZXJBY3Rpb24gPSBicm93c2VyLmJyb3dzZXJBY3Rpb25cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgfVxuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFeHRlbnNpb25cbiIsIi8qIEV4dGVuc2lvbi5qc1xuICpcbiAqIEEgbW9kdWxlIGZvciB1bmlmeWluZyBicm93c2VyIGRpZmZlcmVuY2VzIGluIHRoZSBXZWJFeHRlbnNpb24gQVBJLlxuICpcbiAqIEluaXRpYWxseSBpbXBsZW1lbnRlZCBiZWNhdXNlIENocm9tZSBoaWRlcyBhbGwgb2YgdGhlaXIgV2ViRXh0ZW5zaW9uIEFQSVxuICogYmVoaW5kIGEgZ2xvYmFsIGBjaHJvbWVgIHZhcmlhYmxlLCBidXQgd2UnZCBsaWtlIHRvIHN0YXJ0IGdyb29taW5nXG4gKiB0aGUgY29kZS1iYXNlIGZvciBjcm9zcy1icm93c2VyIGV4dGVuc2lvbiBzdXBwb3J0LlxuICpcbiAqIFlvdSBjYW4gcmVhZCBtb3JlIGFib3V0IHRoZSBXZWJFeHRlbnNpb24gQVBJIGhlcmU6XG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9BZGQtb25zL1dlYkV4dGVuc2lvbnNcbiAqL1xuXG5jb25zdCBFeHRlbnNpb24gPSByZXF1aXJlKCcuL2V4dGVuc2lvbi1pbnN0YW5jZScpXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBFeHRlbnNpb24oKVxuIiwiaW1wb3J0IHsgRXh0ZXJuYWxDb25uZWN0b3JGcm9udGVuZCB9IGZyb20gXCIuL2xpYi93ZWItY29ubmVjdG9yXCI7XHJcblxyXG53aW5kb3cud2FsbGlkID0gRXh0ZXJuYWxDb25uZWN0b3JGcm9udGVuZCgpO1xyXG5cclxuY29uc29sZS53YXJuKFwiV2FsbGlEOiBleHRlcm5hbCBhcHAgY29ubmVjdG9yIGluamVjdGVkIGludG8gd2VicGFnZSBjb250ZXh0XCIpO1xyXG5kb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChcIndhbGxpZF9ldmVudF9yZWFkeVwiKSk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0IGV4dGVuc2lvbiBmcm9tIFwiZXh0ZW5zaW9uaXplclwiO1xyXG5cclxuLy9CYWNrZW5kIHJ1bnMgaW4gY29udGVudC1zY3JpcHRcclxuZXhwb3J0IGZ1bmN0aW9uIEV4dGVybmFsQ29ubmVjdG9yQmFja2VuZCgpIHtcclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwid2FsbGlkX3JlcXVlc3RcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgIGV4dGVuc2lvbi5ydW50aW1lLnNlbmRNZXNzYWdlKGV2ZW50LmRldGFpbCwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJ3YWxsaWRfcmVzcG9uc2VcIiwgeyBkZXRhaWw6IHJlc3BvbnNlIH0pO1xyXG5cclxuICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufVxyXG5cclxuLy9Gcm9udGVuZCBpbmplY3RlZCBpbnRvIHdlYnBhZ2UgY29udGV4dFxyXG5leHBvcnQgZnVuY3Rpb24gRXh0ZXJuYWxDb25uZWN0b3JGcm9udGVuZCgpIHtcclxuICB2YXIgbm9uY2UgPSAwO1xyXG4gIGZ1bmN0aW9uIG5ld1Jlc3BvbnNlTGlzdGVuZXIocmVzb2x2ZSwgcmVqZWN0LCBfbm9uY2UpIHtcclxuICAgIHZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGlmIChldmVudC5kZXRhaWwubm9uY2UgPT0gX25vbmNlKSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LmRldGFpbC5lcnJvcikgcmVqZWN0KGV2ZW50LmRldGFpbC5lcnJvcik7XHJcbiAgICAgICAgZWxzZSByZXNvbHZlKGV2ZW50LmRldGFpbC5kYXRhKTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIndhbGxpZF9yZXNwb25zZVwiLCBsaXN0ZW5lcik7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwid2FsbGlkX3Jlc3BvbnNlXCIsIGxpc3RlbmVyKTtcclxuICB9XHJcblxyXG4vLyAgIGNvbnN0IHJlYWR5X2V2ZW50ID0gbmV3IEV2ZW50KFwid2FsbGlkX2V2ZW50X3JlYWR5XCIpO1xyXG5cclxuICByZXR1cm4gZnVuY3Rpb24obWV0aG9kLCBwYXJhbXMpIHtcclxuICAgIGNvbnN0IGRldGFpbCA9IHsgbWV0aG9kLCBwYXJhbXMsIG5vbmNlLCBvcmlnaW46IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gfTtcclxuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwid2FsbGlkX3JlcXVlc3RcIiwgeyBkZXRhaWwgfSk7XHJcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT5cclxuICAgICAgbmV3UmVzcG9uc2VMaXN0ZW5lcihyZXNvbHZlLCByZWplY3QsIG5vbmNlKVxyXG4gICAgKTtcclxuXHJcbiAgICBub25jZSsrO1xyXG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcblxyXG4gICAgcmV0dXJuIHByb21pc2U7XHJcbiAgfTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9