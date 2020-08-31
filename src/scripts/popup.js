import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import Popup from '../components/Popup'


Vue.use(Vuetify)

new Vue({
	vuetify: new Vuetify({}),
	el: '#app',
	render: h => h(Popup)
})