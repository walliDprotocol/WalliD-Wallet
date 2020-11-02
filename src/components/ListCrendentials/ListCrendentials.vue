<template>
  <v-container class="credentials pt-1">
    <v-row v-if="credentials.length > 0">
      <v-col
        v-for="card in credentials"
        :key="card.id"
        cols="12"
        class="py-0 px-2 mt-1 mb-2 card"
      >
        <v-container class="">
          <v-row>
            <v-col cols="2" class="pr-2"> <IconCredential /></v-col>
            <v-col cols="9" class="pl-2">
              <p class="sub-title-fields">
                {{ getIDTName(card.name) }}
              </p>
              <v-container class="px-0">
                <v-row>
                  <v-col cols="3" class="px-1 pt-0" style="max-width:unset;">
                    <div
                      class="validity"
                      style="background-color: #d9fbed;"
                      v-if="isValid(card.expDate)"
                    >
                      <valid />
                      <p class="FIELD-TEXT">
                        {{ $t("cards.validity[1]") }}
                      </p>
                    </div>
                    <div
                      v-else-if="card.pending"
                      class="validity pending"
                      style="background-color: #feefdd;"
                    >
                      <pending />
                      <p class="FIELD-TEXT">
                        {{ $t("cards.validity[3]") }}
                      </p>
                    </div>
                    <div
                      v-else
                      class="validity"
                      style="background-color: #fce7e7;"
                    >
                      <invalid />
                      <p class="FIELD-TEXT">
                        {{ $t("cards.validity[2]") }}
                      </p>
                    </div>
                  </v-col>
                  <v-col
                    v-if="!card.pending"
                    cols="8"
                    class="pl-3 py-0 pr-0 mt-n3"
                  >
                    <p class="FIELD-TEXT">
                      {{ $t("cards.validity[0]") }}
                      {{ card.expDate }}
                    </p>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
            <v-col cols="1" class="pl-1">
              <v-menu bottom left class="dot-menu" content-class="dot-menu">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    :ripple="false"
                    width="16"
                    class="dot-menu-button"
                    icon
                    v-bind="attrs"
                    v-on="on"
                    ><IconMenu />
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item>
                    <v-list-item-title class="SECUNDARY-LINKS text-left">{{
                      $t("credentials.menu[0]")
                    }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title
                      class="SECUNDARY-LINKS text-left"
                      @click="proofPage(card)"
                      >{{ $t("credentials.menu[1]") }}</v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" class="px-15 py-9">
        <p class="SECUNDARY-LINKS mb-5">{{ $t("credentials.noCredentials") }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ArrowFront from "../../images/icon-arrow-front.vue";
import IconAlert from "../../images/icon-warning-red.vue";
import IconCredential from "../../images/icon-credential.vue";
import IconMenu from "../../images/icon-dot-menu.vue";

import invalid from "../../images/invalid.vue";
import valid from "../../images/valid.vue";
import pending from "../../images/pending.vue";

import { ENCRYPT } from "../../store/actions";

import { mapGetters } from "vuex";

export default {
  name: "ListCredential",
  components: {
    ArrowFront,
    IconAlert,
    IconCredential,
    IconMenu,
    valid,
    invalid,
    pending,
  },
  computed: {
    ...mapGetters(["credentials"]),
  },
  methods: {
    proofPage(card) {
      console.log(card);

      this.$router.push({ name: "Proof", params: { card } });
    },
    isValid(_expDate) {
      if (_expDate) {
        var parts = _expDate.split(" ");
        var expDate = new Date(parts[2], parts[1] - 1, parts[0]);
        let currDate = new Date();
        var millisecondsPerDay = 1000 * 60 * 60 * 24;
        var millisBetween = currDate.getTime() - expDate.getTime();
        var days = millisBetween / millisecondsPerDay;
        console.log(Math.floor(days));
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

<style lang="scss">
.dot-menu {
  .v-list {
    padding: 0;
  }
  .v-list-item {
    min-height: unset;
    padding: 10px 20px;
    cursor: pointer;
    .SECUNDARY-LINKS:hover {
      color: #009fb1 !important;
    }
  }
}
.credentials {
  overflow-y: auto;
  overflow-x: hidden;

  height: 200px;
  .dot-menu-button {
    &:hover .v-btn__content {
      svg {
        g {
          fill: #009fb1 !important;
        }
      }
    }
    &::before {
      content: none;
    }
  }

  .card {
    height: 82px;
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
