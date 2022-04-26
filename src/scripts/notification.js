import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import Popup from '../Popup';
import router from '../router';
import i18n from './i18n';
import '../css/style.scss';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import store from '../store';
import VueLogger from 'vuejs-logger';
import mixinPlugin from '../scripts/util';
import extension from 'extensionizer';

Vue.component(VueQrcode.name, VueQrcode);
Vue.use(Vuetify);

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

var filter = function(text, length, clamp = '...') {
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
  vuetify: new Vuetify({}),
  el: '#app',
  router,
  i18n,
  store,
  render: (h) => h(Popup),
});
