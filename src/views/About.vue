<template>
  <v-container class="about">
    <v-row>
      <v-col cols="12" class="pt-1">
        <div class="back-arrow mb-2">
          <v-btn text @click="$router.push('/home')" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1">
            {{ $t("about.title") }}
          </h2>
        </div>
      </v-col>
    </v-row>
    <v-divider class="full-divider"></v-divider>
    <v-row>
      <v-col cols="12" class="pt-7 pb-1">
        <div class="round-background">
          <v-img width="107" contain src="../images/logo-wallid.png" />
        </div>
      </v-col>
      <v-col cols="12" class="pt-2 pb-1 mb-2px">
        <p class="sub-title-fields">{{ $t("about.design") }}&copy;</p>
      </v-col>
      <v-col cols="12" class="pt-2 pb-8">
        <p class="FIELD-TEXT">{{ $t("about.version") }} 1.0.4</p>
      </v-col>
    </v-row>
    <v-divider class="full-divider"></v-divider>
    <v-row>
      <v-col cols="12" class="pt-6 pb-4">
        <p class="T2">
          {{ $t("about.links[0]") }}
        </p>
      </v-col>
      <v-col cols="12" class="pt-1 pb-1">
        <router-link to="/faqs" class="links larger">
          {{ $t("about.links[1]") }}
        </router-link></v-col
      ><v-col cols="12" class="pt-1 pb-1">
        <a
          href="https://www.wallid.io/terms"
          target="_blank"
          class="links larger"
        >
          {{ $t("about.links[2]") }}</a
        >
      </v-col>
      <v-col cols="12" class="pt-1 pb-1">
        <a
          href="https://www.wallid.io/contact"
          target="_blank"
          class="links larger"
        >
          {{ $t("about.links[3]") }}
        </a>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ArrowBack from "../images/icon-arrow-back.vue";
import IconTrash from "../images/icon-trash-unselected.vue";

export default {
  components: {
    ArrowBack,
    IconTrash,
  },
};
</script>

<style lang="scss">
.about {
  .round-background {
    margin: auto;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: var(--very-light-grey);
    padding-top: 42px;
    .v-image {
      margin: auto;
    }
  }
}
</style>
