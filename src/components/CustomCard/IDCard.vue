<template>
  <FlipCard
    id="id-card"
    class="id-card mb-4"
    :style="cardStyles"
    :class="flipCardClass"
    :hasBack="
      backTemplate && backTemplate.headers && backTemplate.headers.length > 0
    "
    @flipped="(e) => (flipped = e)"
    :flipped="flipped"
    :height="height"
    :width="width"
    :hasColor="hasColor"
    :background="frontend_props.background_url"
    :print="print"
    :proof_url="proof_url"
  >
    <template slot="front">
      <component :is="templateName" v-bind="$props" :getValue="getValue" />
    </template>
    <template slot="back">
      <v-container class="px-6">
        <v-row class="justify-space-between">
          <v-col class="field py-1" cols="12">
            <v-data-table
              id="card-table"
              :style="cssVars"
              fixed-header
              :height="height - 45"
              :headers="headersTable"
              :items-per-page="20"
              :items="tableItems"
              disable-sort
              :page="page"
              hide-default-footer
              mobile-breakpoint="100"
            >
              <template v-slot:body="{ items }">
                <tbody>
                  <tr v-for="(row, indexR) in items" :key="indexR">
                    <td v-for="(item, indexL) in row" :key="indexL">
                      {{ reduceText(item, maxLengthDesc)[0] }}
                      <v-tooltip
                        v-if="
                          reduceText(item, maxLengthDesc).length > 1 && !print
                        "
                        bottom
                        content-class="tooltip-desc"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <span v-bind="attrs" v-on="on">
                            <more-info> </more-info>
                          </span>
                        </template>
                        <p>{{ item }}</p>
                      </v-tooltip>
                    </td>
                  </tr>
                </tbody>
              </template>
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
import FlipCard from './FlipCard';
import Pagination from './Pagination';
import MoreInfo from './assets/more-info';

//Templates
import defaultTemplate from './templates/defaultTemplate';

import keepCodingV1 from './templates/keepCodingV1';

