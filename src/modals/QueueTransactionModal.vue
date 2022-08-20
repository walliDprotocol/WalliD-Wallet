<template>
  <v-dialog v-model="dialog" class="dialog" content-class="queue-transaction">
    <template v-slot:activator="{ on, attrs }">
      <div
        v-bind="attrs"
        v-on="on"
        :class="{
          'transaction-option-button': !isCancel,
          'transaction-option': isCancel,
        }"
      >
        {{ transactionOption }}
      </div>
    </template>
    <v-container>
      <v-row style="padding: 15px 20px 20px 20px">
        <v-col cols="12" class="d-flex align-center justify-space-between pa-0">
          <h2 class="T1">
            {{ transactionOption + ' transaction' }}
          </h2>
          <v-img
            max-width="18"
            contain
            src="../images/icons/close-icon.png"
            style="cursor: pointer"
            @click="dialog = false"
          ></v-img>
        </v-col>
        <v-col
          cols="12"
          class="mt-6 pa-5 d-flex align-center flex-column"
          style="background-color: #f7f7f7; border-radius: 3px"
        >
          <v-img
            height="50"
            max-width="50"
            contain
            :src="require('../images/logos/logo-l16PublicTestnet.png')"
          />
          <div class="d-flex mt-4" style="font-size: 15px; font-weight: 500">
            <p><strong>Max fee:&nbsp;</strong></p>
            <p>0.00000016 LXYt</p>
          </div>
          <p
            class="mt-1"
            style="color: #00e284; font-size: 13px; font-weight: 500"
          >
            Likely in &lt; 30 seconds
          </p>
        </v-col>
        <v-col
          cols="12"
          class="d-flex flex-column justify-center py-0"
          style="position: relative"
        >
          <div
            style="
              position: absolute;
              top: 4.5rem;
              left: 3.5rem;
              font-size: 13px;
              font-weight: 500;
            "
          >
            Low
          </div>
          <div
            style="
              position: absolute;
              top: 4.5rem;
              left: 8rem;
              font-size: 13px;
              font-weight: 500;
            "
          >
            Medium
          </div>
          <div
            style="
              position: absolute;
              top: 4.5rem;
              right: 3.5rem;
              font-size: 13px;
              font-weight: 500;
            "
          >
            High
          </div>
          <v-container>
            <v-radio-group v-model="gasLevel" row>
              <v-radio value="low"></v-radio>
              <v-radio value="mid"></v-radio>
              <v-radio value="high"></v-radio>
            </v-radio-group>
          </v-container>
          <div class="d-flex flex-row align-center justify-center mt-6">
            <p style="color: #009fb1; font-size: 13px; font-weight: 500">
              Advanced options
            </p>
            <div
              class="d-flex align-center"
              @click="showGasLimit = !showGasLimit"
            >
              <IconArrowDropdown
                :style="{
                  transform:
                    'rotate(' + (showGasLimit ? '180deg' : '0deg') + ')',
                  animation: 'transform 1s infinite linear',
                  maxWidth: '8px',
                  marginLeft: '6px',
                  animation: 'transform 1.5s linear',
                  cursor: 'pointer',
                }"
              />
            </div>
          </div>
        </v-col>
        <v-col
          v-if="showGasLimit"
          cols="12"
          class="text-left pt-6 pb-3 pl-0"
          style="font-size: 16px; font-weight: 500"
        >
          Gas Limit
        </v-col>
        <v-col cols="12" class="pa-0" v-if="showGasLimit">
          <v-text-field type="number" dense outlined></v-text-field>
        </v-col>
        <v-col class="pa-0" v-if="showGasLimit">
          <v-btn depressed class="advance-btn">Save</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>

<script>
import IconArrowDropdown from '../images/icon-arrow-dropdown-blue.vue';

export default {
  props: ['transactionOption', 'operation'],
  components: {
    IconArrowDropdown,
  },
  computed: {
    isCancel: function () {
      console.log(this.transactionOption === 'Cancel');
      return this.transactionOption === 'Cancel';
    },
  },
  data() {
    return {
      dialog: false,
      showGasLimit: false,
      gasLevel: 'mid',
    };
  },
};
</script>

<style lang="scss">
.v-dialog__content.v-dialog__content--active {
  background-color: rgba(0, 0, 0, 0.6);
}
</style>

<style scoped>
.transaction-option {
  color: #009fb1;
  white-space: nowrap;
  font-size: 11px;
  font-weight: 500;
  margin-top: 8px;
  cursor: pointer;
}

.transaction-option-button {
  color: white;
  background-color: #009fb1;
  padding: 2px 7px;
  border-radius: 3px;
  white-space: nowrap;
  font-size: 11px;
  font-weight: 500;
  margin-top: 8px;
  cursor: pointer;
  max-width: min-content;
  margin-right: 8px;
}
</style>
