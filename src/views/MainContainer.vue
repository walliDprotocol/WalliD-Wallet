<template>
  <div>
    <MenuPlugin
      v-if="!hideAppHeader"
      :address="address"
      @close="closeDrawer"
      :showMenu="showMenu"
    />

    <MenuNetworks
      v-if="!hideAppHeader"
      :address="address"
      @close="closeNetworksDrawer"
      :showNetworks="showNetworks"
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
      <!-- Networks -->
      <div
        v-if="address"
        @click.stop="showNetworks = !showNetworks"
        class="current-network"
      >
        <div
          class="network-color"
          :style="{ backgroundColor: currentNetwork.color }"
        ></div>
        {{ currentNetwork.name }}
        <IconArrowDropdown
          :style="{
            transform: 'rotate(' + (showNetworks ? '180deg' : '0deg') + ')',
            animation: 'transform 1s infinite linear',
            width: '8px',
            marginLeft: '6px',
            animation: 'transform 1s linear',
          }"
        />
      </div>
      <v-spacer />
      <!-- End of Networks -->
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
    <v-main style="padding-top: 74px;">
      <!-- Provides the application the proper gutter -->
      <v-container fluid class="router-views pa-0">
        <!-- If using vue-router -->
        <router-view></router-view>
        <DeleteAssetModal v-if="showDeleteConfirmation" />
        <ViewActivityModal v-if="showViewActivityModal" />
        <ImportAssetModal v-if="showImportAssetModal" />
        <SendAssetModal v-if="showSendAssetModal" />
      </v-container>
    </v-main>
  </div>
</template>

<script>
import MenuPlugin from '../components/MenuPlugin'
import MenuNetworks from '../components/MenuNetworks'
import { mapGetters, mapState } from 'vuex'

import { UPDATE_CONNECTED } from '../store/actions'
import IconArrowDropdown from '../images/icon-arrow-dropdown.vue'

import DeleteAssetModal from '../modals/DeleteAssetModal'
import ViewActivityModal from '../modals/ViewActivityModal'
import ImportAssetModal from '../modals/ImportAssetModal'
import SendAssetModal from '../modals/SendAssetModal'

export default {
  components: {
    MenuPlugin,
    IconArrowDropdown,
    MenuNetworks,
    DeleteAssetModal,
    ViewActivityModal,
    ImportAssetModal,
    SendAssetModal,
  },
  props: ['hideAppHeader'],
  computed: {
    ...mapGetters([
      'address',
      'unlocked',
      'connections',
      'showDeleteConfirmation',
      'showViewActivityModal',
      'showImportAssetModal',
      'showSendAssetModal',
    ]),
    ...mapState({
      walletAddress: 'address',
    }),
    ...mapState('networks', ['currentNetwork']),
  },
  created() {
    //TO DO: add this to Store and on refreshState
    this.debug('Connections', this.$store.getters.state.connections)
    this.$store.dispatch('UPDATE_CONNECTED')
  },
  watch: {
    unlocked(value) {
      if (!value) {
        this.$router.push('/login')
      }
    },
    hideAppHeader(value) {
      this.debug('hideAppHeader', this.address)
    },
  },

  data() {
    return {
      langs: [
        { id: 'pt', name: 'Português' },
        { id: 'en', name: 'English' },
      ],
      showMenu: false,
      showNetworks: false,
    }
  },
  mounted() {
    this.debug('MOUNTED', this.hideAppHeader)
  },

  methods: {
    closeDrawer(e) {
      this.debug(e)
      if (!e) {
        this.showMenu = !this.showMenu
      }
    },
    closeNetworksDrawer(e) {
      this.debug(e)
      if (!e) {
        this.showNetworks = !this.showNetworks
      }
    },

    resetPlugin() {
      API.deleteVault(this.password).then(this.refreshState())
    },
  },
}
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

.current-network {
  cursor: pointer;
  border-radius: 15px;
  border: 1px solid #b8b9bb;
  max-height: 28px;
  font-size: 12px !important;
  font-weight: 500;
  padding: 7px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.network-color {
  width: 8px;
  aspect-ratio: 1;
  border-radius: 100%;
  margin-right: 6px;
  margin-left: 0;
}
</style>
