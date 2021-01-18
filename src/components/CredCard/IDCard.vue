<template>
  <FlipCard
    class="id-card mb-4"
    :style="style"
    :class="{ large_card: large }"
    :hasBack="
      backTemplate && backTemplate.headers && backTemplate.headers.length > 0
    "
    @flipped="(e) => (flipped = e)"
    :flipped="flipped"
    v-if="!loading"
  >
    <template slot="front">
      <v-container class="px-6">
        <v-row class="justify-space-between">
          <v-col class="field title pb-1 pt-2px text-center" cols="12">
            <v-img
              v-if="urlPhoto"
              class="mx-auto"
              contain
              :max-height="large ? '80' : '35'"
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
              <p>{{ getValue(index, field) }}</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template slot="back">
      <v-container class="px-6">
        <v-row class="justify-space-between" style="height: 90vh">
          <v-col class="field py-1" style="overflow: auto" cols="12">
            <v-data-table
              id="card-table"
              fixed-header
              :height="height - 20"
              :headers="headersTable"
              :items-per-page="5"
              :items="tableItems"
              disable-sort
              :page="page"
              hide-default-footer
              mobile-breakpoint="100"
            >
              <template
                v-slot:footer="{
                  props: {
                    pagination: {
                      pageCount,
                      itemsLength,
                    },
                  },
                }"
              >
                <Pagination
                  @updatePage="(i) => (page = i)"
                  :pageCount="pageCount"
                  :page="page"
                  :itemsLength="itemsLength"
                />
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </FlipCard>
</template>

<script>
import FlipCard from "./FlipCard";
import Pagination from "./Pagination";

const MAX_FIELDS = 6;
const MAX_FIELDS_BACK = 6;

export default {
  name: "IDCard",
  components: {
    FlipCard,
    Pagination,
  },
  props: {
    frontTemplate: {
      required: true,
    },
    backTemplate: {
      required: false,
      default: () => {},
    },
    tableValues: {
      required: false,
      default: () => [],
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
    console.log("frontTemplate", this.frontTemplate);
    console.log("backTemplate", this.backTemplate);
    console.log("tableValues", this.tableValues);

    this.createCard(this.frontTemplate);
    // [{ attribute: "File", input: "file", index: 2, cellCount: 1 }];
    // if (this.backTemplate) {
    //   this.createTable(this.backTemplate);
    // }
    this.headersTable = this.backTemplate ? this.backTemplate.headers : [];
    this.tableItems =
      this.tableValues.length == 0
        ? this.backTemplate.values
        : [...this.tableValues];

    if (this.tableItems.length == 0 && this.headersTable) {
      this.fillBlank();
    }
    console.log("headersTable", this.headersTable);
  },

  watch: {
    frontTemplate(value = []) {
      this.createCard(value);
    },
    tableValues(value) {
      if (value && value.length > 0) {
        this.tableItems = value;
        this.flipped = true;
      }
    },
  },
  computed: {
    style() {
      return `height: ${this.height}px; width: ${this.width}px`;
    },
  },
  methods: {
    getValue(index, field) {
      console.log(field);
      console.log(index);
      console.log(this.tableValues);

      if (this.templateValues.length > 0) {
        return this.templateValues[index].value || "-";
      }

      return field.value;
    },
    fillBlank() {
      let el = {};
      this.headersTable.forEach((e) => {
        el[e.value] = "-";
      });
      this.tableItems.push(el);
    },
    // createTable(template) {
    //   console.log(template);
    //   let el = {};
    //   this.headersTable = template.map((e) => {
    //     console.log(e);
    //     el[e.typeHeader] = "-";
    //     return {
    //       text: e.typeHeader || e.text,
    //       align: "start",
    //       value: e.typeHeader || e.value,
    //     };
    //   });

    //   el["tech"] = "-";

    //   this.techTable.push(el);

    //   this.headersTable.unshift({
    //     text: template[0].module,
    //     align: "start",
    //     value: "tech",
    //   });
    //   console.log(this.headersTable);
    //   console.log(this.techTable);
    //   this.back = template;
    // },
    createCard(value) {
      console.log(value);
      this.totalCols = 2 * Math.floor(value.length / 2) + 2;
      let i = 0;
      let count = 0;
      for (i, count = 0; count < MAX_FIELDS && i < value.length; i++, count++) {
        console.log(value[i]);

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
      console.log(side);
      switch (true) {
        case side <= 2:
          return 6;
        case side == 3:
          return 4;
        case side <= 4:
          return 6;
        case side <= 6:
          return 3;
        default:
          return 3;
      }
    },
    idCardStyle(side) {
      switch (true) {
        case side <= 2:
          return "padding-left:16px; margin-top: 30px;";
        case side == 3:
          return " margin-top: 30px;";
        case side <= 4:
          return "padding-left:16px";
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
      page: 1,
      flipped: false,
      tableItems: [],
      headersTable: [],
      loading: true,
      unlocked: false,
    };
  },
};
</script>

<style lang="scss">
div.id-card {
  width: 100%;
  margin: 0 auto;
  #card-table.v-data-table {
    background: transparent;
    > .v-data-table__wrapper > table > thead > tr:last-child > th {
      padding-left: 0;
      border: none;
      background: transparent;
    }
    > div.v-data-table__wrapper > table > tbody > tr:hover {
      background: none;
    }

    > .v-data-table__wrapper > table > tbody > tr > td,
    > .v-data-table__wrapper > table > thead > tr > td,
    > .v-data-table__wrapper > table > tfoot > tr > td {
      padding: 6px;
      font-size: 10px;
      font-weight: 600;
      color: var(--charcoal-grey);
      border: none;
      height: unset;
    }
  }
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
        font-size: 13px;
      }
      p {
        font-size: 15px;
      }
    }
  }
  .field {
    padding: 0 !important;
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
