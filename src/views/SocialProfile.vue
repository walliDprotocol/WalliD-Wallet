<template>
  <v-container class="profile-view pa-5">
    <v-row>
      <v-col cols="12" class="pt-1">
        <div class="back-arrow mb-4">
          <v-btn text @click="$router.go('-1')" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1 text-left">
            {{ $t('profiles.menu[0]') }}
          </h2>
        </div>
      </v-col>
    </v-row>
    <v-row class="">
      <v-col cols="12" class="pt-1">
        <v-card class="info-profile pa-3">
          <v-container class="pa-0 ">
            <v-row>
              <v-col cols="2" class="py-2">
                <StoredProfileImg :size="30" :name="currentProfile.name" />
              </v-col>
              <v-col cols="8" class="py-2 pl-1">
                <v-container class="">
                  <v-row>
                    <v-col cols="12" class="py-0">
                      <p
                        class="sub-title-fields sub-title-fields--bold text-left text-uppercase"
                      >
                        {{ currentProfile.name }}
                      </p>
                    </v-col>
                    <v-col cols="12" class="py-0">
                      <p class="sub-title-fields text-left">
                        {{ currentProfile.username }}
                      </p>
                    </v-col>
                  </v-row>
                </v-container>
              </v-col>
              <v-col cols="12" class=" px-6 py-2 post">
                <div class="text-left">{{ currentProfile.post }}</div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-btn
      text
      @click="goToSharePage"
      class="advance-btn inverted-colors float"
    >
      {{ $t('profiles.menu[1]') }}
    </v-btn>
  </v-container>
</template>

<script>
import ArrowBack from '../images/icon-arrow-back.vue';

import StoredProfileImg from '../components/StoredProfileImg';

import { mapGetters } from 'vuex';

export default {
  components: {
    ArrowBack,
    StoredProfileImg,
  },
  created() {
    console.log('card', this.currentProfile);
  },
  mounted() {},
  computed: {
    ...mapGetters(['address', 'currentProfile']),
  },
  methods: {
    goToSharePage() {
      this.$store.commit('currentProfile', this.currentProfile);

      this.$router.push({
        name: 'SHARE_PROFILE_VIEW',
        params: { profile: this.currentProfile },
      });
    },
  },
  data() {
    return {
      isLoading: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.profile-view {
  height: 100%;
  div.info-profile {
    border-radius: 14px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1) !important;
  }
  .sub-title-fields {
    font-size: 12px !important;
    font-weight: 600 !important;
  }
  .sub-title-fields--bold {
    font-size: 11px !important;
    font-weight: normal !important;
  }
  .post {
    div {
      border-radius: 4px;
      background-color: #f8f8f8;
      padding: 10px;
      font-size: 12px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 2;
      letter-spacing: normal;
      color: #3c4148;
    }
  }
  .advance-btn.float {
    position: fixed !important;
    left: 20px !important;
  }
}
</style>
