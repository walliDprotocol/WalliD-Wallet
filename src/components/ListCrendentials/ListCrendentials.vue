<template>
  <v-container class="credentials pt-1">
    <v-row v-if="credentials.length > 0">
      <v-col
        v-for="card in credentials"
        :key="card.id"
        cols="12"
        class="py-0 px-2 mt-1 mb-2 card"
      >
        <v-container class="pb-0">
          <v-row>
            <v-col cols="2" class="pr-2 pb-0"> <IconCredential /></v-col>
            <v-col cols="9" class="pl-2 pb-0">
              <p class="sub-title-fields">
                {{ card.credName }}
              </p>
              <p class="sub-title-fields" style="font-weight:500">
                {{ card.caName }}
              </p>
              <v-container class="px-0">
                <v-row>
                  <v-col cols="5" class="pr-0 py-0" style="max-width:unset;">
                    <div
                      class="validity"
                      style="background-color: #d9fbed;"
                      v-if="card.status == 'active'"
                    >
                      <valid />
                      <p class="FIELD-TEXT">
                        {{ $t("credentials.status." + card.status) }}
                      </p>
                    </div>
                    <div
                      v-else-if="card.status == 'pending_approval'"
                      class="validity pending"
                      style="background-color: #dbedef;"
                    >
                      <pending />
                      <p class="FIELD-TEXT">
                        {{ $t("credentials.status." + card.status) }}
                      </p>
                    </div>
                    <div
                      v-else
                      class="validity"
                      style="background-color: #fce7e7;"
                    >
                      <invalid />
                      <p class="FIELD-TEXT">
                        {{ $t("credentials.status." + card.status) }}
                      </p>
                    </div>
                  </v-col>
                  <v-col
                    v-if="card.status != 'pending'"
                    cols="7"
                    class="pb-0 pr-0 mt-n3"
                  >
                    <p class="FIELD-TEXT">
                      {{ card.expDate }}
                    </p>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
            <v-col cols="1" class="pl-1 pb-0">
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
                    <v-list-item-title
                      class="SECUNDARY-LINKS text-left"
                      @click="viewCred(card)"
                      >{{ $t("credentials.menu[0]") }}</v-list-item-title
                    >
                  </v-list-item>

                  <v-list-item
                    v-if="card.status != 'revoke'"
                    :class="card.status != 'active' ? '' : ''"
                  >
                    <v-list-item-title
                      class="SECUNDARY-LINKS text-left"
                      @click="proofPage(card)"
                      >{{ $t("credentials.menu[1]") }}</v-list-item-title
                    >
                  </v-list-item>

                  <v-list-item
                    :class="!downloadURL(card) ? 'disabled' : ''"
                  >
                    <v-list-item-title class="SECUNDARY-LINKS text-left">
                      <a :href="downloadURL(card)" target="_blank">{{
                        $t("credentials.menu[2]")
                      }}</a>
                    </v-list-item-title>
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
        <p class="SECUNDARY-LINKS mb-5">
          {{ $t("credentials.noCredentials") }}
        </p>
        <a
          class="links"
          target="_blank"
          color="#01a3b0"
          href="https://www.dev.wallid.io/import"
          @click.stop
        >
          {{ $t("credentials.store") }}
        </a>
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
import pending from "../../images/view-only.vue";

import { DELETE_CRED, ENCRYPT } from "../../store/actions";

import { mapGetters } from "vuex";

const WALLID_DOMAINS = [
  "https://demo.mycredentials.wallid.io",
  "http://localhost",
];

const PDF_URL = "https://demo.mycredentials.wallid.io/ViewCredential/";

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
    downloadURL(card) {
      if (
        this.connected &&
        new RegExp(WALLID_DOMAINS.join("|")).test(this.connected.url)
      ) {
        // At least one match
        return PDF_URL + card.id;
      }
      return card.userData.pdf_url;
    },
    viewCred(card) {
      console.log("List", this.credentials);
      console.log("List", card);
      this.$store.commit("setCurrentCred", card);
      this.$router.push({ name: "Credential" });
    },
    deleteCred(card) {
      this.$store
        .dispatch(DELETE_CRED, card.id)
        .then((res) => console.log(res))
        .catch((e) => {
          console.error(res);
        });
    },
    proofPage(card) {
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
.SECUNDARY-LINKS {
  a {
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.43;
    letter-spacing: normal;
    text-align: center;
    color: var(--charcoal-grey) !important;
    text-decoration: none;
    &:hover {
      color: #009fb1 !important;
    }
  }
}
.wallet-tooltip.v-tooltip__content.credential {
  width: 390px;
}
.tooltip-credential {
  border-radius: 3px;
  background-color: #eeeeee;
  padding: 8px 10px;
  margin: auto;
  p {
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.38;
    letter-spacing: normal;
    text-align: center;
    color: var(--charcoal-grey);
  }
}
.dot-menu {
  .v-list {
    padding: 0;
  }

  .v-list-item {
    min-height: unset;
    padding: 10px 20px;
    &.disabled {
      pointer-events: none;
      .v-list-item__title,
      a {
        color: #b8b9bb !important;
      }
    }
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
