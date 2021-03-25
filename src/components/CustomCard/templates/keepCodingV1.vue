<template>
  <v-container id="keep-coding-v1" class="px-6 py-2">
    <v-row class="justify-start">
      <v-col
        class="field title pb-1 pt-1 text-center"
        cols="12"
        :style="{ marginTop: '2%' }"
      >
        <v-img
          v-if="urlPhoto"
          class="mx-auto"
          contain
          :max-width="'66%'"
          :src="getPhotoURL"
        />
      </v-col>
    </v-row>
    <v-row
      class="justify-start px-1"
    >
      <v-col
        class="field px-0 py-0"
        :class="large ? ' py-1' : ''"
        :cols="12"
        :sm="12"
      >
        <div class="desc">
          <p>
            {{ $t("cert") }}
          </p>
        </div>
      </v-col>
      <v-col
        class="field px-0 py-1"
        :class="large ? ' py-1' : ''"
        :cols="12"
        :sm="12"
      >
        <div class="name" :id="'outer' + extraLarge">
          <label :id="'output' + extraLarge" :style="{ fontSize: fontSize }">
            {{ getValue(attributes[0]) }}
          </label>
        </div>
      </v-col>
      <v-col
        class="field px-0 py-1"
        :class="large ? ' py-1' : ''"
        :cols="12"
        :sm="12"
      >
        <div class="desc">
          <p>
            {{ getValue(attributes[1]) }}
          </p>
        </div>
      </v-col>
      <v-col
        class="field title pt-1 text-center"
        cols="12"
        :class="large ? 'pb-1' : 'pb-0'"
      >
        <div>
          <label>{{ credentialName }}</label>
        </div>
      </v-col>
      <v-col
        class="field px-0 py-1"
        :class="large ? ' py-1' : ''"
        :cols="12"
        :sm="12"
      >
        <div class="desc">
          <p>
            {{ $t("desc[0]") }}
            {{ getValue(attributes[2]) }}
            {{ $t("desc[1]") }}
            {{ getValue(attributes[3]) }}
          </p>
          <p>
            {{ $t("desc[2]") }}
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
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
    large: {
      default: false,
    },
    extraLarge: {
      default: false,
    },
    getValue: {
      type: Function,
    },
  },

  computed: {
    getPhotoURL() {
      let url = this.urlPhoto;

      if (!url.startsWith("data:image/png;base64")) {
        url += "?transparent=True";
      }
      return url;
    },
    checkAttributes() {
      let arr = [...this.frontTemplate];
      if (arr.length < 4) {
        arr.splice(1, 0, { value: this.$t("success") });
      }
      return arr;
    },
  },
  methods: {
    dynamicFont() {
      let output = document.getElementById("output" + this.extraLarge) || {};
      let outer = document.getElementById("outer" + this.extraLarge) || {};
      this.fontSize = parseFloat(this.fontSize) - 1 + "px";
      if (
        output.clientHeight >= outer.clientHeight &&
        parseFloat(this.fontSize) > 10
      ) {
        this.$nextTick(() => this.dynamicFont());
      }
    },
  },
  i18n: {
    messages: {
      en: {
        cert: "Certifica que:",
        success: "Ha superado con éxito el",
        desc: [
          "Realizado en Madrid desde el",
          "hasta el",
          "Para que conste se expide el siguiente certificado",
        ],
      },
      es: {
        cert: "Certifica que:",
        success: "Ha superado con éxito el",
        desc: [
          "Realizado en Madrid desde el",
          "hasta el",
          "Para que conste se expide el siguiente certificado",
        ],
      },
    },
  },
  data() {
    return { fontSize: 20, attributes: null };
  },
  created() {
    this.attributes = this.checkAttributes;
  },
  mounted() {
    if (this.extraLarge) this.fontSize = "80px";
    this.$nextTick(() => this.dynamicFont());
    console.log("props", this.$props.frontTemplate);
    this.attributes = this.checkAttributes;
  },
};
</script>

<style lang="scss">
#id-card.keepCodingV1.id-card.flip-container {
  * {
    font-family: "Roboto" !important;
  }
  .back {
    #card-table.v-data-table {
      table {
        height: 100%;
      }
      tbody {
        height: 100%;
        tr {
          // height: calc(100 / var(--nItens));
        }
      }
      .v-data-table__wrapper {
        border: black 1px solid !important;
        overflow: hidden;

        tbody tr:last-child {
          td {
            border-bottom: none !important;
          }
        }
        th:not(:last-child),
        td:not(:last-child) {
          border-right: black 1px solid !important;
        }
        th {
          font-size: 6px;
          padding: 1px 4px;
        }
        td {
          font-size: 4px;
          padding: 1px 4px;
        }
        th,
        td {
          border-bottom: black 1px solid !important;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.extra-large {
  #keep-coding-v1.container {
    .name {
      height: 80px;
      padding: 20px 0 0 0;
      margin-bottom: 32px;
    }
  }
}
#keep-coding-v1.container {
  .field {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .name {
    margin: auto 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
    height: 25px;
    user-select: none;
    -webkit-user-select: none;
    font-size: 8vw;
    text-align: center;
    border-bottom: #1d1d1b 1px solid;
    label {
      max-width: 100%;

      font-size: 30px;
      font-size: 3vw;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: -0.2px;
      color: #303031;
      text-align: center;
      text-transform: capitalize;
    }
  }
  .desc p {
    text-align: center;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #1d1d1b;
  }
}
</style>
