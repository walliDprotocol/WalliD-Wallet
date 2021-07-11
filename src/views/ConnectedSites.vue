<template>
  <v-container class="connected-sites">
    <v-row v-if="!confirmDisconnect">
      <v-col cols="12" class="pt-1">
        <div class="back-arrow mb-3">
          <v-btn text @click="$router.push('/home')" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1">
            {{ $t('sites.title') }}
          </h2>
        </div>
      </v-col>
      <v-col v-show="connections.length != 0" cols="12" class="pt-0">
        <h3 class="sub-title-fields mb-7 text-left">
          {{ $t('sites.subtitle') }}
        </h3>
      </v-col>
      <v-col v-show="connections.length != 0" cols="12" class="pt-2 pb-1">
        <v-list class="sites-list">
          <v-list-item class="pl-0" v-for="site in connections" :key="site.url">
            <v-list-item-avatar>
              <v-img
                contain
                class="site-logo"
                width="40"
                height="40"
                :src="site.icon"
              />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title
                class="text-left"
                v-text="site.url"
              ></v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-tooltip content-class="sites-tooltip" bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" @click="disconnect(site)" icon>
                    <icon-trash />
                  </v-btn>
                </template>
                <div class="arrow-seed-tooltip"></div>
                <div class="metamask-login">
                  <p>{{ $t('sites.tooltip') }}</p>
                </div>
              </v-tooltip>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col v-show="connections.length == 0" cols="12" class="pt-2 pb-1 px-10">
        <p class="sub-title-fields text-center mt-12 ">
          {{ $t('sites.noSites') }}
        </p>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <div class="back-arrow mb-6">
          <v-btn text @click="cancel" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1 text-left">
            {{ $t('sites.disconnect[0]') }}
            {{ site.url }}
            {{ $t('sites.disconnect[1]') }}
          </h2>
        </div>
      </v-col>
      <v-col cols="12" class="pt-0 pr-4">
        <h3
          class="sub-title-fields mb-2 text-left"
          v-html="$t('sites.confirm')"
        ></h3>
      </v-col>
      <v-col cols="6" class="pr-2">
        <v-btn text class="cancel-btn" @click="cancel">
          {{ $t('sites.button[0]') }}
        </v-btn>
      </v-col>
      <v-col cols="6" class="pl-2">
        <v-btn text class="advance-btn" @click="setPendingDisconnect">
          {{ $t('sites.button[1]') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import ArrowBack from '../images/icon-arrow-back.vue';
import IconTrash from '../images/icon-trash-unselected.vue';
import { DISCONNECT } from '../store/actions';

export default {
  components: {
    ArrowBack,
    IconTrash,
  },
  computed: {
    ...mapGetters(['connections']),
  },
  methods: {
    cancel() {
      this.site = {};
      this.confirmDisconnect = false;
    },
    disconnect(site) {
      this.site = site;
      this.debug(site);
      this.confirmDisconnect = true;
    },
    setPendingDisconnect() {
      this.$store.dispatch(DISCONNECT, this.site.url).then(() => {
        this.cancel();
      });
    },
  },
  data() {
    return {
      confirmDisconnect: false,
      site: '',
    };
  },
};
</script>

<style lang="scss">
.sites-tooltip {
  &.v-tooltip__content {
    width: 170px;
    height: 43px;
    background-color: transparent;
    opacity: 1 !important;
    left: 262px !important;
  }
  &.v-tooltip__content .metamask-login {
    border-radius: 3px;
    background-color: #eeeeee;
    padding: 10px 15px;
    margin: auto;
    width: fit-content;
  }
  p {
    margin: 0;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: center;
    color: var(--charcoal-grey);
  }
  .arrow-seed-tooltip {
    background-color: #eeeeee;
    transform: rotate(45deg);
    width: 15px;
    height: 15px;
    position: absolute;
    top: -3px;
    left: 50%;
    margin-left: -7px;
    z-index: -1;
  }
}
.connected-sites {
  .sites-list {
    border-top: solid 1px #eeeeee;
    .v-list-item {
      border-bottom: solid 1px #eeeeee;
      .site-logo {
        max-width: 40px;
        max-height: 40px;
        border: solid 1px #b8b9bb;
        .v-image__image {
          width: 30px;
          height: 30px;
          right: 0;
          margin: 4px 0 0 4px;
        }
      }
      .v-list-item__action {
        &:hover path {
          fill: #009fb1;
        }
      }
    }
  }
}
</style>
