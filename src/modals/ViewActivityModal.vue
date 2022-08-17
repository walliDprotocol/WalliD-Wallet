<template>
  <v-container class="modal details-wallet">
    <v-row>
      <v-col cols="12" class="pt-1">
        <div class="back-arrow mb-4">
          <v-btn text @click="close()" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1">
            {{
              currentCred
                ? 'View activity / ' + currentCred.tokenName
                : 'Activity'
            }}
          </h2>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="queue.length > 0">
      <v-col cols="auto" class="pr-0 mr-0 d-flex align-center">
        <p class="sub-title-fields text-left mr-3" style="white-space: nowrap">
          {{ 'Queue (' + queue.length + ')' }}
        </p>
      </v-col>
      <v-col cols="auto" class="grow d-flex align-center pl-0">
        <hr />
      </v-col>
      <v-col
        cols="12"
        v-for="operation in queue"
        :key="operation.id"
        class="d-flex mb-3"
        style="background-color: #f7f7f7"
      >
        <v-col cols="auto" class="pa-0 d-flex align-center">
          <!-- missing dynamic network logo with dynamic network status image in absolute position -->
          <v-img
            height="50"
            max-width="50"
            contain
            src="../images/icons/icon-send-lyxt-pending.png"
          />
        </v-col>
        <v-col
          cols="auto"
          class="grow pa-0 ml-3 d-flex flex-column justify-center"
        >
          <div class="d-flex justify-space-between">
            <p class="sub-title-fields sub-title-fields--bold">
              {{ operation.type }}
            </p>
            <p class="sub-title-fields sub-title-fields--bold">
              {{ operation.value + ' ' + operation.tokenName }}
            </p>
          </div>
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex">
              <p
                class="sub-title-fields pr-1"
                :style="{
                  color: '#f79520',
                }"
              >
                {{ operation.status + ' • ' }}
              </p>
              <p class="sub-title-fields d-flex">
                {{ operation.address ? 'To: ' : '' }}
                {{ operation.address | truncate(8, '...') }}
                {{ operation.website | truncate(12, '...') }}
              </p>
            </div>
            <v-img
              src="../images/icon-onchain-link.svg"
              :max-height="'0.8rem'"
              :max-width="'0.8rem'"
            />
          </div>
          <div class="d-flex align-center">
            <QueueTransactionModal
              :operation="operation"
              :transactionOption="'Speed up'"
              v-if="operation.status !== 'Queued'"
            />
            <QueueTransactionModal
              :operation="operation"
              :transactionOption="'Cancel'"
            />
          </div>
        </v-col>
      </v-col>
    </v-row>
    <v-row v-if="history.length > 0">
      <v-col cols="auto" class="pr-0 mr-0 d-flex align-center">
        <p class="sub-title-fields text-left mr-3" style="white-space: nowrap">
          History
        </p>
      </v-col>
      <v-col cols="auto" class="grow d-flex align-center pl-0">
        <hr />
      </v-col>
      <v-col
        cols="12"
        v-for="operation in history"
        :key="operation.id"
        class="d-flex mb-3"
        style="background-color: #f7f7f7"
      >
        <v-col cols="auto" class="pa-0 d-flex align-center">
          <!-- missing dynamic network logo with dynamic network status image in absolute position -->
          <v-img
            v-if="operation.type !== 'Send' && operation.status === 'Completed'"
            height="50"
            max-width="50"
            contain
            src="../images/icons/icon-contractinteraction-lyxt-completed.png"
          />
          <v-img
            v-if="operation.type !== 'Send' && operation.status !== 'Completed'"
            height="50"
            max-width="50"
            contain
            src="../images/icons/icon-contractinteraction-lyxt-cancelled.png"
          />
          <v-img
            v-if="operation.type === 'Send' && operation.status === 'Completed'"
            height="50"
            max-width="50"
            contain
            src="../images/icons/icon-send-lyxt-completed.png"
          />
          <v-img
            v-if="operation.type === 'Send' && operation.status !== 'Completed'"
            height="50"
            max-width="50"
            contain
            src="../images/icons/icon-send-lyxt-cancelled.png"
          />
        </v-col>
        <v-col
          cols="auto"
          class="grow pa-0 ml-3 d-flex flex-column justify-center"
        >
          <div class="d-flex justify-space-between">
            <p class="sub-title-fields sub-title-fields--bold">
              {{ operation.type }}
            </p>
            <p class="sub-title-fields sub-title-fields--bold">
              {{ operation.value + ' ' + operation.tokenName }}
            </p>
          </div>
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex">
              <p
                class="sub-title-fields pr-1"
                :style="{
                  color:
                    operation.status === 'Completed' ? '#00e284' : '#e95e5e',
                }"
              >
                {{
                  (operation.status === 'Completed'
                    ? operation.date
                    : operation.status) + ' • '
                }}
              </p>
              <p class="sub-title-fields d-flex">
                {{ operation.address ? 'To: ' : '' }}
                {{ operation.address | truncate(8, '...') }}
                {{ operation.website | truncate(12, '...') }}
              </p>
            </div>
            <v-img
              src="../images/icon-onchain-link.svg"
              :max-height="'0.8rem'"
              :max-width="'0.8rem'"
            />
          </div>
        </v-col>
      </v-col>
    </v-row>
    <v-row
      v-else-if="history.length === 0 && queue.length === 0"
      class="justify-center d-flex mt-10"
    >
      <p class="sub-title-fields">You have no transactions</p>
    </v-row>
  </v-container>
