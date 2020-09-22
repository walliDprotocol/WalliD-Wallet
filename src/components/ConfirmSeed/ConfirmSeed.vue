<template>
  <v-container class="text-left">
    <v-row>
      <v-col cols="12">
        <div class="back-arrow mb-5">
          <v-btn text @click="stepBack" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1">
            {{ $t("create.stepper[2].title") }}
          </h2>
        </div>
        <h3 class="sub-title-fields" v-html="$t('create.stepper[2].text')"></h3>
      </v-col>
      <v-col cols="12">
        <v-container class="py-0">
          <v-row>
            <v-col
              cols="12"
              :class="{
                'confirm-seed-phrase__selected-seed-words__error-verify': setErrorSeedPhrase,
              }"
              class="confirm-seed-phrase__selected-seed-words"
            >
              <DraggableSeed
                v-for="(seedIndex, index) in selectedWords"
                :key="index"
                :className="
                  'confirm-seed-phrase__selected-seed-word confirm-seed-phrase__selected-word'
                "
                :word="getWord(index)"
                :index="index"
              />
            </v-col>
            <v-col cols="12" class="confirm-seed-phrase__sorted-seed-words">
              <DraggableSeed
                v-for="(word, index) in sortedSeedWords"
                :key="word"
                :className="'confirm-seed-phrase__seed-word--sorted'"
                :word="word"
                :index="index"
                :selected="isSelected(index)"
                @toggleSelected="toggleSelected(index)"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-col>

      <v-col cols="12" class="py-0">
        <v-btn
          text
          :disabled="isDisabled"
          @click="verifySeedPhrase"
          class="advance-btn"
        >
          {{ $t("create.stepper[2].button") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ArrowBack from "../../images/icon-arrow-back.vue";
import DraggableSeed from "./draggable-seed.vue";
export default {
  components: {
    DraggableSeed,
    ArrowBack,
  },
  watch: {
    seedPhrase(value) {
      if (value) {
        this.sortedSeedWords = (this.seedPhrase.split(" ") || []).sort();
      }
    },
  },
  computed: {
    isDisabled() {
      return this.selectedWordsIndex.length != this.sortedSeedWords.length;
    },
  },
  props: ["seedPhrase"],
  mounted() {},
  methods: {
    stepBack() {
      this.$emit("stepBack");
    },
    isValid() {
      const selectedSeedWords = this.selectedWordsIndex.map(
        (i) => this.sortedSeedWords[i]
      );
      return this.seedPhrase === selectedSeedWords.join(" ");
    },
    verifySeedPhrase() {
      if (!this.isValid()) {
        this.setErrorSeedPhrase = true;
        return;
      }
      this.$emit("step");
      //   try {
      // this.context.metricsEvent({
      //   eventOpts: {
      //     category: "Onboarding",
      //     action: "Seed Phrase Setup",
      //     name: "Verify Complete",
      //   },
      // });

      //     setSeedPhraseBackedUp(true).then(async () => {
      //       initializeThreeBox();
      //       this.setOnboardingCompleted();
      //       history.push(INITIALIZE_END_OF_FLOW_ROUTE);
      //     });
      //   } catch (error) {
      //     console.error(error.message);
      //   }
    },
    toggleSelected(index) {
      if (this.isSelected(index)) {
        this.handleDeselectSeedWord(index);
      } else {
        this.handleSelectSeedWord(index);
      }
    },
    handleDeselectSeedWord(index) {
      this.setErrorSeedPhrase = false;
      this.selectedWordsIndex = this.selectedWordsIndex.filter(
        (i) => index !== i
      );
    },
    handleSelectSeedWord(index) {
      this.selectedWordsIndex.push(index);
    },
    isSelected(index) {
      return this.selectedWordsIndex.includes(index);
    },
    getWord(index) {
      const seedIndex = this.selectedWordsIndex[index];
      const word = this.sortedSeedWords[seedIndex];
      return word;
    },
  },
  data() {
    return {
      selectedWords: Array(12).fill(null),
      selectedWordsIndex: [],
      sortedSeedWords: [],
      setErrorSeedPhrase: false,
    };
  },
};
</script>

<style></style>
