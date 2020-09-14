import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import Popup from "../Popup";
import router from "../router";
import i18n from "./i18n";
import "../css/style.scss";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import store from "../store";
import VueLogger from "vuejs-logger";

Vue.component(VueQrcode.name, VueQrcode);
Vue.use(Vuetify);

const isProduction = process.env.NODE_ENV === "production";

//initialize logger
const options = {
  isEnabled: !isProduction,
  logLevel: isProduction ? "error" : "debug",
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: "|",
  showConsoleColors: true,
};

Vue.use(VueLogger, options);

//bind api to window
const { API } = chrome.extension.getBackgroundPage();

window.$API = API;
Vue.prototype.$API = API;

var filter = function(text, length, clamp) {
  clamp = clamp || "...";
  var node = document.createElement("div");
  node.innerHTML = text;
  var content = node.textContent;
  return content.length > length
    ? content.slice(0, length - 2) +
        clamp +
        content.slice(content.length - 2, content.length)
    : content;
};

Vue.filter("truncate", filter);

new Vue({
  vuetify: new Vuetify({}),
  el: "#app",
  router,
  i18n,
  store,
  render: (h) => h(Popup),
});
