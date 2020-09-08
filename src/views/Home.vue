<template>
  <div class="main-box">
    <div class="title third-height">
      <p style="font-weight: bold">Home</p>
      <p>Locked: {{ !unlocked }} &nbsp;&nbsp; Init: {{ initialized }}</p>
    </div>
  </div>
</template>

<script>
import * as bip39 from "bip39";
export default {
  data() {
    return {
      address:  '0xe909c6d01F5111e1B6B6Da8D1988962262B9D777', //this.$API.getState().address,
      initialized: true,// this.$API.getState().initialized,
      unlocked: true,// this.$API.getState().unlocked,
    };
  },
};
</script>

<style>

</style>
