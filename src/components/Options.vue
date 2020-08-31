<template>
  <div>
    <div v-if="loading">
      <p>Loading...</p>
    </div>
    <div v-else>
      <p>Mnemonic Phrase</p>
      <p class="mnemonic">{{ mnemonic }}</p>
    </div>
  </div>
</template>

<script>
import * as Bip39 from 'bip39';

export default {
    data () {
        return {
            loading: true,
            mnemonic: "",
        }
    },
    mounted() {
        this.loading = false
        this.mnemonic = Bip39.generateMnemonic()
    }
}
</script>

<style>
body {
    height: 550px;
    width: 15em;
    text-align: center;
    color: #353638;
    font-size: 22px;
    line-height: 30px;
    font-family: Merriweather,Georgia,serif;
    background-size: 200px;
    background-color: black;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-y: hidden;
    overflow-x: hidden;
    scrollbar-width: none;
    max-width: 800px;
    max-height: 600px;
}
</style>