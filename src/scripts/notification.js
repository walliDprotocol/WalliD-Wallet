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

Vue.component(VueQrcode.name, VueQrcode);

//Set global is notification var
Vue.prototype.$notification = true;

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

var filter = function (text = '', length, clamp = '...', lastChars = 4) {
  const content = text ? text.toString() : '';

  if (clamp === 'start') {
    return content.length > length
      ? content.slice(0, length - lastChars) + '...'
      : content;
  } else {
    return content.length > length
      ? content.slice(0, length - lastChars) +
          clamp +
          content.slice(content.length - lastChars, content.length)
      : content;
  }
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
