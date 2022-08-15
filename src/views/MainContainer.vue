<template>
  <div>
    <MenuPlugin
      v-if="!hideAppHeader"
      :address="address"
      @close="closeDrawer"
      :showMenu="showMenu"
    />

    <v-app-bar v-if="!hideAppHeader" height="74" flat app class="plugin-header">
      <v-img
        height="50"
        max-width="50"
        contain
        src="../images/logos/logo-wallid.png"
        srcset="../images/logos/logo-wallid@2x.png 2x,
             ../images/logos/logo-wallid@3x.png 3x"
      />
      <v-spacer />
      <network-dropdown v-if="walletAddress"> </network-dropdown>

      <div
        v-if="address"
        @click.stop="showMenu = !showMenu"
        style="cursor: pointer;"
      >
        <jazz-icon
          v-show="walletAddress"
          :address="walletAddress"
          :id="'bar'"
          :size="44"
          :margin="3"
        />
      </div>
      <!-- -->
    </v-app-bar>
    <!-- Sizes your content based upon application components -->
    <v-main style="padding-top:74px">
      <!-- Provides the application the proper gutter -->
      <v-container fluid class="router-views pa-0">
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import MenuPlugin from '../components/MenuPlugin';
import NetworkDropdown from '../components/NetworkDropdown';
import { mapGetters, mapState } from 'vuex';

import { UPDATE_CONNECTED } from '../store/actions';

export default {
  components: {
    MenuPlugin,
    NetworkDropdown,
  },
  props: ['hideAppHeader'],
  computed: {
    ...mapGetters(['address', 'unlocked', 'connections']),
    ...mapState({
      walletAddress: 'address',
    }),
  },
  created() {
    //TO DO: add this to Store and on refreshState
    this.debug('Connections', this.$store.getters.state.connections);
    this.$store.dispatch('UPDATE_CONNECTED');
  },
  methods: {},

  watch: {
    unlocked(value) {
      if (!value) {
        this.$router.push('/login');
      }
    },
    hideAppHeader(value) {
      this.debug('hideAppHeader', this.address);
    },
  },

  data() {
    return {
      langs: [
        { id: 'pt', name: 'Português' },
        { id: 'en', name: 'English' },
      ],
      showMenu: false,
      showDropdown: false,
    };
  },
  mounted() {
    this.debug('MOUNTED', this.hideAppHeader);
  },

  methods: {
    closeDrawer(e) {
      this.debug(e);
      if (!e) {
        this.showMenu = !this.showMenu;
      }
    },

    resetPlugin() {
      API.deleteVault(this.password).then(this.refreshState());
    },
  },
};
</script>

<style lang="scss">
#app.plugin {
  .plugin-header {
    background: #eeeeee;
    .v-toolbar__content {
      padding: 12px 20px;
    }
    #metamask-logo-bar {
      max-height: 54px;
      max-width: 54px;

      border-radius: 50%;
      border: solid 2px #b8b9bb;
    }
  }
}
.main-box {
}
</style>
