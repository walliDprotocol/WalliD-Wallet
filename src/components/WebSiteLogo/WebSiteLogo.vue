<template>
  <v-container class="pa-0 text-center website-logo">
    <div
      id="website-logo-request"
      :style="{
        backgroundImage: `url(${imageURL})`,
      }"
    >
      <!-- <img :src="url" /> -->
    </div>
    <div class="website-logo--name">
      <p class="FIELD-TEXT">{{ name }}</p>
    </div>
  </v-container>
</template>

<script>
export default {
  props: ['imageURL', 'name'],
};
</script>

<style lang="scss">
.website-logo {
  // margin-right: -22px;
  #website-logo-request {
    height: 72px;
    max-width: 72px;
    border-radius: 50%;
    border: solid 2px #b8b9bb;
    margin: auto;
    margin-bottom: 12px;

    display: flex;
    align-items: center;

    background-size: contain;
    background-position: center;
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
}
</style>
