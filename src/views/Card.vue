<template>
  <v-container class="card-view">
    <v-row>
      <v-col cols="12" class="">
        <div class="back-arrow mb-3">
          <v-btn text @click="$router.push('/home')" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1 text-left">
            {{ getIDTName(card.idt) }}
          </h2>
        </div>
      </v-col>
    </v-row>
    <v-row class="">
      <v-col cols="12" class="pt-0 pb-2">
        <IDCard :cardInfo="card" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import WalletState from '../components/WalletState';
import ArrowBack from '../images/icon-arrow-back.vue';

import IDCard from '../components/IDCard';

import { mapGetters } from 'vuex';

export default {
  components: {
    WalletState,
    ArrowBack,
    IDCard,
  },
  created() {
    console.log('card', this.$route.params.card);
    this.card = this.$route.params.card;
  },
  mounted() {},
  computed: {
    ...mapGetters(['address']),
  },
  data() {
    return {
      card: undefined,
    };
  },
};
</script>

<style lang="scss">
#metamask-logo-details {
  max-height: 83px;
  max-width: 83px;

  border-radius: 50%;
  border: solid 2px #b8b9bb;
  margin: auto;
  margin-top: -35px;
}

.card-view {
  .back-btn.v-btn {
    height: 26px !important;
  }
}
</style>
