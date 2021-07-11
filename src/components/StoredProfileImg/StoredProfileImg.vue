<template>
  <v-container class="social-img pa-0 pl-3 pt-2">
    <component
      v-if="!src"
      class=""
      v-bind:is="currentSocialImg"
      :style="{ width: size + 'px', height: size + 'px' }"
    ></component>
    <div
      v-if="src"
      class="img-wrapper"
      :style="{ width: size + 'px', height: size + 'px' }"
    >
      <v-img :src="src" contain :width="size" :height="size" />
    </div>
  </v-container>
</template>

<script>
import IconTwitter from '../../images/SocialNetworks/icon-twitter';
import IconLinkedIn from '../../images/SocialNetworks/icon-linkedin';
import IconReddit from '../../images/SocialNetworks/icon-reddit';
import IconGitHub from '../../images/SocialNetworks/icon-github';
import IconDiscord from '../../images/SocialNetworks/icon-discord';

import IconAddProfile from '../../images/SocialNetworks/icon-add-profile';

import IconCC_PT from '../../images/CitizenIDs/icon-cc-pt';
import IconSHUFTI_CC_PT from '../../images/CitizenIDs/icon-cc-pt';

export default {
  name: 'StoredProfileImg',
  props: {
    size: {
      default: 24,
      type: Number,
    },
    name: {
      type: String,
    },
    src: {
      type: String,
    },
  },
  components: {
    IconTwitter,
    IconLinkedIn,
    IconReddit,
    IconGitHub,
    IconDiscord,
    IconAddProfile,
    IconCC_PT,
    IconSHUFTI_CC_PT,
  },
  computed: {
    currentSocialImg() {
      return 'Icon' + this.name;
    },
  },
  methods: {},
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.social-img {
  margin-top: 2px;
  .img-wrapper {
    border: solid 1px #eeeeee;
    border-radius: 50%;
    .v-image {
      border-radius: 50%;
    }
  }
}
</style>
