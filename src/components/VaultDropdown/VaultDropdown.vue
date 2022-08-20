<template>
  <v-container>
    <v-select
      v-if="UPAddress"
      class="pa-0 mb-6"
      :items="vaultList"
      :value="currentDisplayAddress"
      color="#009fb1"
      outlined
      dense
      append-icon="mdi-chevron-down"
      :menu-props="{
        maxHeight: 304,
      }"
      hide-details="auto"
      @input="changeDisplayAddress"
    >
      <template #selection="{ item }">
        <div class="d-flex simple-text">
          <p class="d-block mb-0 ml-3">
            {{ item | truncate(12) }}
          </p>
        </div>
      </template>
      <template #item="{ item }">
        <div class="d-flex simple-text">
          <p class="d-block mb-0 ml-3">
            {{ item | truncate(12) }}
          </p>
        </div>
      </template>
    </v-select>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    return {
      vaultList: [],
    };
  },
  computed: {
    ...mapState('lukso', {
      UPAddress: 'UPAddress',
      currentDisplayAddress: 'currentDisplayAddress',
    }),
  },
  async mounted() {
    this.vaultList = [
      this.UPAddress,
      ...(await this.$store.dispatch('lukso/fetchVaults')).value,
    ];
  },
  methods: {
    changeDisplayAddress(input) {
      console.log(input);
      this.$store.dispatch('lukso/changeCurrentDisplayAddress', {
        accountAddress: input,
      });
    },
  },
};
</script>

<style></style>
