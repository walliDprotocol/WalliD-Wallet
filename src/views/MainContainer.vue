<template>
  <div>
    <MenuPlugin
      v-if="!hideAppHeader"
      :address="address"
      @close="closeDrawer"
      :showMenu="showMenu"
    />

    <v-app-bar
      @click.stop="showMenu = !showMenu && address"
      v-if="!hideAppHeader"
      height="74"
      flat
      app
      class="plugin-header"
    >
      <v-img
        height="50"
        max-width="50"
        contain
        src="../images/logo-header-wallid.png"
      />
      <v-spacer />
      <jazz-icon
        v-show="address"
        :address="address"
        :id="''"
        :size="44"
        :margin="3"
      />
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
import * as bip39 from "bip39";
import JazzIcon from "../components/jazzicon";
import MenuPlugin from "../components/MenuPlugin";
import { mapGetters } from "vuex";

export default {
  components: {
    MenuPlugin,
    JazzIcon,
  },
  props: ["hideAppHeader"],
  computed: {
    ...mapGetters(["address", "unlocked"]),
  },
  watch: {
    unlocked(value) {
      if (!value) {
        this.$router.push("/login");
      }
    },
    hideAppHeader(value) {
      this.debug("hideAppHeader", this.address);
    },
  },

  data() {
    return {
      langs: [
        { id: "pt", name: "Português" },
        { id: "en", name: "English" },
      ],
      showMenu: false,
    };
  },
  mounted() {
    this.debug("MOUNTED", this.hideAppHeader);
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
    #metamask-logo- {
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
