<template>
  <v-container
    class="social-profiles-list list-storage"
    style="overflow-y: auto; height: 203px"
  >
    <v-row v-if="profiles.length > 0">
      <v-col
        v-for="profile in profiles"
        :key="profile.id"
        cols="12"
        class="py-0 px-1 mt-1 mb-2 card"
      >
        <v-container class="px-3 pt-4">
          <v-row>
            <v-col cols="2" class="">
              <StoredProfileImg :size="38" :name="getSocialName(profile)" />
            </v-col>
            <v-col cols="8" class="pl-6 pr-0 pb-1">
              <v-container class="py-0">
                <v-row>
                  <v-col cols="12" class="py-0">
                    <p class="sub-title-fields sub-title-fields--bold">
                      {{ getSocialName(profile) }}
                    </p>
                  </v-col>
                  <v-col cols="12" class="py-0">
                    <p class="sub-title-fields">
                      {{ getUsername(profile) | truncate(30, '...') }}
                    </p>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
            <v-col cols="2" class="pl-0 pr-0">
              <v-menu bottom left class="dot-menu" content-class="dot-menu">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    :ripple="false"
                    width="36"
                    class="dot-menu-button"
                    icon
                    v-bind="attrs"
                    v-on="on"
                  >
                    <IconDotMenu class="" />
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item v-if="false">
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
                  <v-list-item>
                    <v-list-item-title
                      class="SECUNDARY-LINKS text-left"
                      @click="deleteProfile(profile)"
                      >{{ $t('profiles.menu[2]') }}</v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="12" class="py-0 px-1 mt-1 mb-2 card">
        <v-container class="px-3 pt-4">
          <v-row>
            <v-col cols="2" class="">
              <StoredProfileImg :size="38" :name="'AddProfile'" />
            </v-col>
            <v-col cols="8" class="pl-6 pr-0">
              <v-container class="py-0">
                <v-row>
                  <v-col cols="12" class="py-0 pr-0">
                    <a
                      class="MAIN-LINKS"
                      href="https://www.wallid.io/Setup/ChooseIdentity?online=true"
                      target="_blank"
                    >
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
    <v-row v-else style="background: white; height: 196px; overflow-y: hidden">
      <v-col cols="12" class="px-15 py-9">
        <p class="SECUNDARY-LINKS mb-5">{{ $t('profiles.noids') }}</p>
        <a
          class="links"
          target="_blank"
          color="#01a3b0"
          href="https://www.wallid.io/Setup/ChooseIdentity?online=true"
          @click.stop
        >
          {{ $t('profiles.store') }}
        </a>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import IconDotMenu from '../../images/icon-dot-menu.vue';

import IconAlert from '../../images/icon-warning-red.vue';
import idcardImg from '../../images/icon-id-document.vue';

import StoredProfileImg from '../../components/StoredProfileImg';

import { mapGetters } from 'vuex';

export default {
  components: {
    IconDotMenu,
    IconAlert,
    idcardImg,
    StoredProfileImg,
  },
  computed: {
    ...mapGetters(['profiles']),
  },

  methods: {
    deleteProfile(profile) {
      this.$store.commit('showDeleteConfirmation', true);

      this.$store.commit('currentProfile', profile);
    },
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

<style lang="scss">
.social-profiles-list {
  .dot-menu-button {
    padding: 1px;
    &:hover .v-btn__content {
      svg > g {
        fill: #009fb1 !important;
      }
    }
    &::before {
      content: none;
    }
  }
}
</style>
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
    .dot-menu-button {
      padding: 1px;
      &:hover .v-btn__content {
        svg > g {
          fill: #009fb1 !important;
        }
      }
      &::before {
        content: none;
      }
    }
  }
}
</style>
