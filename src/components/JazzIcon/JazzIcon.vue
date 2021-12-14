<template>
  <div
    :class="connected ? 'connected-site' : ''"
    :id="'metamask-logo-' + id"
    :style="{
      width: size + (margin + 2) * 2 + 'px',
      height: size + (margin + 2) * 2 + 'px',
      padding: margin + 'px',
    }"
  ></div>
</template>

<script>
import jazzicon from 'jazzicon';
import { mapGetters } from 'vuex';
export default {
  props: ['size', 'margin', 'id', 'address'],
  watch: {
    address(value) {
      if (value) {
        this.setIconWallet(this.size, this.margin, this.id, this.address);
      }
    },
  },
  mounted() {
    this.setIconWallet(this.size, this.margin, this.id, this.address);
  },
  methods: {
    setIconWallet(size, margin, id, address) {
      if (address) {
        let body = document.getElementById('metamask-logo-' + id);
        let icon = document.getElementById('metamask-logo-' + id + '-icon');
        if (body && !icon) {
          let acc = parseInt(address.slice(2, 10), 16);
          var el = jazzicon(size, acc);
          el.id = 'metamask-logo-' + id + '-icon';
          el.classList.add('icon');

          body.insertBefore(el, body.firstChild);

          //   this.iconSet = true;
        }
      }
    },
  },
};
</script>

<style lang="scss">
[id^='metamask-logo-request']:not([class*='icon']) {
  max-height: 72px;
  max-width: 72px;

  border-radius: 50%;
  border: solid 2px #b8b9bb;
  margin: auto;
  margin-bottom: 12px;
  // margin-left: 0;
  .connected & {
    border: solid 2px var(--turquoise-green);
  }
}
</style>
