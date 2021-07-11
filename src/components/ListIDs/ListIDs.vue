<template>
  <v-container
    class="id-cards list-storage pt-1"
    style="overflow-y: auto;
    height: 208px;"
  >
    <v-row v-if="identities.length > 0">
      <v-col
        v-for="card in identities"
        :key="card.id"
        cols="12"
        class="py-0 px-1 mt-1 mb-2 card"
      >
        <v-container class="py-0 px-3">
          <v-row>
            <v-col cols="2" class="pr-1">
              <StoredProfileImg :size="38" :name="card.idt" />
            </v-col>
            <v-col cols="9" class="pl-5 pr-0 pb-1">
              <p class="sub-title-fields sub-title-fields--bold">
                {{ getIDTName(card.idt) }}
              </p>
              <v-container class="py-1">
                <v-row>
                  <v-col cols="3" class="px-1 py-2" style="max-width:unset;">
                    <div
                      class="validity"
                      style="background-color: #d9fbed;"
                      v-if="isValid(card.expDate)"
                    >
                      <valid />
                      <p class="FIELD-TEXT">
                        {{ $t('cards.validity[1]') }}
                      </p>
                    </div>
                    <div
                      v-else
                      class="validity"
                      style="background-color: #fce7e7;"
                    >
                      <invalid />
                      <p class="FIELD-TEXT">
                        {{ $t('cards.validity[2]') }}
                      </p>
                    </div>
                  </v-col>
                  <v-col cols="8" class="py-2 pr-0">
                    <p class="FIELD-TEXT" style="font-size:12px">
                      {{ $t('cards.validity[0]') }}
                      {{ card.expDate }}
                    </p>
                  </v-col>
                </v-row>
              </v-container> </v-col
            ><v-col cols="1" class="pl-0 pr-1">
              <v-btn text @click="moreInfo(card)" class="back-btn">
                <arrow-front />
              </v-btn> </v-col></v-row
        ></v-container>
      </v-col>
      <v-col cols="12" class="py-0 px-1 mt-1 mb-2 card">
        <v-container class="py-0 px-3">
          <v-row>
            <v-col cols="2" class="">
              <StoredProfileImg :size="38" :name="'AddProfile'" />
            </v-col>
            <v-col cols="8" class="pl-6 pr-0">
              <v-container class="py-0">
                <v-row>
                  <v-col cols="12" class="py-0 pr-0">
                    <a
                      class="MAIN-LINKS links"
                      target="_blank"
                      color="#01a3b0"
                      href="https://www.wallid.io/"
                      @click.stop
                    >
                      {{ $t('cards.addNew') }}
                    </a>
                  </v-col>
                  <v-col cols="12" class="py-0">
                    <p class="sub-title-fields"></p>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <v-row
      v-else
      style="background: white;
    height: 196px;
    overflow-y: hidden;"
    >
      <v-col cols="12" class="px-15 py-9">
        <p class="SECUNDARY-LINKS mb-5">{{ $t('cards.noids') }}</p>
        <a
          class="links"
          target="_blank"
          color="#01a3b0"
          href="https://www.wallid.io/"
          @click.stop
        >
          {{ $t('cards.store') }}
        </a>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ArrowFront from '../../images/icon-arrow-front.vue';
import IconAlert from '../../images/icon-warning-red.vue';
import idcardImg from '../../images/icon-id-document.vue';
import invalid from '../../images/invalid.vue';
import valid from '../../images/valid.vue';

import StoredProfileImg from '../../components/StoredProfileImg';

import { mapGetters } from 'vuex';

export default {
  components: {
    ArrowFront,
    IconAlert,
    idcardImg,
    valid,
    invalid,
    StoredProfileImg,
  },
  computed: {
    ...mapGetters(['identities']),
  },
  methods: {
    moreInfo(card) {
      console.log(card);

      this.$router.push({ name: 'Card', params: { card } });
    },
    isValid(_expDate) {
      if (_expDate) {
        var parts = _expDate.split(/[ -]+/);
        var expDate = new Date(parts[0], parts[1] - 1, parts[2]);
        let currDate = new Date();
        var millisecondsPerDay = 1000 * 60 * 60 * 24;
        var millisBetween = currDate.getTime() - expDate.getTime();
        var days = millisBetween / millisecondsPerDay;
        // Round down.
        return Math.floor(days) <= 0;
      } else {
        return false;
      }
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.id-cards {
  overflow-y: auto;
  overflow-x: hidden;

  height: 200px;
  .card {
    // height: 82px;
    background-color: var(--white);
    .sub-title-fields {
      font-size: 14px !important;
      text-align: left;
    }
    .col-8 {
      align-items: center;
      display: flex;
    }
    .FIELD-TEXT {
      text-align: left;
    }
    .back-btn {
      padding: 0 !important;
      min-width: 16px !important;
    }
    .validity {
      border-radius: 11px;
      background-color: #d8d8d8;
      width: fit-content;
      padding: 1px;
      padding-right: 8px;
      display: flex;
      svg {
        margin: 6px;
      }
    }
  }
}
</style>