</template>

<script>
import WalletAddress from '../components/WalletAddress';
import WalletState from '../components/WalletState';
import ArrowBack from '../images/icon-arrow-back.vue';
import QueueTransactionModal from '../modals/QueueTransactionModal.vue';

import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    WalletAddress,
    WalletState,
    ArrowBack,
    QueueTransactionModal,
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters([
      'address',
      'showViewActivityModal',
      'showQueueTransactionModal',
      'currentCred',
    ]),
    ...mapState({
      walletAddress: 'address',
      domainENS: 'domainENS',
    }),
    queue() {
      return this.operations.filter((operation) => {
        return operation.status === 'Pending' || operation.status === 'Queued';
      });
    },
    history() {
      return this.operations.filter((operation) => {
        return operation.status !== 'Pending' && operation.status !== 'Queued';
      });
    },
    operations() {
      return this.unfilteredOperations.filter((operation) => {
        return this.currentCred
          ? operation.tokenName === this.currentCred.tokenName
          : true;
      });
    },
    close() {
      this.$store.commit('setCurrentCred', null);
      this.$store.commit('showViewActivityModal', false);
    },
  },
  data() {
    return {
      transactionOption: '',
      dialog: false,
      showGasLimit: false,
      unfilteredOperations: [
        {
          id: 1,
          type: 'Send', //Send, Contract Interaction, Mint
          tokenName: 'LYXt',
          value: -0.0000116,
          status: 'Pending', //Completed, Pending, Queued, Cancelled, Failed
          date: 'Jul 22',
          address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        },
        {
          id: 2,
          type: 'Send',
          tokenName: 'Sunflower',
          value: 420,
          status: 'Queued',
          date: 'Jul 22',
          address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        },
        {
          id: 3,
          type: 'Contract Interaction',
          tokenName: 'LYXt',
          value: -0.0000116,
          status: 'Failed',
          date: 'Jul 22',
          website: 'website.com',
        },
        {
          id: 4,
          type: 'Mint',
          tokenName: 'Sunflower',
          value: 420,
          status: 'Completed',
          date: 'Jul 22',
          address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        },
      ],
    };
  },
};
</script>

<style lang="scss">
*::-webkit-scrollbar {
  display: none !important; /* for Chrome, Safari, and Opera */
}

#metamask-logo-details {
  max-height: 83px;
  max-width: 83px;

  border-radius: 50%;
  border: solid 2px #b8b9bb;
  margin: auto;
  margin-top: -35px;
}

.details-wallet {
  .darker-background.row {
    margin: 0;
    border-radius: 3px;
    background-color: var(--white);
    .wallet-state {
      background: #efefef;
    }
    .wallet-address {
      background-color: #ffffff;
      padding: 10px;
    }
  }
}

.modal {
  z-index: 1060;
  position: fixed;
  top: 74px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding: 16px;
  overflow-x: auto;
}

hr {
  border-top: 1px solid #e5e5e5 !important;
  min-width: 100% !important;
}

.v-dialog {
  margin-top: 74px;
  background-color: white;
}

.v-dialog:not(.v-dialog--fullscreen) {
  max-height: 80%;
  overflow-y: scroll;
}

.v-input--radio-group__input {
  justify-content: space-between !important;
  padding-inline: 35px;
  margin: 0 !important;
}

.v-radio {
  margin: 0 !important;
}

.v-input--selection-controls__input {
  margin: 0 !important;
}
</style>
