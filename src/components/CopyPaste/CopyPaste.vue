<template>
  <v-tooltip content-class="wallet-tooltip" bottom>
    <template #activator="{ on }">
      <div
        v-on="on"
        @click="copyToClip"
        @mouseover="copy = true"
        @mouseleave="delay()"
        class="copy-wrapper"
      >
        <slot> </slot>
        <div class="button-copy">
          <input id="walletCopy" type="hidden" :value="input" />
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
import { mapGetters } from 'vuex';

import CopyHover from '../../images/icon-copyclipboard-selected';
import Copy from '../../images/icon-copyclipboard-unselected';

export default {
  components: {
    CopyHover,
    Copy,
  },

  data() {
    return {
      show: false,
      copy: false,
      copyBefore: { en: 'Copy to clipboard', pt: 'Copiar' },
      copyAfter: {
        en: 'Copied!',
        pt: 'Copiado!',
      },
    };
  },
  props: {
    input: {
      type: String,
    },
  },
  // computed: {
  //   ...mapGetters({
  //     input: 'onlineIds/generatePost',
  //   }),
  // },
  methods: {
    copyToClip() {
      try {
        this.copyToClipboard(this.input);
        this.show = true;
      } catch (err) {
        console.error(err);
      }

      /* unselect the range */
      // testingCodeToCopy.setAttribute('type', 'hidden')
      // window.getSelection().removeAllRanges()
    },

    copyToClipboard(text) {
      if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData('Text', text);
      } else if (
        document.queryCommandSupported &&
        document.queryCommandSupported('copy')
      ) {
        const textarea = document.createElement('textarea');
        textarea.textContent = text;
        textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
          return document.execCommand('copy'); // Security exception may be thrown by some browsers.
        } catch (ex) {
          console.warn('Copy to clipboard failed.', ex);
          return false;
        } finally {
          document.body.removeChild(textarea);
        }
      }
    },
    delay() {
      this.copy = false;
      setTimeout(() => {
        this.show = false;
      }, 400);
    },
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

  font-family: 'Montserrat';
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--charcoal-grey);
}
.copy-wrapper {
  position: relative;
}
.button-copy {
  border-radius: 3px;
  background-color: white;
  padding: 9px;
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
  position: absolute;
  right: 1px;
  top: 2px;
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
  .arrow-seed-tooltip--bottom {
    background-color: #eeeeee;
    transform: rotate(45deg);
    width: 15px;
    height: 15px;
    position: absolute;
    bottom: -5px;
    left: 50%;
    margin-left: -7px;
    z-index: -1;
  }
}
</style>
