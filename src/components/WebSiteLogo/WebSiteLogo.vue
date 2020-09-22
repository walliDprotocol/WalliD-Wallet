<template>
  <v-container style="width:74px" class="pa-0 text-center website-logo">
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
  #website-logo-request {
    max-height: 74px;
    max-width: 74px;
    border-radius: 50%;
    border: solid 2px #b8b9bb;
    margin: auto;
    margin-right: 0;
    margin-bottom: 12px;

    .connected & {
      border: solid 2px var(--turquoise-green);
    }
  }
  &--name {
    position: absolute;
    max-width: 74px;
    width: 74px;
    p {
      margin: auto !important;
      word-break: break-all;
    }
  }
  img {
    margin: 12px 0 2px 6px;
    border-radius: 50%;
  }
}
</style>
