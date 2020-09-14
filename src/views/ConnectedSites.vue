<template>
  <v-container class="connected-sites">
    <v-row v-if="!confirmDisconnect">
      <v-col cols="12">
        <div class="back-arrow mb-6">
          <v-btn text @click="$router.go(-1)" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1">
            {{ $t("sites.title") }}
          </h2>
        </div>
      </v-col>
      <v-col cols="12" class="pt-0">
        <h3 class="sub-title-fields mb-2 text-left">
          {{ $t("sites.subtitle") }}
        </h3>
      </v-col>
      <v-col cols="12" class="pt-2 pb-1">
        <v-list class="sites-list">
          <v-list-item v-for="site in sites" :key="site.url">
            <v-list-item-avatar>
              <v-img :src="site.img" />
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
          <h2 class="T1">
            {{ $t("sites.disconnect[0]") }}
            {{ site.url }}
            {{ $t("sites.disconnect[1]") }}
          </h2>
        </div>
      </v-col>
      <v-col cols="12" class="pt-0">
        <h3 class="sub-title-fields mb-2 text-left">
          {{ $t("sites.confirm") }}
        </h3>
      </v-col>
      <v-col cols="6">
        <v-btn text class="cancel-btn" @click="cancel">
          {{ $t("sites.button[0]") }}
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn text class="advance-btn" @click="setPendingDisconnect">
          {{ $t("sites.button[1]") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ArrowBack from "../images/icon-arrow-back.vue";
import IconTrash from "../images/icon-trash-unselected.vue";

export default {
  components: {
    ArrowBack,
    IconTrash,
  },
  mounted() {},
  computed: {},
  methods: {
    cancel() {
      this.site = {};
      this.confirmDisconnect = false;
    },
    disconnect(site) {
      this.site = site;
      console.log(site);
      this.confirmDisconnect = true;
    },
    setPendingDisconnect() {
      //set pending disconnec
      //   this.setState({
      //     sitePendingDisconnect: {
      //       domainKey,
      //     },
      //   });
    },
  },
  data() {
    return {
      confirmDisconnect: false,
      sites: [{ url: "wallid.io", name: "wallid" }],
      site: {},
      connected: false,
      address: this.$API.getState().address,
      unlocked: this.$API.getState().unlocked,
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
