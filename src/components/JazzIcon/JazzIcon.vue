<template>
  <div class="">
    <v-img
      v-if="avatarENS"
      class="mx-auto"
      style="border-radius: 50%"
      contain
      :width="size"
      :height="size"
      :src="avatarENS"
    ></v-img>
    <div
      v-else
      :class="connected ? 'connected-site' : ''"
      :id="'metamask-logo-' + id"
    ></div>
  </div>
</template>

<script>
import jazzicon from 'jazzicon';
import { mapState } from 'vuex';
export default {
  props: ['size', 'margin', 'id', 'address'],
  computed: {
    ...mapState(['avatarENS']),
  },
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
          var styles = el.getAttribute('style');
          styles = styles.concat(' margin: ' + margin + 'px;');
          el.setAttribute('style', styles);
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

<style></style>
