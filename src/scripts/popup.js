import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import Popup from "../Popup";
import router from "./router";
import i18n from "./i18n";
import "../css/style.scss";

Vue.use(Vuetify);

const { API } = chrome.extension.getBackgroundPage();

Vue.prototype.$API = API;

new Vue({
  vuetify: new Vuetify({}),
  el: "#app",
  router,
  i18n,
  render: (h) => h(Popup),
});
