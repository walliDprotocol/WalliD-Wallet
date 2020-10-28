<template>
  <FlipCard
    class="id-card mb-4"
    :hasBack="card.back"
    :isForeign="cardInfo.idt.startsWith('SHUFTI')"
    v-if="!loading"
  >
    <template slot="front">
      <v-container>
        <v-tooltip bottom content-class="view-id-popover">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              :ripple="false"
              height="58"
              text
              v-bind="attrs"
              v-on="on"
              v-on:click="unlockData()"
              :disable="!card.locked"
              class="tooltip-unlock"
              :style="!card.locked ? 'margin-right:40px' : ''"
            >
              <div class="unlock">
                <IconShow />
              </div>
            </v-btn>
          </template>
          <div class="view-id-popover">
            <span class="arrow" />
            <p>{{ $t("view.tooltip") }}</p>
          </div>
        </v-tooltip>

        <v-row class="justify-space-between">
          <v-col class="field py-1" cols="12" sm="10">
            <div style="width:250px" :style="idCardStyle(card.idt)">
              <label>{{ card.idtName.label[$i18n.locale] }}</label>
              <p>
                {{ card.idtName.value }}{{ card.idtName.type[$i18n.locale] }}
              </p>
            </div>
          </v-col>
          <v-col
            v-for="(field, name, index) in card.front"
            v-bind:key="index"
            class="field py-0"
            :cols="calcCols(card.idt, name)"
            :sm="calcCols(card.idt, name)"
          >
            <div :style="idCardStyle(card.idt, name)">
              <label>{{ field.label[$i18n.locale] }}</label>
              <p>{{ field.value }}</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template slot="back">
      <v-container>
        <v-row class="justify-space-between">
          <v-col
            v-for="(field, name, index) in card.back"
            v-bind:key="index"
            class="field py-0"
            :cols="calcCols(card.idt, name)"
            :sm="calcCols(card.idt, name)"
          >
            <div :style="idCardStyle(card.idt, name)">
              <label>{{ field.label[$i18n.locale] }}</label>
              <p>{{ field.value }}</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </FlipCard>
</template>

<script>
import FlipCard from "./FlipCard";
import IconShow from "../../images/icon-show";

import { DECRYPT } from "../../store/actions";
import * as WallidConst from "../../scripts/const";

const HIDDEN = "*****";

