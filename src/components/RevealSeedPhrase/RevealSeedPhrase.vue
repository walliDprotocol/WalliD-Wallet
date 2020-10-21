<template>
  <v-container class="reveal">
    <v-row>
      <v-col cols="12" class="pt-1 pb-2">
        <div class="back-arrow mb-2">
          <v-btn text @click="$router.push('/settings')" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1">
            {{ $t("seedPhrase.title") }}
          </h2>
        </div>
      </v-col>
      <v-col cols="12" class="py-2 text-left">
        <h4 class="sub-title-fields">
          {{ $t("seedPhrase.text") }}
        </h4>
      </v-col>
    </v-row>
    <v-row v-if="!showSeedPhrase">
      <v-col cols="12" class="py-2 text-left">
        <label class="sub-title-fields">
          {{ $t("login.password[0]") }}
        </label>
        <v-text-field
          v-model="password"
          solo
          flat
          class="password-input mt-1"
          name="input-password-login"
          type="password"
          :error="passwordError"
          hide-details
        ></v-text-field>
        <p v-show="passwordError" class="error--text">
          {{ $t("login.password[1]") }}
        </p></v-col
      >
      <v-col cols="6" class="pr-2">
        <v-btn text class="cancel-btn" @click="cancel">
          {{ $t("buttons.cancel") }}
        </v-btn>
      </v-col>
      <v-col cols="6" class="pl-2">
        <v-btn text class="advance-btn" @click="revealSeedPhrase">
          {{ $t("buttons.confirm") }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" class="text-left">
        <label class="sub-title-fields">
          {{ $t("seedPhrase.label") }}
        </label>
        <div class="seed-phrase mt-1">
          {{ seedPhrase }}
          <input type="hidden" id="seedPhrase" :value="seedPhrase" />
        </div>
        <p v-show="passwordError" class="error--text">
          {{ $t("login.password[1]") }}
        </p>
      </v-col>
      <v-col cols="12" class="pt-2 pb-4 mb-2px">
        <div class="alert">
          <icon-alert />
          <p class="alerts-font">{{ $t("seedPhrase.alert") }}</p>
        </div>
      </v-col>

      <v-col cols="6" class="pr-2">
        <v-btn text class="advance-btn" @click="copySeedPhrase">
          {{ $t("seedPhrase.copy") }}
        </v-btn>
      </v-col>
      <v-col cols="6" class="pl-2">
        <v-btn text class="advance-btn" @click="saveCSV">
          {{ $t("seedPhrase.csv") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ArrowBack from "../../images/icon-arrow-back.vue";
import IconAlert from "../../images/icon-warning-red.vue";
import { REVEAL_SEED_PHRASE } from "../../store/actions";
export default {
  components: {
    ArrowBack,
    IconAlert,
  },
  methods: {
    cancel() {
      this.$router.go(-1);
      this.seedPhrase = "";
    },
    revealSeedPhrase() {
      this.debug("revealSeedPhrase");

      this.$store
        .dispatch(REVEAL_SEED_PHRASE, this.password)
        .then((result) => {
          this.debug("SeedPhrase", result);
          this.passwordError = false;
          this.seedPhrase = result;
          this.showSeedPhrase = true;
        })
        .catch((e) => {
          console.error(e);
          this.passwordError = true;
        });
    },
    copySeedPhrase() {
      this.debug("copySeedPhrase");
      let testingCodeToCopy = document.querySelector("#seedPhrase");
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
    getRandomFileName() {
      let fileName = "";
      const charBank = [
        ..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      ];
      const fileNameLength = Math.floor(Math.random() * 7 + 6);

      for (let i = 0; i < fileNameLength; i++) {
        fileName += charBank[Math.floor(Math.random() * charBank.length)];
      }

      return fileName;
    },
    saveCSV() {
      this.debug("saveCSV");
      let type = "text/csv";
      let filename = "";
      // eslint-disable-next-line no-param-reassign
      filename = filename || this.getRandomFileName();
      // source: https://stackoverflow.com/a/33542499 by Ludovic Feltz
      const blob = new window.Blob([this.seedPhrase], { type });
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
      } else {
        const elem = window.document.createElement("a");
        elem.target = "_blank";
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
      }
    },
  },
  data() {
    return {
      password: "",
      passwordError: false,
      showSeedPhrase: false,
      seedPhrase: "",
    };
  },
};
</script>

<style lang="scss" scoped>
.reveal {
  .alert {
    display: flex;
    padding: 16px;
    padding-right: 16px;
    border-radius: 3px;
    background: rgba(233, 94, 94, 0.19);
    svg {
      min-width: 22px;
      align-self: center;
    }
    p {
      margin-left: 18px !important;
      text-align: left;
    }
  }
  .seed-phrase {
    padding: 0;
    margin: 0;
    border-radius: 3px;
    background-color: var(--very-light-grey);
    border: solid 1px #b8b9bb;

    padding: 12px 42px !important;
    margin-top: 0;
    font-size: 16px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: center;
    color: var(--charcoal-grey);
  }
}
</style>
