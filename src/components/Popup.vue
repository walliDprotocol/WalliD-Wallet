<template>
  <div class="main-box">
	<div class="title third-height">
		<p style="font-weight: bold">WalliD Plugin</p>
		<p>Locked: {{ !unlocked }} &nbsp;&nbsp; Init: {{ initialized }}</p>
	</div>
	<div class="main-box" v-if="!unlocked">
		<v-text-field
			v-model="password"
			name="input-10-2"
			label="Password"
			type="password"
			class="input-group--focused third-height password"
			
		></v-text-field>
		<div class="third-height">
			<v-btn block color="secondary" dark @click="unlockPlugin">Unlock</v-btn>
		</div>
	</div>
	<div class="main-box" v-else>
		<div class="third-height">
			<p>Address:</p>
			<p id="addr">{{ address }}</p>
		</div>
		<div>
			<v-btn block color="secondary" dark @click="lockPlugin">Lock</v-btn>
		</div>
		<div>
			<v-btn block color="secondary" dark @click="resetPlugin">Reset</v-btn>
		</div>
	</div>
  </div>
</template>

<script>
const { API } = chrome.extension.getBackgroundPage()
import * as bip39 from 'bip39'

console.log('API', API)
export default {
	data() {
		console.log('DATA', API.getState())
		return {
			password: "",
			address: API.getState().address,
			initialized: API.getState().initialized,
			unlocked: API.getState().unlocked
		}
	},
	mounted() {
		console.log('MOUNTED', this.initialized)
		//API.createNewVault(bip39.generateMnemonic(), 'jamado')
	},
    methods: {
		unlockPlugin() {
			API.verifyPassword(this.password)
				.then(r => console.log('RES', r))
				.catch(e => console.log('POPUP VERIFY PASSWORD ERROR', e))

			//API.unlockApp(this.password)
			//.then(() => this.refreshState())
		},

		lockPlugin() {
			API.lockApp()
			.then(this.refreshState())
		},

		resetPlugin() {
			API.deleteVault(this.password)
			.then(this.refreshState())
		},

		refreshState() {
			const appState = API.getState()

			this.initialized = appState.initialized
			this.unlocked = appState.unlocked
			this.address = appState.address
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