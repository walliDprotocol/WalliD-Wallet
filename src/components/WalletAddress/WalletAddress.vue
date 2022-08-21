<template>
  <v-tooltip content-class="wallet-tooltip" bottom>
    <template v-slot:activator="{ on }">
      <div
        v-on="on"
        @click="copyToClip"
        @mouseover="copy = true"
        @mouseleave="delay()"
      >
        <div class="wallet-address">
          <p style="margin: 0 5px 0 5px !important">
            {{ walletAddress | truncate(12, '...') }}
          </p>
          <input type="hidden" id="walletCopy" :value="walletAddress" />
          <Copy v-if="!copy" style="max-width: 14px; margin-right: 9px"></Copy>
          <CopyHover
            v-else
            style="max-width: 14px; margin-right: 9px"
          ></CopyHover>
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
  computed: {
    ...mapGetters(['address']),
  },
  props: ['walletAddress'],
  mounted() {},
  methods: {
    copyToClip() {
      try {
        this.copyToClipboard(this.walletAddress);
        this.show = true;
      } catch (err) {
        console.error(err);
      }

      /* unselect the range */
      // testingCodeToCopy.setAttribute('type', 'hidden');
      // window.getSelection().removeAllRanges();
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

.wallet-address {
  border-radius: 22px;
  background-color: var(--white);
  padding: 5px 7px;
  width: fit-content;
  margin: auto;
  display: flex;
  align-items: center;
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
</style>
