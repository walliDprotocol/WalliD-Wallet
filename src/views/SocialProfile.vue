<template>
  <v-container class="profile-view pa-5 pr-4">
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
              <v-col cols="12" class="">
                <jazz-icon
                  :address="address"
                  :id="'proof'"
                  :size="77"
                  :margin="4"
                />
                <p class="light-grey-text text-center">
                  {{ $t('profiles.proof.address') }}
                </p>
                <div class="address-balloon">
                  <p>
                    {{ address | truncate(8, '...') }}
                  </p>
                </div>
              </v-col>
              <v-col cols="12" class="py-0 list-profiles">
                <v-container class="pa-0 wrapper">
                  <v-row>
                    <v-col cols="2" class="py-2 pl-0">
                      <StoredProfileImg
                        :size="30"
                        :name="currentProfile.socialName"
                      />
                    </v-col>
                    <v-col cols="8" class="py-2 pl-1">
                      <v-container class="pb-0">
                        <v-row>
                          <v-col cols="12" class="py-0">
                            <p
                              class="sub-title-fields sub-title-fields--bold text-left text-uppercase"
                            >
                              {{ currentProfile.socialName }}
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
                  </v-row>
                </v-container>
              </v-col>
              <v-col cols="12" class="py-0 list-profiles">
                <v-container class="pa-0 wrapper">
                  <v-row>
                    <v-expansion-panels accordion>
                      <v-expansion-panel>
                        <v-expansion-panel-header class="px-3">
                          <IconViewProof
                            width="30px"
                            height="30px"
                            class="mr-6"
                          />
                          {{
                            $t('profiles.identity.viewProof')
                          }}</v-expansion-panel-header
                        >
                        <template v-slot:actions>
                          <IconArrowDropdown />
                        </template>
                        <v-expansion-panel-content class="px-0">
                          <v-col cols="12" class=" px-2 py-2 post">
                            <div class="text-left">
                              {{ currentProfile.profileData.post }}
                            </div>
                          </v-col>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-row>
                </v-container>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-btn
      v-if="false"
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

import IconViewProof from '../images/icon-add-view-proof-pressed.vue';

import IconArrowDropdown from '../images/icon-arrow-dropdown.vue';

import StoredProfileImg from '../components/StoredProfileImg';

import { mapGetters } from 'vuex';

export default {
  components: {
    ArrowBack,
    StoredProfileImg,
    IconViewProof,
    IconArrowDropdown,
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
  height: 526px;
  max-height: 526px;
  overflow-y: auto;

  .list-profiles {
    padding-left: 34px;
    padding-right: 34px;
    .wrapper {
      border-top: solid 1px #eeeeee;
    }
  }
  div.info-profile {
    border-radius: 14px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1) !important;
    .v-expansion-panel {
      border: none;
      .v-expansion-panel-header {
        font-size: 12px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.75;
        letter-spacing: normal;
        color: #009fb1;
      }
      .v-expansion-panel-content__wrap {
        padding: 0;
      }
      .v-expansion-panel-header > :not(.v-expansion-panel-header__icon) {
        flex: 0 1 auto;
      }
      &:before {
        box-shadow: none;
      }
    }
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
