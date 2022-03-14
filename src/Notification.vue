<template>
  <v-app class="plugin notification">
    <v-container fluid class="router-views pa-0">
      <router-view :hideAppHeader="hideAppHeader"></router-view>
    </v-container>
  </v-app>
</template>

<script>
import MainContainer from './views/MainContainer';
import { mapGetters } from 'vuex';
export default {
  components: {
    MainContainer,
  },
  props: ['hideAppHeader'],
  computed: {
    ...mapGetters(['address', 'unlocked']),
  },
  watch: {},

  data() {
    return {
      langs: [
        { id: 'pt', name: 'Português' },
        { id: 'en', name: 'English' },
        { id: 'es', name: 'Español' },
      ],
    };
  },
  created() {
    //Add logger to store
    this.$store.commit('appendLogger', this.debug);
  },
  mounted() {
    this.debug('MOUNTED Notification', this.unlocked);
    this.$store.commit('appendgetDomain', this.getDomain);

    let browserLang = navigator.language.substring(0, 2);
    var check = this.langs.filter(function(elm) {
      if (elm.id == browserLang) {
        return elm.id; // returns length = 1 (object exists in array)
      }
      // return self.$i18n.locale;
    });

    this.$i18n.locale = 'en'; // check.length > 0 ? check[0].id : 'en';
  },

  methods: {},
};
</script>

<style lang="scss">
body {
  overflow: hidden;
  width: 400px;
  height: 600px;
}

#app.plugin {
  &.notification {
    max-width: 400px;
    max-height: 600px;
    margin: auto;
  }
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
