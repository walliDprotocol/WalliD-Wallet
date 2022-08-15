<template>
  <v-sheet class="networks-dropdown-sheet overflow-hidden">
    <v-container class="py-0">
      <v-row align="center" justify="center">
        <v-btn class="network-dropdown-btn" @click.stop="drawer = !drawer">
          {{ currentNetwork.nickname }}

          {{ balance }}
        </v-btn>
      </v-row>
    </v-container>
    <v-navigation-drawer
      v-model="drawer"
      app
      right
      temporary
      width="324"
      class="networks-dropdown"
    >
      <v-divider></v-divider>
      <v-list>
        <v-list-item
          v-for="(network, i) in networkList"
          :key="i"
          @click="changeRpcTarget(network)"
        >
          <v-list-item-title>{{ network.nickname }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-sheet>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    return {
      drawer: null,
    };
  },
  mounted() {
    console.log(this.networkList);
  },
  computed: {
    ...mapState('networks', {
      currentNetwork: 'currentNetwork',
      balance: 'balance',
    }),
    ...mapGetters({
      networkList: 'networks/networkList',
    }),
  },
  methods: {
    async changeRpcTarget({ rpcTarget, chainId, ticker, nickname }) {
      this.debug(
        `changeRpcTarget: ${rpcTarget} ${chainId} ${ticker} ${nickname}`
      );

      try {
        let result = await this.$store.dispatch('networks/changeRpcTarget', {
          rpcTarget,
          chainId,
          ticker,
          nickname,
        });
        console.log(result);
      } catch (error) {
        this.debug('Had a problem changing networks!', error);
      }
    },
  },
};
</script>

<style lang="scss">
.networks-dropdown-sheet {
  box-shadow: none !important;
  background: none;
  background-color: transparent !important;

  .network-dropdown-btn {
    border-radius: 15px;
    border: solid 1px #b8b9bb;
    background-color: transparent !important;
    box-shadow: none;
  }
  .networks-dropdown {
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
}
</style>
