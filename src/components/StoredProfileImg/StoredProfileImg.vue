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
      :style="{ width: size + 2 + 'px', height: size + 'px' }"
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
import IconMetaMask from '../../images/SocialNetworks/icon-metamask';

import IconENS from '../../images/SocialNetworks/icon-ens';

import IconAddProfile from '../../images/SocialNetworks/icon-add-profile';

import IconCC_PT from '../../images/CitizenIDs/icon-cc-pt';
import IconSHUFTI_CC_PT from '../../images/CitizenIDs/icon-cc-pt';
import IconCMD_PT from '../../images/CitizenIDs/icon-cc-pt';

export default {
  name: 'StoredProfileImg',
  props: {
    size: {
      default: 24,
      type: Number,
    },
    name: {
      type: String,
      default: 'AddProfile',
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
    IconMetaMask,
    IconENS,
    IconAddProfile,
    IconCC_PT,
    IconSHUFTI_CC_PT,
    IconCMD_PT,
  },
  computed: {
    currentSocialImg() {
      // Remove UC_ from name to get the standard CMD logo
      const _name = this.name.replace(/UC_/g, '');
      return ('Icon' + _name).trim();
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
