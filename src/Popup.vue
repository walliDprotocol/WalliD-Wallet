<template>
  <v-app class="plugin">
    <v-navigation-drawer app class="plugin-menu">
      <!-- -->
    </v-navigation-drawer>

    <v-app-bar height="74" flat app class="plugin-header">
      <v-img
        height="50"
        max-width="50"
        contain
        src="../images/logo-header-wallid.png"
      />
      <v-spacer />

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
  </v-app>
</template>

<script>
import * as bip39 from "bip39";

export default {
  computed: {
    initialized: {
      get() {
        return this.$API.getState().initialized;
      },
    },
    unlocked: {
      get() {
        return this.$API.getState().unlocked;
      },
    },
    address: {
      get() {
        return this.$API.getState().address;
      },
    },
  },

  data() {
    return {};
  },
  mounted() {
    console.log("MOUNTED", this.initialized);
    // this.$API.createNewVault(bip39.generateMnemonic(), "jamado");
    if (this.unlocked) {
      this.$router.push("/restore");
    } else {
      this.$router.push("/restore");
    }
  },

  methods: {
    unlockPlugin() {
      API.verifyPassword(this.password)
        .then((r) => console.log("RES", r))
        .catch((e) => console.log("POPUP VERIFY PASSWORD ERROR", e));

      API.unlockApp(this.password).then(() => this.refreshState());
    },

    lockPlugin() {
      API.lockApp().then(this.refreshState());
    },

    resetPlugin() {
      API.deleteVault(this.password).then(this.refreshState());
    },

    refreshState() {
      const appState = API.getState();

      this.initialized = appState.initialized;
      this.unlocked = appState.unlocked;
      this.address = appState.address;
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
  }
}
.main-box {
}
</style>
