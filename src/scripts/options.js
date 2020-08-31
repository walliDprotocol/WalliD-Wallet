import Vue from 'vue'
import Options from '../components/Options'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

new Vue({
	vuetify: new Vuetify({}),
	el: '#app',
	render: h => h(Options)
})