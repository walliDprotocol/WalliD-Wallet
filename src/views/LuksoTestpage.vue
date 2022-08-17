<template>
  <v-container class="details-wallet test-page">
    <v-row>
      <v-col cols="12" class="pt-1">
        <div class="back-arrow mb-4">
          <v-btn text @click="$router.push('/home')" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1">Lukso TestPage</h2>
        </div>
      </v-col>
    </v-row>
    <v-row class="darker-background mt-8">
      <v-col cols="12" class="pt-2 pb-2">
        <v-btn text class="advance-btn" @click="createUP()">
          {{ 'Create Universal Profile' }}
        </v-btn>
        <v-text-field
          v-model="UPAddressToImport"
          solo
          flat
          class="password-input seed-phrase mt-1"
          name="input-password-login"
          hide-details
        >
        </v-text-field>
        <v-btn text class="advance-btn" @click="importUP()">
          {{ 'Import Universal Profile' }}
        </v-btn>
      </v-col>
      <v-col cols="12" class="pt-2">
        <v-btn text class="advance-btn" @click="fetchProfile()">
          {{ 'fetch Universal Profile' }}
        </v-btn>
        <v-btn text class="advance-btn" @click="fetchVaults()">
          {{ 'fetch vault' }}
        </v-btn>
        <v-btn text class="advance-btn" @click="createVaultOnUP()">
          {{ 'createVaultOnUP' }}
        </v-btn>
        {{ newVaultAddress }}
        <v-btn text class="advance-btn" @click="transferLSP7Tokens()">
          {{ 'transferLSP7Tokens' }}
        </v-btn>
      </v-col>
      <v-col cols="12" class="pb-1 pt-2">
        UPAddress
        <wallet-address class="" :forced-address="UPAddress" />
        KMAddress
        <wallet-address class="" :forced-address="KMAddress" />
      </v-col>
      <v-col cols="12" class="pt-2 pb-1" v-for="key in profile" :key="key.key">
        {{ key.name }}
        {{ JSON.stringify(key.value) }}
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import WalletAddress from '../components/WalletAddress';
import WalletState from '../components/WalletState';
import ArrowBack from '../images/icon-arrow-back.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    WalletAddress,
    WalletState,
    ArrowBack,
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(['address']),
    ...mapState({
      walletAddress: 'address',
      domainENS: 'domainENS',
    }),
    ...mapState('lukso', {
      UPAddress: 'UPAddress',
      KMAddress: 'KMAddress',
    }),
  },
  methods: {
    async createUP() {
      let deployedContract = await this.$store.dispatch(
        'lukso/createUniversalProfile'
      );

      console.log(deployedContract);
    },
    async importUP() {
      let deployedContract = await this.$store.dispatch(
        'lukso/importUniversalProfile',
        this.UPAddressToImport
      );

      console.log(deployedContract);
    },
    async fetchProfile() {
      let fetchProfile = await this.$store.dispatch('lukso/fetchProfile');

      console.log(fetchProfile);
      this.profile = fetchProfile;
    },
    async fetchVaults() {
      let fetchVaults = await this.$store.dispatch('lukso/fetchVaults');

      console.log(fetchVaults);
      this.vaults = fetchVaults;
    },
    async transferLSP7Tokens() {
      let transferLSP7Tokens = await this.$store.dispatch(
        'lukso/transferLSP7Tokens'
      );
      console.log(transferLSP7Tokens);
      // this.profile = fetchProfile;
    },
    async createVaultOnUP() {
      let newVaultAddress = await this.$store.dispatch('lukso/createVaultOnUP');
      console.log(newVaultAddress);
      this.newVaultAddress = newVaultAddress;
    },
  },
  data() {
    return {
      profile: null,
      vaults: null,
      UPAddressToImport: null,
      newVaultAddress: null,
    };
  },
};
</script>

<style lang="scss">
#metamask-logo-details {
  max-height: 83px;
  max-width: 83px;

  border-radius: 50%;
  border: solid 2px #b8b9bb;
  margin: auto;
  margin-top: -35px;
}

.test-page {
  .darker-background.row {
    height: 400px;
    overflow: auto;
  }
}
.details-wallet {
  .darker-background.row {
    margin: 0;
    border-radius: 3px;
    background-color: var(--white);
    .wallet-state {
      background: #efefef;
    }
    .wallet-address {
      background-color: #ffffff;
      padding: 10px;
    }
  }
}
</style>
