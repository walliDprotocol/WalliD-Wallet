<template>
  <v-tooltip content-class="wallet-tooltip" bottom>
    <template v-slot:activator="{ on }">
      <div
        v-on="on"
        @click="copyToClip"
        @mouseover="copy = true"
        @mouseleave="delay()"
      >
        <div class="wallet-address ">
          <p>{{ address | truncate(6, "...") }}</p>
          <input type="hidden" id="walletCopy" :value="walletAddress" />
          <Copy v-if="!copy"></Copy>
          <CopyHover v-else> </CopyHover>
        </div>
      </div>
    </template>
    <div class="arrow-seed-tooltip"></div>
    <div class="metamask-login">
      <p v-if="show">
        {{ copyAfter[$i18n.locale] }}
      </p>
      <p v-else>
        {{ copyBefore[$i18n.locale] }}
      </p>
    </div>
  </v-tooltip>
</template>

<script>
import CopyHover from "../../images/icon-copyclipboard-selected";
import Copy from "../../images/icon-copyclipboard-unselected";

export default {
  components: {
    CopyHover,
    Copy,
  },
  mounted() {
    this.walletAddress = this.address; //this.checksumAddress
  },
  methods: {
    copyToClip() {
      let testingCodeToCopy = document.querySelector("#walletCopy");
      testingCodeToCopy.setAttribute("type", "text");
      testingCodeToCopy.select();
      try {
        document.execCommand("copy");
        this.show = true;
      } catch (err) {
        console.error(err);
      }

      /* unselect the range */
      testingCodeToCopy.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();
    },
    delay() {
      this.copy = false;
      setTimeout(() => {
        this.show = false;
      }, 400);
    },
  },
  data() {
    return {
      show: false,
      copy: false,
      walletAddress: "",
      address: this.$API.getState().address,
      copyBefore: { en: "Copy to clipboard", pt: "Copiar" },
      copyAfter: {
        en: "Copied!",
        pt: "Copiado!",
      },
    };
  },
};
</script>

<style lang="scss">
.wallet-state {
  border-radius: 11px;
  background-color: #f6f6f6;
  padding: 3px 8px;
  width: max-content;
  margin: auto;

  font-family: "Montserrat";
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--charcoal-grey);
}

.wallet-address {
  border-radius: 3px;
  background-color: var(--white);
  padding: 13px;
  padding-bottom: 11px;
  width: fit-content;
  margin: auto;
  display: flex;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--charcoal-grey);
  p {
    margin: 4px !important;
    margin-right: 22px !important;
  }
}
.wallet-tooltip {
  &.v-tooltip__content {
    width: 170px;
    height: 43px;
    background-color: transparent;
    opacity: 1 !important;
  }
  &.v-tooltip__content .metamask-login {
    border-radius: 3px;
    background-color: #eeeeee;
    padding: 10px 15px;
    margin: auto;
    width: fit-content;
  }
  p {
    margin: 0;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: center;
    color: var(--charcoal-grey);
  }
  .arrow-seed-tooltip {
    background-color: #eeeeee;
    transform: rotate(45deg);
    width: 15px;
    height: 15px;
    position: absolute;
    top: -3px;
    left: 50%;
    margin-left: -7px;
    z-index: -1;
  }
}
</style>
