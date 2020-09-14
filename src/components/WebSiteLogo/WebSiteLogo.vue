<template>
  <v-container style="width:74px" class="pa-0 text-center">
    <div id="website-logo-request">
      <img width="54" height="48" :src="url" />
    </div>
    <p class="FIELD-TEXT">{{ name }}</p>
  </v-container>
</template>

<script>
export default {
  props: ["url", "name"],
};
</script>

<style lang="scss">
#website-logo-request {
  max-height: 74px;
  max-width: 74px;
  border-radius: 50%;
  border: solid 1px #b8b9bb;
  margin: auto;
  margin-right: 0;
  margin-bottom: 11px;
  p {
    word-break: break-all;
  }
  img {
    margin: 12px 0 2px 6px;
    border-radius: 50%;
  }
}
</style>
