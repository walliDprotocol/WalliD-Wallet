<template>
  <v-container class="connected-sites">
    <v-row v-if="!confirmDisconnect">
      <v-col cols="12" class="pt-1">
        <div class="back-arrow mb-3">
          <v-btn text @click="$router.push('/home')" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1">
            {{ $t("sites.title") }}
          </h2>
        </div>
      </v-col>
      <v-col cols="12" class="pt-0">
        <h3 class="sub-title-fields mb-7 text-left">
          {{ $t("sites.subtitle") }}
        </h3>
      </v-col>
      <v-col cols="12" class="pt-2 pb-1">
        <v-list class="sites-list">
          <v-list-item v-for="site in connections" :key="site.url">
            <v-list-item-avatar>
              <v-img :src="site.icon" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="site.url"></v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn @click="disconnect(site)" icon>
                <icon-trash />
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <div class="back-arrow mb-6">
          <v-btn text @click="cancel" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1 text-left">
            {{ $t("sites.disconnect[0]") }}
            {{ site.name }}
            {{ $t("sites.disconnect[1]") }}
          </h2>
        </div>
      </v-col>
      <v-col cols="12" class="pt-0 pr-4">
        <h3 class="sub-title-fields mb-2 text-left">
          {{ $t("sites.confirm") }}
        </h3>
      </v-col>
      <v-col cols="6" class="pr-2">
        <v-btn text class="cancel-btn" @click="cancel">
          {{ $t("sites.button[0]") }}
        </v-btn>
      </v-col>
      <v-col cols="6" class="pl-2">
        <v-btn text class="advance-btn" @click="setPendingDisconnect">
          {{ $t("sites.button[1]") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import ArrowBack from "../images/icon-arrow-back.vue";
import IconTrash from "../images/icon-trash-unselected.vue";
import { DISCONNECT } from "../store/actions";

export default {
  components: {
    ArrowBack,
    IconTrash,
  },
  mounted() {},
  computed: {
    ...mapGetters(["connections"]),
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
      connected: false,
      site: "",
    };
  },
};
</script>

<style lang="scss">
.connected-sites {
  .sites-list {
    border-top: solid 1px #eeeeee;
    .v-list-item {
      border-bottom: solid 1px #eeeeee;

      .v-list-item__action {
        &:hover path {
          fill: #009fb1;
        }
      }
    }
  }
}
</style>
