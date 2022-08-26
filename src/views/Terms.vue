<template>
  <v-container class="faqs">
    <v-row>
      <v-col cols="12" class="pb-0">
        <div class="back-arrow mb-6">
          <v-btn text @click="$router.push('/home')" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1">
            {{ $t('terms.title') }}
          </h2>
        </div>
      </v-col>
    </v-row>

    <v-divider class="full-divider"></v-divider>
    <v-row>
      <v-col class="force-scrol sub-title-fields text-left" cols="12">
        <p v-html="$t('terms.text')"></p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ArrowBack from '../images/icon-arrow-back.vue';

export default {
  components: {
    ArrowBack,
  },
  created() {},
  beforeDestroy() {},
  mounted() {},
  computed: {},
  methods: {},
  data() {
    return {};
  },
};
</script>

<style lang="scss">
.terms {
}
</style>
