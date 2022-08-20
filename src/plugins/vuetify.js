import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

const opts = {
  theme: {
    themes: {
      light: {
        primary: '#009fb1',
        secondary: '#009fb1',
        accent: '#009fb1',
        error: '#e95e5e',
      },
    },
  },
};

export default new Vuetify(opts);
