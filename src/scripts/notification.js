import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import Notification from '../components/Notification'


Vue.use(Vuetify)

new Vue({
	vuetify: new Vuetify({}),
	el: '#app',
	render: h => h(Notification)
})