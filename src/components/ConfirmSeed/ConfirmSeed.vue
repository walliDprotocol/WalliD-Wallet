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
              <grid
                :draggable="true"
                :sortable="true"
                :items="selectedWordsIndex"
                :height="100"
                :width="100"
                @drag="updateSelectedWords"
              >
                <template slot="cell" slot-scope="props">
                  <DraggableSeed
                    :className="'confirm-seed-phrase__seed-word--sorted'"
                    :word="getWord(props.item)"
                  />
                </template>
              </grid>
            </v-col>
            <v-col cols="12" class="confirm-seed-phrase__sorted-seed-words">
              <DraggableSeed
                v-for="(word, index) in sortedSeedWords"
                :key="word"
                :classN="'confirm-seed-phrase__seed-word--sorted'"
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
import Grid from "./Grid.vue";

export default {
  components: {
    DraggableSeed,
    Grid,
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
  props: {
    seedPhrase: {},
  },
  mounted() {},
  methods: {
    updateSelectedWords(e) {
      this.selectedSe
      edWords = e.items.map((i) => this.sortedSeedWords[i.item]);
    },
    stepBack() {
      this.$emit("stepBack");
    },
    isValid() {
      return this.seedPhrase === this.selectedSeedWords.join(" ");
    },
    verifySeedPhrase() {
      if (!this.isValid()) {
        this.setErrorSeedPhrase = true;
        return;
      }
      this.$emit("step");
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
      this.selectedSeedWords = this.selectedWordsIndex.map(
        (i) => this.sortedSeedWords[i]
      );
    },
    isSelected(index) {
      return this.selectedWordsIndex.includes(index);
    },
    getWord(index) {
      // const seedIndex = this.selectedWordsIndex[index];
      const word = this.sortedSeedWords[index];
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
