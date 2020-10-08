<template>
  <v-container class="pa-0 text-center website-logo">
    <div id="website-logo-request">
      <img width="54" height="48" :src="url" />
    </div>
    <div class="website-logo--name">
      <p class="FIELD-TEXT">{{ name }}</p>
    </div>
  </v-container>
</template>

<script>
export default {
  props: ["url", "name"],
};
</script>

<style lang="scss">
.website-logo {
  margin-right: -22px;
  #website-logo-request {
    max-height: 74px;
    max-width: 74px;
    border-radius: 50%;
    border: solid 2px #b8b9bb;
    margin: auto;
    margin-bottom: 12px;

    .connected & {
      border: solid 2px var(--turquoise-green);
    }
  }
  &--name {
    // position: absolute;
    max-width: 116px;

    p {
      margin: auto !important;
      word-break: break-all;
      height: 24px;
      max-width: 116px;
    }
  }
  img {
    margin: 12px 0 2px 6px;
    border-radius: 50%;
  }
}
</style>
