<template>
  <v-container class="social-img pa-0 pl-4 pt-2">
    <component
      class=""
      v-bind:is="currentSocialImg"
      :style="{ width: size, height: size }"
    ></component>
  </v-container>
</template>

<script>
import IconTwitter from '../../images/SocialNetworks/icon-twitter.vue';
import IconLinkedIn from '../../images/SocialNetworks/icon-linkedin.vue';

import IconAddProfile from '../../images/SocialNetworks/icon-add-profile.vue';

export default {
  name: 'SocialProfileImg',
  props: {
    size: {
      default: 24,
      type: Number,
    },
    name: {
      type: String,
      required: true,
    },
  },
  components: {
    IconTwitter,
    IconLinkedIn,
    IconAddProfile,
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
}
</style>
