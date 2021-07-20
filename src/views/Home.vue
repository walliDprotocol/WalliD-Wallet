<template>
  <v-container class="home">
    <v-row class="pt-0">
      <v-col cols="12" class="pt-0 pb-0">
        <jazz-icon :address="address" :id="'home'" :size="58" :margin="4" />
      </v-col>
      <v-col cols="12" class="pt-4 pb-2 px-14">
        <h2 class="T1 mb-2 text-center">
          {{ $t('home.title') }}
        </h2>
        <WalletState :website="connected.url"> </WalletState>
      </v-col>
      <v-col cols="12" class="px-14">
        <p class="normal-text mb-3 text-center">
          {{ $t('home.address') }}
        </p>

        <WalletAddress :address="address" />
      </v-col>
      <v-col class="tabs pa-0 pt-1" cols="12">
        <v-tabs :show-arrows="false" fixed-tabs v-model="tab">
          <v-tab href="#tab-2" class="MENU-SELECTED">{{
            $t('home.tabs[1]')
          }}</v-tab>
          <v-tab href="#tab-1" class="MENU-SELECTED">{{
            $t('home.tabs[0]')
          }}</v-tab>
          <v-tab href="#tab-3" class="MENU-SELECTED">{{
            $t('home.tabs[2]')
          }}</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item value="tab-2">
            <ListOnlineIDs />
          </v-tab-item>
          <v-tab-item value="tab-1">
            <ListIDs />
          </v-tab-item>
          <v-tab-item value="tab-3">
            <ListCrendentials />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import WalletState from '../components/WalletState';
import WalletAddress from '../components/WalletAddress';
import ListIDs from '../components/ListIDs';
import ListCrendentials from '../components/ListCrendentials';
import ListOnlineIDs from '../components/ListOnlineIDs';

import { mapGetters } from 'vuex';

export default {
  components: {
    WalletState,
    WalletAddress,
    ListIDs,
    ListCrendentials,
    ListOnlineIDs,
  },
  computed: {
    ...mapGetters(['address', 'identities', 'credentials']),
  },
  mounted() {},
  methods: {},
  data() {
    return {
      iconSet: false,
      tab: 0,
    };
  },
};
</script>

<style lang="scss">
#metamask-logo-home {
  max-height: 70px;
  max-width: 70px;

  border-radius: 50%;
  border: solid 2px #b8b9bb;
  margin: auto;
}

.home {
  .tabs {
    min-width: 400px;
    .v-slide-group__prev,
    .v-slide-group__next {
      display: none !important;
    }
    .v-tabs-slider {
      background-color: var(--teal-blue);
    }
    .v-tab {
      border-bottom: solid 2px var(--very-light-grey);
    }
  }
}
</style>
