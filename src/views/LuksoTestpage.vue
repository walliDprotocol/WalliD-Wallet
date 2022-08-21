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
        <h6>New vault address</h6>
        {{ newVaultAddress }}
        <v-text-field
          v-model="accountAddress"
          solo
          flat
          class="password-input seed-phrase mt-1"
          name="input-password-login"
          hide-details
        >
        </v-text-field>
        {{ balanceOfResult }}
        <v-btn text class="advance-btn" @click="balanceOf()">
          {{ 'get balanceOf' }}
        </v-btn>
        <v-btn text class="advance-btn" @click="transferLSP7Token()">
          {{ 'transferLSP7Token' }}
        </v-btn>
        <v-btn text class="advance-btn" @click="transferLSP8Token()">
          {{ 'transferLSP8Token' }}
        </v-btn>
        <v-btn text class="advance-btn" @click="getMetadata()">
          {{ 'getMetadata' }}
        </v-btn>
      </v-col>
      <v-col cols="12" class="pb-1 pt-2">
        UPAddress
        <WalletAddress class="" :walletAddress="UPAddress" />
        KMAddress
        <WalletAddress class="" :walletAddress="KMAddress" />
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
        'lukso/createUniversalProfile',
        { username: 'Nuno' }
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
      this.profile = [fetchVaults];
    },
    async createVaultOnUP() {
      let newVaultAddress = await this.$store.dispatch('lukso/createVaultOnUP');
      console.log(newVaultAddress);
      this.newVaultAddress = newVaultAddress;
    },

    async balanceOf() {
      let balanceOf = await this.$store.dispatch('lukso/balanceOf', {
        accountAddress: this.accountAddress,
        tokenAddress: '0xDb08A40A6Df54035984c50cC7F17ea8C03865c08',
      });
      console.log('balanceOf', balanceOf);
      this.balanceOfResult = balanceOf;
    },

    async transferLSP7Token() {
      let transferLSP7Token = await this.$store.dispatch(
        'lukso/transferLSP7Token',
        {
          fromAccountAddress: '0x77fBE8872E7566555f6346ae467c937ecB89888e', //this.fromAccountAddress,
          toAccountAddress: '0x56292D173a5E31E3DCa0387c96Af4531ceC3E6cA', // this.toAccountAddress,
          tokenAddress: '0xEc1291846BdccB9cc2bD6b3c6bD82C924426457f',
          amount: '0.1',
          isFromVault: true,
        }
      );
      console.log('transferLSP7Token', transferLSP7Token);
      // this.balanceOfResult = balanceOf;
    },

    async transferLSP8Token() {
      let transferLSP8Token = await this.$store.dispatch(
        'lukso/transferLSP8Token',
        {
          fromAccountAddress: '0xb2d3fa293b1E652D00338d1518DDe5bA3c868d47', //this.fromAccountAddress,
          toAccountAddress: '0x7b0e9c6e1873402797eE693e9F810143cc956F8E', // this.toAccountAddress,
          tokenAddress: '0xF8085ec8633BBF60F54557e2D336a0c53089F59C',
          tokenId: '1',
        }
      );
      console.log('transferLSP8Token', transferLSP8Token);
      // this.balanceOfResult = balanceOf;
    },
    async getMetadata() {
      let getMetadata = await this.$store.dispatch('lukso/getMetadata', {
        assetAddress: '0xF8085ec8633BBF60F54557e2D336a0c53089F59C',
      });
      console.log('getMetadata', getMetadata);
      // this.balanceOfResult = balanceOf;
    },
  },
  data() {
    return {
      profile: null,
      vaults: null,
      UPAddressToImport: null,
      newVaultAddress: null,
      balanceOfResult: null,
      accountAddress: null,
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
