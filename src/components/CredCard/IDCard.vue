<template>
  <FlipCard
    class="id-card mb-4"
    :style="cardSize"
    :class="{ large_card: large }"
    :hasBack="
      backTemplate && backTemplate.headers && backTemplate.headers.length > 0
    "
    @flipped="(e) => (flipped = e)"
    :flipped="flipped"
    :height="height"
    :width="width"
    :hasColor="hasColor"
    v-if="!loading"
  >
    <template slot="front">
      <v-container class="px-6 py-2">
        <v-row class="justify-start">
          <v-col class="field title pb-1 pt-1 text-center" cols="12">
            <v-img
              v-if="urlPhoto"
              class="mx-auto"
              contain
              :max-height="large ? '80' : '30'"
              :max-width="large ? '230' : ''"
              :src="urlPhoto"
            />
          </v-col>
          <v-col
            class="field title pt-1 text-center"
            cols="12"
            :class="large ? 'pb-4' : 'pb-1'"
          >
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
            class="field px-0"
            :class="large ? ' py-1' : ' py-0'"
            :cols="calcCols(front.length, field.type)"
            :sm="calcCols(front.length, field.type)"
          >
            <div
              v-if="field.type == 'blank'"
              class="blank"
              :style="idCardStyle(front.length, field.type)"
            ></div>
            <div
              v-if="field.type == 'signature'"
              class="signature"
              :style="idCardStyle(front.length, field.type)"
            >
              <label
                class="sig"
                :style="'font-family: ' + field.font + ' !important '"
                >{{ field.text }}</label
              >
              <p class="name">{{ field.text }}</p>

              <p class="role">{{ field.role }}</p>
            </div>
            <div
              v-if="field.type == 'logos'"
              class="logos"
              :style="idCardStyle(front.length, field.type)"
            >
              <v-img
                :style="logoStyle()"
                :max-height="large ? '60' : '40'"
                :max-width="large ? '60' : '40'"
                contain
                :src="field.url"
              >
              </v-img>
            </div>
            <div
              v-if="field.type == 'attribute'"
              :style="idCardStyle(front.length, field.type)"
            >
              <label>{{ field.attribute }}</label>
              <p>{{ getValue(index, field) }}</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template slot="back">
      <v-container class="px-6">
        <v-row class="justify-space-between">
          <v-col class="field py-1" cols="12">
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
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon v-if="editable" small @click="deleteItem(item)">
                  mdi-delete
                </v-icon>
              </template>
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
                  :large="large"
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
const FILESTACK = "https://www.filestackapi.com/api/file/";

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
    frontend_props: {
      default: () => {},
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
    editable: {
      type: Boolean,
    },
  },
  mounted() {
    this.loading = false;
    console.log("frontTemplate", this.frontTemplate);
    console.log("backTemplate", this.backTemplate);
    console.log("frontend_props", this.frontend_props);

    this.logos =
      this.frontend_props && this.frontend_props.logos
        ? this.frontend_props.logos.map((e) => {
            return { url: FILESTACK + e.url };
          })
        : [];
    this.sigs =
      this.frontend_props && this.frontend_props.sigs
        ? this.frontend_props.sigs.slice()
        : [];
    this.hasColor = this.frontend_props && this.frontend_props.color;

    console.log("sigs", this.sigs);
    console.log("logos", this.logos);
    console.log("templateValues", this.templateValues);

    console.log("hasColor", this.hasColor);

    this.createCard(this.frontTemplate);
    // [{ attribute: "File", input: "file", index: 2, cellCount: 1 }];
    // if (this.backTemplate) {
    //   this.createTable(this.backTemplate);
    // }
    this.headersTable =
      this.backTemplate && this.backTemplate.headers
        ? [...this.backTemplate.headers]
        : [];
    this.tableItems =
      this.tableValues.length == 0
        ? this.backTemplate.values
        : [...this.tableValues];

    if (this.tableItems.length == 0 && this.headersTable) {
      this.fillBlank();
    }

    if (this.editable) {
      this.headersTable.push({
        value: "actions",
        width: 10,
        sortable: false,
      });
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
    cardSize() {
      return `height: ${this.height}px; width: ${this.width}px`;
    },
  },
  methods: {
    deleteItem(item) {
      let editedIndex = this.tableValues.indexOf(item);
      this.$emit("removeItem", editedIndex);
    },

    getValue(index, field) {
      console.log(field);
      console.log(index);
      console.log(this.templateValues);

      if (this.templateValues.length > 0) {
        let res = this.templateValues.find((e) => e.attr == field.attribute);
        return res && res.value ? res.value : "-";
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
      this.totalCols = 2 * Math.floor(value.length / 2) + 2;
      let i = 0;
      let count = 0;
      for (i, count = 0; count < MAX_FIELDS && i < value.length; i++, count++) {
        console.log(value[i]);

        let e = {
          attribute: value[i].attr,
          type: "attribute",
          input: value[i].type,
          value: value[i].value || "-",
        };
        console.log(e);

        this.front.push(e);
      }

      for (i = 0, count = 0; i < this.sigs.length; i++, count++) {
        console.log(this.sigs[i]);

        let e = {
          font: this.sigs[i].font,
          type: "signature",
          role: this.sigs[i].role,
          text: this.sigs[i].text,
        };
        console.log(e);

        this.front.push(e);
      }
      if (this.frontTemplate.length < 3 && this.logos.length > 0) {
        // let e = {
        //   type: "blank",
        // };
        // this.front.splice(1, 0, e);
        if (this.logos.length > 1) {
          this.front.splice(1, 0, {
            url: this.logos[1].url,
            type: "logos",
          });
          this.front.splice(4, 0, {
            url: this.logos[2].url,
            type: "logos",
          });
        } else {
          this.front.splice(4, 0, {
            url: this.logos[1].url,
            type: "logos",
          });
        }
      } else if (this.frontTemplate.length < 4 && this.logos.length > 0) {
        for (i = 1; i < this.logos.length; i++) {
          console.log(this.logos[i].url, i, this.logos.length);

          this.front.splice(this.front.length - 1, 0, {
            url: this.logos[i].url,
            type: "logos",
          });
        }
      } else if (
        this.frontTemplate.length % 2 == 0 &&
        this.frontTemplate.length < 5 &&
        this.logos.length > 0
      ) {
        let e = {
          type: "blank",
        };

        this.front.splice(1, 0, e);
        if (this.logos.length > 1) {
          this.front.splice(4, 0, {
            url: this.logos[1].url,
            type: "logos",
          });
          this.front.splice(7, 0, {
            url: this.logos[2].url,
            type: "logos",
          });
        } else {
          this.front.splice(4, 0, e);
          this.front.splice(4, 0, {
            url: this.logos[1].url,
            type: "logos",
          });
        }
      } else if (this.frontTemplate.length >= 5 && this.logos.length > 0) {
        for (i = 1; i < this.logos.length; i++) {
          console.log(this.logos[i].url, i, this.logos.length);

          this.front.splice(this.front.length - 1, 0, {
            url: this.logos[i].url,
            type: "logos",
          });
        }
        if (this.frontTemplate.length == 5) {
          let e = {
            type: "blank",
          };
          this.front.splice(this.front.length - 4, 0, e);
        }
      }
      // for (i = 1, count = 0; i < this.logos.length; i++, count++) {
      //   console.log(this.logos[i]);

      //   let e = {
      //     url: this.logos[i].url,
      //     type: "logos",
      //   };
      //   console.log(e);

      //   this.front.push(e);
      // }
      console.log("front ", this.front);

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
    calcCols(side, type) {
      switch (true) {
        // case type == "attribute" && this.frontTemplate.length >= 5:
        //   return 4;
        // case type == "signature" && this.frontTemplate.length >= 5:
        //   return 4;
        case type == "logos" && this.frontTemplate.length <= 2:
          return 2;
        case type == "signature" && this.frontTemplate.length <= 2:
          return 5;
        case type == "attribute" &&
          this.frontTemplate.length <= 2 &&
          this.logos.length > 1:
          return 5;
        case (type == "logos" || type == "blank") &&
          this.frontTemplate.length == 4:
          return 2;
        case this.frontTemplate.length == 4 && this.logos.length > 1:
          return 5;
        case type == "attribute" &&
          this.frontTemplate.length <= 6 &&
          this.logos.length > 1:
          return 4;
        case type == "signature" && this.frontTemplate.length <= 6:
          return 4;
        case (type == "signature" || type == "attribute") &&
          this.logos.length > 1:
          return 5;
        case type == "logos" || type == "blank":
          return 2;
        case side <= 2:
          return 6;
        case side == 3:
          return 4;
        case side <= 4:
          return 6;
        case side <= 6:
          return 4;
        case this.sigs.length > 0:
          return 4;
        default:
          return 3;
      }
    },
    logoStyle() {
      switch (true) {
        case this.frontTemplate.length == 4:
          return "margin-top: 0px";
      }
    },
    idCardStyle(side, type) {
      switch (true) {
        case type == "logos" && this.frontTemplate.length < 3 && this.large:
          return "padding: 18px 6px;";
        case type != "logos" && this.frontTemplate.length < 3 && this.large:
          return "padding: 18px 6px; padding-left:20px ";
        case type == "attribute" &&
          this.frontTemplate.length <= 3 &&
          this.large:
          return "padding: 18px 6px";
        case type == "signature" || type == "attribute":
          return "padding-left:6px; padding-right:6px;";
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
      logos: [],
      sigs: [],
      hasColor: null,
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
    * {
      box-shadow: none !important;
    }
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
  .signature {
    label.sig {
      text-transform: none;
      font-size: 14px;
      line-height: 1.45;
    }
    .name {
      font-size: 11px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.45;
      letter-spacing: normal;
      color: var(--charcoal-grey);
    }
    .role {
      font-size: 9px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.7;
      letter-spacing: normal;
      color: var(--charcoal-grey);
    }
  }
  .field {
    padding: 2px !important;
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
      font-size: 9px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.75;
      letter-spacing: normal;
      text-align: left;
      color: var(--charcoal-grey);
      display: block;
      text-transform: uppercase;
    }
    p {
      font-size: 10px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.65;
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
