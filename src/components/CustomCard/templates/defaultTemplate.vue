<template>
  <v-container class="px-6 py-2">
    <v-row class="justify-start">
      <v-col class="field title pb-1 pt-1 text-center" cols="12">
        <v-img
          v-if="urlPhoto"
          class="mx-auto"
          contain
          :max-width="'66%'"
          :src="urlPhoto"
        />
      </v-col>
      <v-col
        class="field title pt-1 text-center"
        cols="12"
        :class="large ? 'pb-4' : 'pb-1'"
      >
        <div>
          <label>{{ credentialName }}</label>
          <p>
            {{ caName }}
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row
      class="justify-start"
      :class="{
        'pl-8': frontTemplate.length == 4 && large,
        'pl-1': frontTemplate.length > 4,
      }"
    >
      <v-col
        v-for="(field, index) in front"
        v-bind:key="index"
        class="field pa-2 pr-1"
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
          <p>{{ getValue(field, index) }}</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const MAX_FIELDS = 6;
const FILESTACK = "https://www.filestackapi.com/api/file/";

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
    getValue: {
      type: Function,
    },
  },

  watch: {
    frontTemplate(value = []) {
      this.createCard(value);
    },
  },
  mounted() {
    this.logos =
      this.frontend_props && this.frontend_props.logos
        ? this.frontend_props.logos.map((e) => {
            if (e.file || e.url.startsWith("https")) {
              return { url: e.url };
            } else return { url: FILESTACK + e.url };
          })
        : [];
    this.sigs =
      this.frontend_props && this.frontend_props.sigs
        ? this.frontend_props.sigs.slice()
        : [];

    console.log("sigs", this.sigs);
    console.log("logos", this.logos);
    console.log("templateValues", this.templateValues);

    this.$log.debug("createCard mounted hook");

    this.createCard(this.frontTemplate);
  },
  methods: {
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
      if (this.frontTemplate.length < 3 && this.logos.length > 1) {
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
      } else if (this.frontTemplate.length < 4 && this.logos.length > 1) {
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
        this.logos.length > 1
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
    },
    calcCols(side, type) {
      switch (true) {
        // case type == "attribute" && this.frontTemplate.length >= 5:
        //   return 4;
        // case type == "signature" && this.frontTemplate.length >= 5:
        //   return 4;
        case type == "logos" && this.frontTemplate.length <= 2:
        case (type == "logos" || type == "blank") &&
          this.frontTemplate.length == 4:
        case type == "logos" || type == "blank":
          return 2;

        case type == "signature" && this.frontTemplate.length <= 2:
        case type == "attribute" && this.frontTemplate.length <= 2:
        case this.frontTemplate.length == 4 && this.logos.length > 1:
        case (type == "signature" || type == "attribute") &&
          this.logos.length > 1:
          return 5;

        case type == "attribute" &&
          this.frontTemplate.length <= 6 &&
          this.logos.length > 1:
        case type == "signature" && this.frontTemplate.length <= 6:
          return 4;

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
        case type == "attribute" &&
          this.logos.length == 0 &&
          this.sigs.length == 0 &&
          this.frontTemplate.length > 4:
          return "padding: 14px 0px; padding-bottom:0";
        case type == "attribute" &&
          this.logos.length == 0 &&
          this.sigs.length == 0 &&
          this.frontTemplate.length == 4 &&
          this.large:
          return "padding: 22px 0 0 22px";
        case type == "attribute" &&
          this.logos.length == 0 &&
          this.sigs.length == 0 &&
          this.frontTemplate.length == 4:
          return "padding: 14px 0 0 22px";
        case type == "logos" && this.frontTemplate.length < 3 && this.large:
          return "padding: 18px 6px;";
        case type != "logos" && this.frontTemplate.length < 3 && this.large:
          return "padding: 18px 6px; padding-left:20px ";
        case type == "attribute" &&
          this.frontTemplate.length <= 3 &&
          this.large:
          return "padding: 18px 6px";
        case type == "attribute" &&
          this.logos.length == 0 &&
          this.sigs.length == 0:
          return "padding: 10px 24px";
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
      front: [],
    };
  },
};
</script>

<style></style>
