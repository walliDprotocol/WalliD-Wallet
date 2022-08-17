<template>
  <v-container class="py-0">
    <v-row>
      <v-col cols="2" class="pr-2 pb-0">
        <StoredProfileImg
          :size="38"
          :src="image"
          :displayAmount="tokenStandard === 'ERC-1155' && amount > 1"
          :amount="amount"
        />
      </v-col>
      <v-col cols="8" class="pl-5 pb-0 pt-1">
        <v-container class="">
          <v-row>
            <v-col cols="12" class="pt-0 pb-2">
              <p
                class="sub-title-fields sub-title-fields--bold"
                style="white-space: nowrap;"
              >
                {{ title }}
              </p>
              <div class="d-flex">
                <p class="sub-title-fields mr-1" style="white-space: nowrap;">
                  {{ subtitle | truncate(20, '...') }}
                </p>
                <div
                  class="validity"
                  style="background-color: #d9fbed;"
                  v-if="(chip === 'VALID')"
                >
                  <valid />
                  <p class="FIELD-TEXT" style="color: #00e284;">
                    {{ chip }}
                  </p>
                </div>
                <div
                  v-else-if="chip === 'pending_approval'"
                  class="validity pending"
                  style="background-color: #dbedef;"
                >
                  <pending />
                  <p class="FIELD-TEXT">
                    {{ chip }}
                  </p>
                </div>
                <div
                  v-else-if="chip === 'unactive'"
                  class="validity"
                  style="background-color: #fce7e7;"
                >
                  <invalid />
                  <p class="FIELD-TEXT">
                    {{ chip }}
                  </p>
                </div>
                <div
                  v-else-if="chip"
                  class="validity"
                  style="background-color: #dbedef;"
                >
                  <p class="FIELD-TEXT chip">
                    {{ chip }}
                  </p>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="2" class="pl-1 pr-0 pb-0">
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
              <IconDotMenu />
            </v-btn>
          </template>
          <slot name="menu"></slot>
        </v-menu>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import IconDotMenu from '../../images/icon-dot-menu.vue'
import StoredProfileImg from '../../components/StoredProfileImg'
import invalid from '../../images/invalid.vue'
import valid from '../../images/valid.vue'

import { mapGetters } from 'vuex'

export default {
  props: ['image', 'title', 'subtitle', 'chip', 'amount', 'tokenStandard'],
  components: {
    IconDotMenu,
    StoredProfileImg,
    valid,
    invalid,
  },
  computed: {
    ...mapGetters(['credentials']),
  },
  data() {
    return {
      storeWeb3Link: 'https://www.wallid.io/Setup/?flow=WEB3', // "https://www.wallid.io/Setup/selectedDocumentType='Web3'",
    }
  },
}
</script>
<style lang="scss" scoped>
.dot-menu {
  margin-top: 4px;
}
</style>
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
  margin-top: 32px;
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
  .chip {
    color: #009fb1 !important;
    padding-left: 8px !important;
    font-weight: 400 !important;
  }
}
</style>
