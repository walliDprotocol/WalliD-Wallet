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
import IconTwitter from '../../images/SocialNetworks/icon-twitter.vue';
import IconLinkedIn from '../../images/SocialNetworks/icon-linkedin.vue';

import IconAddProfile from '../../images/SocialNetworks/icon-add-profile.vue';

import IconCC_PT from '../../images/CitizenIDs/icon-cc-pt.vue';
import IconSHUFTI_CC_PT from '../../images/CitizenIDs/icon-cc-pt.vue';

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
