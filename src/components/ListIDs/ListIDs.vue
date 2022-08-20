<template>
  <v-container
    class="id-cards list-storage"
    style="overflow-y: auto; height: 208px"
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
            <v-col cols="9" class="pl-5 pr-0">
              <p class="sub-title-fields sub-title-fields--bold">
                {{ getIDTName(card.idt) }}
              </p>
              <v-container class="py-1" v-if="hideOptions(card.idt)">
                <v-row>
                  <v-col cols="auto" class="px-1 py-2 pb-0">
                    <div
                      class="validity"
                      style="background-color: #d9fbed"
                      v-if="isValid(card.expDate)"
                    >
                      <valid />
                      <p class="FIELD-TEXT">
                        {{ $t('cards.validity[1]') }}
                      </p>
                    </div>
                    <div
                      v-else
                      class="validity pb-0"
                      style="background-color: #fce7e7"
                    >
                      <invalid />
                      <p class="FIELD-TEXT">
                        {{ $t('cards.validity[2]') }}
                      </p>
                    </div>
                  </v-col>
                  <v-col cols="8" class="py-2 pr-0 pb-0">
                    <p class="FIELD-TEXT" style="font-size: 12px">
                      {{ $t('cards.validity[0]') }}
                      {{ card.expDate }}
                    </p>
                  </v-col>
                </v-row>
              </v-container>
              <v-row v-if="card.idt === UC_CMD_PT">
                <v-col cols="auto" class="py-2 pb-0">
                  <p class="FIELD-TEXT">
                    {{
                      `${
                        WallidConst.UC_CMD_PT_LABELS['telephone'][$i18n.locale]
                      }:`
                    }}
                    {{ card.data.telephone }}
                  </p>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="1" class="pl-0 pr-1">
              <v-menu bottom left class="dot-menu" content-class="dot-menu">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    :ripple="false"
                    width="36"
                    class="dot-menu-button mt-3"
                    icon
                    v-bind="attrs"
                    v-on="on"
                  >
                    <IconDotMenu class="" />
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item v-if="hideOptions(card.idt)">
                    <v-list-item-title
                      class="SECUNDARY-LINKS text-left"
                      @click="moreInfo(card)"
                      >{{ $t('profiles.menu[0]') }}</v-list-item-title
                    >
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-title
                      class="SECUNDARY-LINKS text-left"
                      @click="deleteProfile(card)"
                      >{{ $t('profiles.menu[2]') }}</v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </v-container>
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
                      href="https://www.wallid.io/Setup/?flow=ID_CARD_WITHOUT_RETURN_URL"
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
    <v-row v-else style="background: white; height: 196px; overflow-y: hidden">
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

import IconDotMenu from '../../images/icon-dot-menu.vue';

import StoredProfileImg from '../../components/StoredProfileImg';

import * as WallidConst from '../../scripts/const';

import { mapGetters } from 'vuex';

export default {
  components: {
    ArrowFront,
    IconAlert,
    idcardImg,
    valid,
    invalid,
    StoredProfileImg,
    IconDotMenu,
  },
  computed: {
    ...mapGetters(['identities']),
  },
  methods: {
    hideOptions(idt) {
      const noExpiryIdts = [this.UC_CMD_PT];

      return !noExpiryIdts.includes(idt);
    },
    deleteProfile(card) {
      this.$store.commit('showDeleteConfirmation', true);

      this.$store.commit('setCurrentCard', card);
    },
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
    return {
      WallidConst,
    };
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
