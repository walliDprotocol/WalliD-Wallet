<template>
  <v-tooltip content-class="state-tooltip" bottom>
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <div class="wallet-state">
          <v-icon x-small :color="isConnected.color">mdi-circle</v-icon>
          {{ isConnected.msg }}
        </div>
      </div>
    </template>
    <div class="arrow-seed-tooltip"></div>
    <div class="metamask-login">
      <p v-if="isConnected.status == 0">
        {{ $t("state.locked[1]") }}
      </p>
      <p v-else-if="isConnected.status == 1">
        {{ $t("state.connected[1]") }}
        <br />
        <br />
        <b> {{ website }}</b>
      </p>
    </div>
  </v-tooltip>
</template>

<script>
export default {
  props: ["website"],
};
</script>

<style lang="scss">
.wallet-state {
  border-radius: 11px;
  background-color: #f6f6f6;
  padding: 3px 8px;
  width: max-content;
  margin: auto;

  font-family: "Montserrat";
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--charcoal-grey);
}
.state-tooltip {
  &.v-tooltip__content {
    border-radius: 3px;
    background-color: #eeeeee;
    padding: 10px 15px;
    width: 257px;
    height: 93px;
    opacity: 1 !important;
  }
  p {
    margin: 0;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: center;
    color: var(--charcoal-grey);
  }
  .arrow-seed-tooltip {
    background-color: #eeeeee;
    transform: rotate(45deg);
    width: 15px;
    height: 15px;
    position: absolute;
    top: -6px;
    left: 50%;
    margin-left: -7px;
    z-index: -1;
  }
}
</style>
