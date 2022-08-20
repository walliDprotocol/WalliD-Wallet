import Vue from 'vue';
import Popup from '../Popup';
import router from '../router';
import i18n from './i18n';
import '../css/style.scss';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import store from '../store';
import VueLogger from 'vuejs-logger';
import mixinPlugin from '../scripts/util';
import extension from 'extensionizer';

import vuetify from '../plugins/vuetify'; // path to vuetify export

extension.browserAction.setBadgeText({ text: null });

Vue.component(VueQrcode.name, VueQrcode);

//Set global is notification var
// Vue.prototype.$notification = true;

const isProduction = process.env.NODE_ENV === 'production';

//initialize logger
const options = {
  isEnabled: !isProduction,
  logLevel: isProduction ? 'error' : 'debug',
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: false,
  separator: '|',
  showConsoleColors: true,
};

Vue.use(VueLogger, options);

//bind api to window
const { API } = extension.extension.getBackgroundPage();
window.$API = API;
Vue.prototype.$API = API;

//bind eventEmitter to window and vue app
const { eventEmitter } = extension.extension.getBackgroundPage();
window.$eventEmitter = eventEmitter;
Vue.prototype.$eventEmitter = eventEmitter;

var filter = function (text, length, clamp = '...') {
  const content = text ? text.toString() : '';

  return content.length > length
    ? content.slice(0, length - 4) +
        clamp +
        content.slice(content.length - 4, content.length)
    : content;
};

Vue.filter('truncate', filter);

Vue.mixin(mixinPlugin);

new Vue({
  vuetify,
  el: '#app',
  router,
  i18n,
  store,
  render: (h) => h(Popup),
});