export default {
  name: "IDCard",
  components: {
    FlipCard,
    IconShow,
  },
  props: {
    cardInfo: {
      required: true,
    },
  },
  created() {
    this.card = this.getCCValues({
      idt: this.cardInfo.idt,
    });
    this.loading = false;
  },
  methods: {
    getCCValues: ({ idt, obj }) => {
      console.log(obj);
      let fields = {};
      let side = "front";
      fields[side] = {};
      fields.idt = idt;
      if (obj == undefined) {
        obj = {};
        obj.dataID = {};
        obj.dataID.data = {};
        obj.dataID.data.identityID = {};
        obj.dataID.data.identityID.identityAttributes = {};
      }
      // fields.idtName = {
      //   label: { pt: "Tipo de documento ID", en: "ID document type" },
      //   value: obj.dataID.data.idtName || HIDDEN,
      // };
      fields.idtName = {
        label: { pt: "Tipo de documento ID", en: "ID document type" },
        value: obj.dataID.data.idtName || HIDDEN,
      };
      fields.idtName.value = fields.idtName.value.replace("ShuftiPro", "");

      if (idt == WallidConst.CC_PT) {
        fields.idtName.type = {
          pt: " - Documento ID Qualificado",
          en: " - Qualified Document ID",
        };
      } else {
        fields.idtName.type = "";
      }
      let _idt = idt.substring(0, 10);
      let country = idt.substring(10, 12);

      switch (_idt) {
        case WallidConst.CC_PT:
          Object.keys(WallidConst.CC_PT_LABELS).forEach((label) => {
            if (label == "PARENTS") {
              side = "back";
              fields[side] = {};
              let id = obj.dataID.data.identityID.identityAttributes || HIDDEN;
              fields[side][label] = {
                label: WallidConst.CC_PT_LABELS[label],
                value:
                  (id.GivenNameFather || HIDDEN) +
                  " " +
                  (id.SurnameFather || HIDDEN) +
                  " * " +
                  (id.GivenNameMother || HIDDEN) +
                  " " +
                  (id.SurnameMother || HIDDEN),
              };
            } else {
              fields[side][label] = {
                label: WallidConst.CC_PT_LABELS[label],
                value:
                  obj.dataID.data.identityID.identityAttributes[label] ||
                  HIDDEN,
              };
            }
          });
          fields.more = {
            entity: {
              label: WallidConst.CARD_CONST["Entity"],
              value:
                obj.dataID.data.identityID.identityAttributes.IssuingEntity,
            },
            attributes: {
              label: WallidConst.CARD_CONST["Attributes"],
              value: { en: "Identity", pt: "Identidade" },
            },
            certificate: {
              label: WallidConst.CARD_CONST["Certificate"],
              value: "x509",
            },
          };
          break;

        case WallidConst.SHUFTI_CC:
          Object.keys(WallidConst.SHUFTI_ID_LABELS).forEach((label) => {
            if (label == "parents_name") {
              side = "back";
              fields[side] = {};
            }

            console.log(label);

            let value = obj.dataID.data.identityID.identityAttributes[label];
            if (!value && unlocked) {
              return;
            } else {
              fields[side][label] = {
                label: WallidConst.SHUFTI_ID_LABELS[label],
                value: value || HIDDEN,
              };
              return;
            }
          });

          fields.more = {
            // entity: {
            //     label: WallidConst.CC_PT_LABELS["Entity"],
            //     value: obj.dataID.data.identityID.identityAttributes.IssuingEntity
            // },
            attributes: {
              label: WallidConst.CARD_CONST["Attributes"],
              value: { en: "Identity", pt: "Identidade" },
            },
            certificate: {
              label: WallidConst.CARD_CONST["Certificate"],
              value: "x509",
            },
          };

          break;

        case WallidConst.CMD_PT:
          Object.keys(WallidConst.CMD_PT_LABELS).forEach((label) => {
            fields[side][label] = {
              label: WallidConst.CMD_PT_LABELS[label],
              value:
                obj.dataID.data.identityID.identityAttributes[label] || HIDDEN,
            };
          });

          break;

        default:
          break;
      }

      if (country == "FR") {
        delete fields.back;
      }

      console.log(fields);

      return fields;
    },
    unlockData() {
      console.log(this.cardInfo);
      this.loading = true;

      this.$store
        .dispatch(DECRYPT, { data: this.cardInfo.data })
        .then((res) => {
          this.card = this.getCCValues({
            idt: this.cardInfo.idt,
            obj: JSON.parse(res),
          });
          this.loading = false;
          this.unlocked = true;
        })
        .catch((e) => {
          this.logError(e);
        });
    },

    calcCols(idt, name) {
      let _idt = idt.substring(0, 10);

      switch (_idt) {
        case "CMD_PT":
          return name == "Name" ? 12 : 6;
        case "CC_PT":
          return name == "Surname"
            ? 7
            : name == "PARENTS"
            ? 12
            : name == "Sex" ||
              name == "Height" ||
              name == "Country" ||
              name == "Birthdate" ||
              name == "Givenname"
            ? 3
            : name == "CivilianIdNumber" || name == "Validityenddate"
            ? 6
            : 4;

        case "SHUFTI_CC_":
          return name == "last_name"
            ? 7
            : name == "parents_name"
            ? 12
            : name == "expiry_date"
            ? 4
            : 4;
      }
    },
    idCardStyle(idt, name) {
      switch (idt) {
        case "CMD_PT":
          return "padding: 12px";
      }
    },
  },
  data() {
    return {
      card: undefined,
      loading: true,
      unlocked: false,
    };
  },
};
</script>

<style lang="scss">
.id-card {
  .tooltip-unlock {
    position: absolute;
    top: 15px;
    right: 10px;
    display: inline-block;
    border: none;
  }
  .field {
      & > div  {
          text-align: left;
      }
    label {
      font-size: 11px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2.45;
      letter-spacing: normal;
      text-align: left;
      color: var(--charcoal-grey);
      display: block;
    }
    p {
      font-size: 12px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 2.25;
      letter-spacing: normal;
      text-align: left;
      color: var(--charcoal-grey);
    }
  }
}
</style>