export default {
  name: 'IDCard',
  components: {
    FlipCard,
    Pagination,
    MoreInfo,
    keepCodingV1,
    defaultTemplate,
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
    credentialName: {
      required: true,
    },
    urlPhoto: {
      required: true,
    },
    frontend_props: {
      default: () => {},
    },
    width: {
      default: 376,
    },
    height: {
      default: 265,
    },
    large: {
      default: false,
    },
    extraLarge: {
      default: false,
    },
    editable: {
      type: Boolean,
    },
    print: {
      type: Boolean,
    },
    proof_url: {},
  },
  created() {
    this.templateName =
      this.frontend_props?.customTemplateName || this.templateName;
  },
  mounted() {
    this.loading = false;
    console.log('frontTemplate', this.frontTemplate);
    console.log('backTemplate', this.backTemplate);
    console.log('frontend_props', this.frontend_props);

    console.log('templateName', this.templateName);

    this.hasColor =
      (this.frontend_props && this.frontend_props.color) || '#eeeeee';

    console.log('hasColor', this.hasColor);
    // [{ attribute: "File", input: "file", index: 2, cellCount: 1 }];
    // if (this.backTemplate) {
    //   this.createTable(this.backTemplate);
    // }
    this.headersTable =
      this.backTemplate && this.backTemplate.headers
        ? [...this.backTemplate.headers]
        : [];
    this.tableItems = this.getTableItens;

    if (this.tableItems.length == 0 && this.headersTable) {
      this.fillBlank();
    }

    if (this.editable) {
      this.headersTable.push({
        value: 'actions',
        width: 10,
        sortable: false,
      });
    }

    this.cardStyles.fontFamily = this.frontend_props.font
      ? "'" + this.frontend_props.font + "'" + ' !important'
      : null;
  },

  watch: {
    tableValues(value) {
      if (value && value.length > 0) {
        this.tableItems = value;
        this.flipped = true;
      }
    },
  },
  computed: {
    cssVars() {
      return {
        '--nItens': this.tableItems.length + 1,
      };
    },
    maxLengthDesc() {
      return this.templateName == 'keepCodingV1' ? 300 : 44;
    },

    flipCardClass() {
      let className = this.large ? 'large_card ' : ' ';
      className += this.extraLarge ? 'extra-large ' : ' ';
      className += this.templateName;
      return className;
    },
    cardSize() {
      return `height: ${this.height}px; width: ${this.width}px`;
    },

    getTableItens() {
      let tableItens =
        this.backTemplate && this.backTemplate.values
          ? [...this.backTemplate.values]
          : [...this.tableValues];

      if (tableItens.length < 12) {
        let nItens = 12 - tableItens.length;
        let blankItem = { ...tableItens[0] };

        for (let e in blankItem) {
          blankItem[e] = tableItens[0][e];
        }

        for (let index = 0; index < nItens; index++) {
          tableItens.push(blankItem);
        }
      }
      console.log(tableItens);
      return tableItens;
    },
  },
  methods: {
    getValue(field) {
      if (this.templateValues.length > 0) {
        let res = this.templateValues.find((e) => e.attr == field.attr);
        return res && res.value ? res.value : '[' + field.attr + ']';
      }

      return field && field.value;
    },
    deleteItem(item) {
      let editedIndex = this.tableValues.indexOf(item);
      this.$emit('removeItem', editedIndex);
    },

    fillBlank() {
      let el = {};
      this.headersTable.forEach((e) => {
        el[e.value] = '-';
      });
      this.tableItems.push(el);
    },
    reduceText(text, length = 44, clamp = '...') {
      let splitAt = (index) => (x) => [x.slice(0, index), x.slice(index)];
      if (text.length > length) {
        return [splitAt(length)(text)[0] + clamp, text];
      } else {
        return [text];
      }
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
  },
  data() {
    return {
      front: [],
      card: undefined,
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
      templateName: 'defaultTemplate',
      cardStyles: { height: this.height + 'px', width: this.width + 'px' },
    };
  },
};
</script>

<style lang="scss">
.tooltip-desc.v-tooltip__content {
  max-width: 200px;
  background: #f6f6f6;
  p {
    color: #373c43;
    font-size: 10px;
    word-break: break-word;
    line-height: 18px;
    margin-bottom: 0;
  }
}
div.id-card {
  width: 100%;
  margin: 0 auto;
  #card-table.v-data-table {
    background: transparent;
    * {
      box-shadow: none !important;
    }
    > .v-data-table__wrapper > table > thead > tr > th {
      padding-left: 0;
      border: none;
      background: transparent;
      text-transform: uppercase;
      font-size: 11px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: normal;
      color: var(--charcoal-grey);
      height: unset;
      padding: 4px 5px 4px;
    }
    > div.v-data-table__wrapper > table > tbody > tr:hover {
      background: none;
    }

    > .v-data-table__wrapper > table > tbody > tr > td,
    > .v-data-table__wrapper > table > thead > tr > td,
    > .v-data-table__wrapper > table > tfoot > tr > td {
      padding: 5px;
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

  &.extra-large {
    font-size: 24px;
    .signature {
      label.sig {
        text-transform: none;
        font-size: 1.1em;
        line-height: 1.45;
      }
      .name {
        font-size: 1.1em;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.45;
        letter-spacing: normal;
        color: var(--charcoal-grey);
      }
      .role {
        font-size: 1.1em;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.7;
        letter-spacing: normal;
        color: var(--charcoal-grey);
      }
    }
    .logos {
      padding: 8px 6px;

      .v-image {
        margin: 0 auto;
      }
    }
    .v-data-table__wrapper > table th {
      font-size: 1.1em !important;
    }

    .v-data-table__wrapper > table > tbody > tr > td {
      font-size: 0.6em !important;
      padding: 4px 8px;
    }
    .field {
      &.title {
        padding: 2% 0% !important;
        .v-image {
          max-height: 100px;
        }
        * {
          font-size: 1.7em;
        }
      }
      label {
        font-size: 1.1em;
      }
      p {
        margin-top: 6px;
        font-size: 1.4em;
        margin-top: 10px;
        max-height: unset;
      }
    }

    .front {
      .row {
        padding-left: 8% !important;
        padding-right: 6% !important;
      }
    }
  }
  &.large_card {
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
        font-size: 10px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.7;
        letter-spacing: normal;
        color: var(--charcoal-grey);
      }
    }
    .logos {
      padding: 8px 6px;

      .v-image {
        margin: 0 auto;
      }
    }
    .v-data-table__wrapper > table > tbody > tr > td {
      font-size: 14px !important;
    }
    .field {
      &.title {
        .v-image {
          max-height: 100px;
        }
        * {
          font-size: 14px;
        }
      }
      label {
        font-size: 12px;
      }
      p {
        margin-top: 6px;
        font-size: 12px;
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
  .logos {
    padding: 0px 0px;

    .v-image {
      margin: 0 auto;
    }
  }
  .field {
    padding-left: 4px !important;
    padding-right: 4px !important;

    &.title {
      .v-image {
        max-height: 40px;
      }
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
        margin-top: 0;
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
      line-height: 1.75;
      letter-spacing: normal;
      text-align: left;
      color: var(--charcoal-grey);
      word-break: break-word;
      margin-bottom: 0;
      margin-top: 2px;
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
