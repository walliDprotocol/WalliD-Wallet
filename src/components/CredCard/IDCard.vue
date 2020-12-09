<template>
  <FlipCard
    class="id-card mb-4"
    :style="style"
    :class="{ large_card: large }"
    :hasBack="back.lenght > 0"
    v-if="!loading"
  >
    <template slot="front">
      <v-container class="px-5">
        <v-row class="justify-space-between">
          <v-col class="field title pb-1 pt-2px text-center" cols="12">
            <v-img
              v-if="urlPhoto"
              class="mx-auto"
              max-height="35"
              max-width="80"
              :src="urlPhoto"
            />
          </v-col>
          <v-col class="field title pb-1 pt-2px text-center" cols="12">
            <div>
              <label>{{ certName }}</label>
              <p>
                {{ caName }}
              </p>
            </div>
          </v-col>
          <v-col
            v-for="(field, index) in front"
            v-bind:key="index"
            class="field py-1"
            :cols="calcCols(front.length)"
            :sm="calcCols(front.length)"
          >
            <div :style="idCardStyle(front.length)">
              <label>{{ field.attribute }}</label>
              <p>{{ getValue(index) }}</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template slot="back">
      <v-container class="px-5">
        <v-row class="justify-space-between">
          <v-col
            v-for="(field, index) in back"
            v-bind:key="index"
            class="field py-1"
            :cols="calcCols(back.length)"
            :sm="calcCols(back.length)"
          >
            <div :style="idCardStyle(back.length)">
              <label>{{ field.attribute }}</label>
              <p>{{ getValue(index) }}</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </FlipCard>
</template>

<script>
import FlipCard from "./FlipCard";

const MAX_FIELDS = 6;
const MAX_FIELDS_BACK = 6;

export default {
  name: "IDCard",
  components: {
    FlipCard,
  },
  props: {
    template: {
      required: true,
    },
    templateValues: {
      required: false,
      default: () => [],
    },
    caName: {
      required: true,
    },
    certName: {
      required: true,
    },
    urlPhoto: {
      required: true,
    },
    width: {
      default: 368,
    },
    height: {
      default: 235,
    },
    large: {
      default: false,
    },
  },
  mounted() {
    this.loading = false;
    console.log(this.template);
    this.createCard(this.template);
    // [{ attribute: "File", input: "file", index: 2, cellCount: 1 }];
  },

  watch: {
    template(value = []) {
      this.createCard(value);
    },
  },
  computed: {
    style() {
      return `height: ${this.height}px; width: ${this.width}px`;
    },
  },
  methods: {
    getValue(index) {
      console.log(this.template[index].value);

      let entry = this.templateValues[index];
      console.log(entry);
      return entry && entry.value
        ? entry.value
        : this.template[index].value
        ? this.template[index].value
        : "-";
    },
    createCard(value) {
      console.log(value);
      this.totalCols = 2 * Math.floor(value.length / 2) + 2;
      let i = 0;
      let count = 0;
      for (i, count = 0; count < MAX_FIELDS && i < value.length; i++, count++) {
        console.log(value[i].value);

        let e = {
          attribute: value[i].attr,
          input: value[i].type,
          value: value[i].value || "-",
        };
        console.log(e);

        this.front.push(e);
      }
      for (
        i, count = 0;
        count < MAX_FIELDS_BACK && i < value.length;
        i++, count++
      ) {
        let e = {
          attribute: value[i].attr,
          input: value[i].type,
          value: value[i].value || "-",
        };
        this.back.push(e);
      }
    },
    calcCols(side) {
      switch (true) {
        case side <= 2:
          return 6;
        case (side = 3):
          return 4;
        case side <= 4:
          return 6;
        case side <= 6:
          return 4;
        default:
          return 4;
      }
    },
    idCardStyle(side) {
      switch (true) {
        case side <= 2:
          return "padding-left:12px; margin-top: 30px;";
        case (side = 3):
          return " margin-top: 30px;";
        case side <= 4:
          return "padding-left:12px";
        case side <= 6:
          return 4;
        default:
          return 4;
      }
    },
  },
  data() {
    return {
      card: undefined,
      front: [],
      back: [],
      loading: true,
      unlocked: false,
    };
  },
};
</script>

<style lang="scss">
.id-card {
  width: 100%;
  margin: 0 auto;
  .tooltip-unlock {
    position: absolute;
    top: 15px;
    right: 18px;
    display: inline-block;
    border: none;
    border-radius: 50%;
    min-width: unset !important;
    max-width: 38px;
  }
  &.large_card {
    .field {
      padding-right: 0 !important;
      &.title {
        * {
          font-size: 18px;
        }
      }
      label {
        font-size: 15px;
      }
      p {
        font-size: 18px;
      }
    }
  }
  .field {
    padding-right: 0 !important;
    &.title {
      * {
        text-align: center;
        font-size: 12px;
        line-height: 1.58;
      }
      label {
        font-weight: 600;
        text-transform: none;
      }
      p {
        font-weight: 500;
        font-style: italic;
      }
    }
    & > div {
      text-align: left;
      p {
        max-height: 60px;
        overflow: auto;
      }
    }
    label {
      font-size: 10px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2.25;
      letter-spacing: normal;
      text-align: left;
      color: var(--charcoal-grey);
      display: block;
      text-transform: uppercase;
    }
    p {
      font-size: 12px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 2.05;
      letter-spacing: normal;
      text-align: left;
      color: var(--charcoal-grey);
      word-break: break-word;
      margin-bottom: 0;
    }
  }
}

.view-id-popover.v-tooltip__content {
  border: solid 1px transparent !important;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.2) !important;
  background-color: var(--very-light-grey);
  background: var(--very-light-grey);

  padding: 6px 8px;
  p {
    font-size: 11px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: var(--charcoal-grey);
    margin: 0;
  }
  .arrow {
    padding: 6px;
    position: absolute;
    margin: 0px;
    border: solid 1px transparent;
    background: var(--very-light-grey);
    transform: rotate(45deg);
    border-width: 1px;
    box-shadow: -2px -2px 4px -2px rgba(0, 0, 0, 0.2) !important;
    top: -8px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>
