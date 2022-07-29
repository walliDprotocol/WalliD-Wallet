<template>
  <v-navigation-drawer
    :value="showNetworks"
    @input="close"
    app
    right
    temporary
    width="324"
    class="menu-plugin"
  >
    <template v-slot:prepend>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title class="T1" style="margin-bottom: 7px;">
            Networks
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-divider></v-divider>
    <v-list>
      <v-list-item
        v-for="n in network"
        :key="n.name"
        @click="goRoute(NETWORK, n)"
        class="network"
      >
        <IconNetworkSelected
          v-if="currentNetwork.name === n.name"
          class="network-selected"
        />
        <div class="network-color" :style="{ backgroundColor: n.color }"></div>
        {{ n.name }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import IconNetworkSelected from '../../images/icon-network-selected.vue'

import { LOCK_WALLET } from '../../store/actions'
import { DETAILS, NETWORK } from '../../router/routes'
import { mapState } from 'vuex'

export default {
  props: ['address', 'showNetworks'],
  components: {
    IconNetworkSelected,
  },
  computed: {
    ...mapState({
      walletAddress: 'address',
      domainENS: 'domainENS',
    }),
    ...mapState('networks', ['currentNetwork', 'network']),
  },
  created() {
    this.DETAILS = DETAILS
    this.NETWORK = NETWORK
    console.log('walletaddress', this.walletAddress)
  },
  watch: {},
  mounted() {},
  methods: {
    close(input) {
      if (!input) {
        this.$emit('close', !this.showNetworks)
      }
    },

    // se estiver ja na pagina fechar o menu
    goRoute(route, n) {
      this.$store.commit('networks/currentNetwork', n)

      this.debug('Menu Option: ', route)
      this.debug(this.$route.path)
      this.debug(this.$route?.path == route)
      this.$emit('close', !this.showNetworks)
      if (this.$route.path != route) {
        this.debug(this.showNetworks)
        this.$router.push({ name: 'Network' })
      }
    },
    details() {
      this.debug('Detail Page')
      this.$router.push('/details')
    },
    sites() {
      this.debug('sites Page')
      this.$router.push('/sites')
    },
    settings() {
      this.debug('settings Page')
      this.$router.push('/settings')
    },
    about() {
      this.debug('about Page')
      this.$router.push('/about')
    },
    lock() {
      this.debug('lock wallet')

      this.$store.dispatch(LOCK_WALLET)

      // this.$API
      //   .lockApp()
      //   .then(() => this.refreshState())
      //   .catch((e) => {
      //     console.error(e);
      //   });
    },
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss">
#metamask-logo-menu {
  max-height: 40px;
  max-width: 40px;

  border-radius: 50%;
  border: solid 2px #b8b9bb;
  margin: auto;
}

.menu-plugin {
  top: 74px !important;
  box-shadow: none !important;
  .v-navigation-drawer__prepend {
    .v-list-item {
      padding: 0 24px;
      .v-list-item__avatar {
        margin-top: 19px;
        margin-bottom: 20px;
      }
      .v-list-item__content {
        padding: 17px 0;
      }
    }
    .v-list-item__content {
      text-align: left;
      .subtitle {
        font-size: 13px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: var(--charcoal-grey);
      }
    }
  }
  .v-navigation-drawer__content {
    .v-list-item {
      padding: 0 30px;
      .v-list-item__icon {
        margin-right: 18px;
        margin-top: 14px;
        margin-bottom: 12px;
      }
      .v-list-item__title {
        text-align: left;
        font-size: 16px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: var(--charcoal-grey);
      }
      .v-ripple__container {
        color: #87c2c9;
      }
      &:hover {
        background-color: var(--pale-blue);
        .v-list-item__title {
          color: var(--teal-blue);
        }
        path {
          fill: #009fb1;
        }
      }
    }
  }
}

.network {
  font-size: 16px !important;
  font-weight: 500;
  white-space: nowrap;
  display: flex !important;
  padding-inline: 30px !important;
  position: relative;
}

.network-color {
  width: 8px;
  max-width: 8px;
  aspect-ratio: 1;
  border-radius: 100%;
  margin-inline: 8px !important;
}

.network-selected {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translate(0, -50%);
}
</style>
