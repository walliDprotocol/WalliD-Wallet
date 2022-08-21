<template>
  <div>
    <div
      @click="showVaultDropdown = !showVaultDropdown"
      class="current-network"
      style="
        position: absolute;
        top: 20px;
        right: 20px;
        cursor: pointer !important;
        border: 1px solid #e5e5e5;
      "
    >
      {{ getCurrentDisplayAddressName }}
      <IconArrowDropdown
        :style="{
          transform: 'rotate(' + (showVaultDropdown ? '180deg' : '0deg') + ')',
          animation: 'transform 1s infinite linear',
          width: '8px',
          marginLeft: '6px',
          animation: 'transform 1s linear',
        }"
      />
    </div>

    <div
      v-if="showVaultDropdown"
      style="
        position: absolute;
        top: 48px;
        right: 0;
        background-color: white;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.11);
        padding-block: 11px;
        z-index: 8;
      "
      class="d-flex flex-column"
    >
      <div
        v-for="vault in vaultList"
        :key="vault.address"
        class="d-flex align-center px-5 py-3 vault-slot"
        style="cursor: pointer"
        @click="changeDisplayAddress(vault)"
      >
        <IconNetworkSelected
          :style="{
            visibility:
              getCurrentDisplayAddressName === vault.name
                ? 'visible'
                : 'hidden',
          }"
          class="mr-2"
        />
        <p class="vault-slot" style="font-size: 14px; font-weight: 600">
          {{ vault.name }}&nbsp;
        </p>
        <p
          class="vault-slot text-gray"
          style="font-size: 14px; font-weight: 500"
        >
          {{ ('• ' + vault.address) | truncate(12, '...') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import IconNetworkSelected from '../../images/icon-network-selected.vue';
import IconArrowDropdown from '../../images/icon-arrow-dropdown.vue';

import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    IconNetworkSelected,
    IconArrowDropdown,
  },
  data() {
    return {
      showVaultDropdown: false,
    };
  },
  computed: {
    ...mapGetters('lukso', ['vaultList']),
    ...mapState('lukso', {
      UPAddress: 'UPAddress',
      currentDisplayAddress: 'currentDisplayAddress',
    }),

    getCurrentDisplayAddressName() {
      return this.vaultList.find(
        (v) => v.address === this.currentDisplayAddress
      )?.name;
    },
  },
  async mounted() {},
  methods: {
    changeDisplayAddress({ address }) {
      console.log(address);
      this.$store.dispatch('lukso/changeCurrentDisplayAddress', {
        accountAddress: address,
      });
      this.showVaultDropdown = false;
    },
  },
};
</script>

<style lang="scss">
.vault-dropdown {
  cursor: pointer;
  border-radius: 15px;
  border: 1px solid #b8b9bb;
  max-height: 28px;
  font-size: 12px !important;
  font-weight: 500;
  padding: 7px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.vault-slot:hover {
  color: #009fb1 !important;
  background-color: #dbedef;
}
</style>
