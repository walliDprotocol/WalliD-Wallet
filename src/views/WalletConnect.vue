<template>
  <v-container class="wallet-connect pa-5">
    <v-row>
      <v-col cols="12" class="pt-1">
        <div class="back-arrow mb-2">
          <v-btn text @click="$router.push('/home')" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1">
            WalletConnect
          </h2>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class=" text-left">
        <h4 class="mb-2 sub-title-fields">
          Paste bellow the QR code URL provided by WalletConnect and click
          “connect” to allow this dapp to view your public address. This is an
          important security step to protect your data.
        </h4>

        <label class="normal-text">
          QR code URL:
        </label>
        <div class="wallet-connect">
          <v-text-field
            flat
            solo
            v-model="wc_uri"
            @input="initWalletConnect"
            class="link-input"
            :error-messages="wcErrorMsg"
          >
          </v-text-field>
        </div>
      </v-col>

      <v-col cols="6" class="pr-2">
        <v-btn text class="cancel-btn" @click="$router.push('/home')">
          {{ $t('sites.button[0]') }}
        </v-btn>
      </v-col>
      <v-col cols="6" class="pl-2">
        <v-btn
          text
          class="advance-btn"
          :loading="loading"
          :disabled="!peerId"
          @click="approveConnection"
        >
          {{ $t('buttons.connect') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ArrowBack from '../images/icon-arrow-back.vue';
import IconDropdown from '../images/icon-arrow-dropdown.vue';

import WalletConnect from '../scripts/controllers/walletConnectController';

export default {
  components: {
    ArrowBack,
    IconDropdown,
  },
  computed: {},
  watch: {},
  mounted() {
    this.initializeWalletConnect();
  },
  methods: {
    initializeWalletConnect() {
      console.log('initializeWalletConnect', this.$eventEmitter);
      var self = this;
      this.$eventEmitter.on('walletconnectSessionRequest', ({ peerId }) => {
        console.log('walletconnectSessionRequest', peerId);
        this.peerId = peerId;
        // self.$eventEmitter.emit(
        //   'walletconnectSessionRequest::approved',
        //   peerId
        // );
        // setWalletConnectRequest(true);
        // setWalletConnectRequestInfo(peerInfo);
      });
      WalletConnect.init();
    },
    setState(obj) {
      Object.keys(obj).forEach((e) => (this[e] = obj[e]));
    },
    // Wallet Connect methods
    async initWalletConnect() {
      this.loading = true;
      this.wcErrorMsg = null;
      try {
        if (WalletConnect.isValidUri(this.wc_uri)) {
          console.log(this.wc_uri);
          const res = await this.$store.dispatch('walletConnect/INIT', {
            uri: this.wc_uri,
          });
          console.log('peerId', res);
          this.peerId = res;
          this.loading = false;
        } else {
          console.log('Not a valid WC url');
          this.wcErrorMsg = 'Please add a valid QR code URL';
        }
        // const connector = new WalletConnect({ uri });

        // if (!connector.connected) {
        //   await connector.createSession();
        // }

        // this.connector = connector;

        // this.subscribeToEvents();
      } catch (error) {
        console.log(error);
        // throw error;
      } finally {
        this.loading = false;
      }
    },
    async approveConnection() {
      this.$eventEmitter.emit(
        'walletconnectSessionRequest::approved',
        this.peerId
      );
      // const res2 = await this.$store.dispatch('walletConnect/APPROVE');
      // console.log(res2);
    },
  },
  data() {
    return {
      langs: [
        { id: 'pt', name: 'Português' },
        { id: 'en', name: 'English' },
        { id: 'es', name: 'Español' },
      ],

      // Wallet Connect
      loading: false,
      wc_uri: null,
      peerId: null,
      wcErrorMsg: null,
    };
  },
};
</script>

<style lang="scss">
.full-divider {
  max-width: unset;
  width: 400px;
  margin-left: -20px;
}
.wallet-connect {
  .v-input__slot {
    border-radius: 3px;
    border: solid 1px #b8b9bb;
    input {
      font-size: 13px;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #373c43;
    }
  }
}
</style>
