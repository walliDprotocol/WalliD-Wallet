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
      <div v-show="address" id="metamask-logo"></div>
      <!-- -->
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main style="padding-top:74px">
      <!-- Provides the application the proper gutter -->
      <v-container fluid class="router-views">
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import * as bip39 from "bip39";
import jazzicon from "jazzicon";
import MenuPlugin from "../components/MenuPlugin";
import { mapGetters } from "vuex";

export default {
  components: {
    MenuPlugin,
  },
  props: ["hideAppHeader"],
  computed: {
    ...mapGetters(["address", "unlocked"]),
  },
  watch: {
    address(value) {
      if (value) {
        this.setIcon();
      }
    },
    unlocked(value) {
      if (!value) {
        this.$router.push("/login");
      }
    },
    hideAppHeader(value) {
      this.debug("hideAppHeader", this.address);
      if (!value) {
        this.$nextTick(() => this.setIcon());
      }
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
    let browserLang = navigator.language.substring(0, 2);
    var check = this.langs.filter(function(elm) {
      if (elm.id == browserLang) {
        return elm.id; // returns length = 1 (object exists in array)
      }
      // return self.$i18n.locale;
    });

    this.$i18n.locale = check.length > 0 ? check[0].id : "en";
    this.$nextTick(() => this.setIcon());
  },

  methods: {
    closeDrawer(e) {
      this.debug(e);
      if (!e) {
        this.showMenu = !this.showMenu;
      }
    },
    setIcon() {
      if (this.address) {
        let body = document.getElementById("metamask-logo");
        let icon = document.getElementById("metamask-logo-icon");
        this.debug("metamask-logo", body);
        if (body && !icon) {
          var el = jazzicon(44, this.address);
          var styles = el.getAttribute("style");
          styles = styles.concat(" margin: 3px;");

          el.setAttribute("style", styles);
          el.id = "metamask-logo-icon";
          body.insertBefore(el, body.firstChild);
        }
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
    #metamask-logo {
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
