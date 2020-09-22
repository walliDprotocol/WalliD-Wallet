<template>
  <div class="main-box">
	<div class="main-box">
		<div class="third-height">
			<p>Type:</p>
			<p id="addr">{{ notification.type }}</p>
		</div>
		<div>
			<v-btn block color="secondary" dark @click="execute">Execute</v-btn>
		</div>
		<div>
			<v-btn block color="secondary" dark @click="reject">Reject</v-btn>
		</div>
	</div>
  </div>
</template>

<script>
const { API } = chrome.extension.getBackgroundPage()
import * as bip39 from 'bip39'

export default {
	data() {
		const _state = API.getState()
		const state = {
			url: '',
			password: "",
			address: _state.address,
			initialized: _state.initialized,
            unlocked: _state.unlocked,
            notification: API.getNextRequest()
		}

		console.log('DATA', state)

		return state
	},
	mounted() {
		console.log('MOUNTED', this.initialized)
	},
    methods: {
		execute() {
			Promise.resolve(this.notification.callback(null, 'EXECUTED'))
				.then(() => window.close())
		},
		reject() {
			Promise.resolve(this.notification.callback('REJECTED'))
				.then(() => window.close())
		},
		refreshState() {
			const appState = API.getState()

			this.initialized = appState.initialized
			this.unlocked = appState.unlocked
			this.address = appState.address

			console.log('APP STATE', appState)
		}
    }
}
</script>

<style>
#addr {
	font-size: 0.5em;
}

.title {
	padding-top: 10%;
}

.password {
	padding-left: 2%;
	padding-right: 2%;
}

.third-height {
	width: 100%;
	height: 33%;
}

.main-box {
	width: 100%;
	height: 100%;
}

body {
    height: 550px;
    width: 15em;
	max-width: 800px;
    max-height: 600px;
    text-align: center;
    color: #353638;
    font-size: 1.5em;
    font-family: Arial,Verdana,serif;
    background-color: white;
    color: block;
    display: flex;
    align-items: center;
    justify-content: center;
	padding: 1em;
}
</style>