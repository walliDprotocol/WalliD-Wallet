<template>
  <v-container class="social-profiles-list list-storage pt-1">
    <v-row>
      <v-col
        v-for="profile in profiles"
        :key="profile.id"
        cols="12"
        class="py-0 px-2 mt-1 mb-2 card"
      >
        <v-container class="py-0">
          <v-row>
            <v-col cols="2" class="">
              <SocialProfileImg :size="38" :name="profile.name" />
            </v-col>
            <v-col cols="8" class="pl-6 pr-0 pb-1">
              <v-container class="py-0">
                <v-row>
                  <v-col cols="12" class="py-0">
                    <p class="sub-title-fields sub-title-fields--bold">
                      {{ profile.name }}
                    </p>
                  </v-col>
                  <v-col cols="12" class="py-0">
                    <p class="sub-title-fields">
                      {{ profile.username }}
                    </p>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
            <v-col cols="2" class="pl-0 pr-1">
              <v-menu bottom left class="dot-menu" content-class="dot-menu">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    :ripple="false"
                    width="36"
                    class="dot-menu-button mt-3"
                    icon
                    v-bind="attrs"
                    v-on="on"
                  >
                    <IconDotMenu class="" />
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item>
                    <v-list-item-title
                      class="SECUNDARY-LINKS text-left"
                      @click="viewProfileInfo(profile)"
                      >{{ $t('profiles.menu[0]') }}</v-list-item-title
                    >
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-title
                      class="SECUNDARY-LINKS text-left"
                      @click="shareProfile(profile)"
                      >{{ $t('profiles.menu[1]') }}</v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="12" class="py-0 px-2 mt-1 mb-2 card">
        <v-container class="py-0">
          <v-row>
            <v-col cols="2" class="">
              <SocialProfileImg :size="38" :name="'AddProfile'" />
            </v-col>
            <v-col cols="8" class="pl-6 pr-0">
              <v-container class="py-0">
                <v-row>
                  <v-col cols="12" class="py-0">
                    <a class="MAIN-LINKS">
                      {{ $t('profiles.addNew') }}
                    </a>
                  </v-col>
                  <v-col cols="12" class="py-0">
                    <p class="sub-title-fields"></p>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import IconDotMenu from '../../images/icon-dot-menu.vue';

import IconAlert from '../../images/icon-warning-red.vue';
import idcardImg from '../../images/icon-id-document.vue';

import SocialProfileImg from '../../components/SocialProfileImg';

import { mapGetters } from 'vuex';

export default {
  components: {
    IconDotMenu,
    IconAlert,
    idcardImg,
    SocialProfileImg,
  },
  computed: {
    ...mapGetters(['profiles']),
  },

  methods: {
    viewProfileInfo(profile) {
      console.log('viewProfileInfo', profile);

      this.$store.commit('currentProfile', profile);

      this.$router.push({ name: 'SOCIAL_PROFILE_VIEW', params: { profile } });
    },
    shareProfile(profile) {
      console.log('shareProfile', profile);

      this.$store.commit('currentProfile', profile);

      this.$router.push({ name: 'SHARE_PROFILE_VIEW', params: { profile } });
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.social-profiles-list {
  overflow-y: auto;
  overflow-x: hidden;

  height: 200px;
  background-color: var(--white);

  .card {
    // height: 82px;
    background-color: white;

    .sub-title-fields {
      font-size: 14px !important;
      text-align: left;
    }
    .col-8 {
      align-items: center;
      display: flex;
    }
    .FIELD-TEXT {
      text-align: left;
    }
    .back-btn {
      padding: 0 !important;
      min-width: 36px !important;
      border-radius: 50%;
    }
    .validity {
      border-radius: 11px;
      background-color: #d8d8d8;
      width: fit-content;
      padding: 1px;
      padding-right: 8px;
      display: flex;
      svg {
        margin: 6px;
      }
    }
  }
}
</style>
