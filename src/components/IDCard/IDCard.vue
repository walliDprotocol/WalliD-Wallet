<template>
  <FlipCard
    class="id-card mb-4"
    v-if="!loading"
    :hasBack="card.back"
    :isForeign="!cardInfo.idt.includes('_PT')"
  >
    <template slot="front">
      <v-container class="px-5">
        <v-tooltip bottom content-class="view-id-popover">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              :ripple="false"
              height="38"
              text
              v-bind="attrs"
              v-on="on"
              v-on:click="unlockData()"
              v-if="!unlocked"
              class="tooltip-unlock"
            >
              <div class="unlock">
                <IconShow />
              </div>
            </v-btn>
          </template>
          <div class="view-id-popover">
            <span class="arrow" />
            <p>{{ $t('cards.tooltip') }}</p>
          </div>
        </v-tooltip>

        <v-row class="justify-space-between">
          <v-col class="field pb-1 pt-2px" cols="10">
            <div :style="idCardStyle(card.idt)">
              <label>{{ card.idtName.label[$i18n.locale] }}</label>
              <p>
                {{ card.idtName.value }}{{ card.idtName.type[$i18n.locale] }}
              </p>
            </div>
          </v-col>
          <v-col
            v-for="(field, name, index) in card.front"
            v-bind:key="index"
            class="field py-1"
            :cols="calcCols(card.idt, name)"
            :sm="calcCols(card.idt, name)"
          >
            <div :style="idCardStyle(card.idt, name)">
              <label>{{ field.label[$i18n.locale] }}</label>
              <p>{{ field.value | truncate(15, '...') }}</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template slot="back">
      <v-container class="px-5">
        <v-row class="justify-space-between">
          <v-col
            v-for="(field, name, index) in card.back"
            v-bind:key="index"
            class="field py-1"
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
import FlipCard from './FlipCard';
import IconShow from '../../images/icon-show';

import { DECRYPT } from '../../store/actions';
import * as WallidConst from '../../scripts/const';

const HIDDEN = '*****';

export default {
  name: 'IDCard',
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
  mounted() {
    this.unlockData();
  },
  methods: {
    getCMDValues({ idt, decryptedObj, data }) {
      console.log('getCMDValues', decryptedObj);
      let fields = {};
      let side = 'front';
      fields[side] = {};
      fields.idt = idt;
      fields.idtName = {
        label: { pt: 'Tipo de documento ID', en: 'ID document type' },
        value: this.cardInfo.idtName || HIDDEN,
      };
      fields.idtName.type = '';

      Object.keys(WallidConst.UC_CMD_PT_LABELS).forEach((label) => {
        if (label === 'telephone') {
          fields[side][label] = {
            label: WallidConst.UC_CMD_PT_LABELS[label],
            value: data[label] || HIDDEN,
          };
        } else {
          fields[side][label] = {
            label: WallidConst.UC_CMD_PT_LABELS[label],
            value: decryptedObj[label] || HIDDEN,
          };
        }
      });

      return fields;
    },
    getCCValues: ({ idt, obj, unlocked }) => {
      console.log('getCCValues', obj);
      console.log(idt);
      let fields = {};
      let side = 'front';
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
        label: { pt: 'Tipo de documento ID', en: 'ID document type' },
        value: obj.dataID.data.idtName || HIDDEN,
      };
      fields.idtName.value = fields.idtName.value.replace('ShuftiPro', '');

      //   if (idt == WallidConst.CC_PT && unlocked) {
      //     fields.idtName.type = {
      //       pt: " - Documento ID Qualificado",
      //       en: " - Qualified Document ID",
      //     };
      //   } else {
      fields.idtName.type = '';
      //   }
      let _idt = idt.substring(0, 10);
      let country = idt.substring(10, 12);

      switch (_idt) {
        case WallidConst.CC_PT:
          Object.keys(WallidConst.CC_PT_LABELS).forEach((label) => {
            if (label == 'PARENTS') {
              side = 'back';
              fields[side] = {};
              let id = obj.dataID.data.identityID.identityAttributes || HIDDEN;
              fields[side][label] = {
                label: WallidConst.CC_PT_LABELS[label],
                value:
                  (id.GivenNameFather || HIDDEN) +
                  ' ' +
                  (id.SurnameFather || HIDDEN) +
                  ' * ' +
                  (id.GivenNameMother || HIDDEN) +
                  ' ' +
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
              label: WallidConst.CARD_CONST['Entity'],
              value:
                obj.dataID.data.identityID.identityAttributes.IssuingEntity,
            },
            attributes: {
              label: WallidConst.CARD_CONST['Attributes'],
              value: { en: 'Identity', pt: 'Identidade' },
            },
            certificate: {
              label: WallidConst.CARD_CONST['Certificate'],
              value: 'x509',
            },
          };
          break;

        case WallidConst.SHUFTI_CC:
          Object.keys(WallidConst.SHUFTI_ID_LABELS).forEach((label) => {
            if (label == 'parents_name') {
              side = 'back';
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
              label: WallidConst.CARD_CONST['Attributes'],
              value: { en: 'Identity', pt: 'Identidade' },
            },
            certificate: {
              label: WallidConst.CARD_CONST['Certificate'],
              value: 'x509',
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

      if (country == 'FR') {
        delete fields.back;
      }

      console.log(fields);

      return fields;
    },
    unlockData() {
      console.log('unlockData', this.cardInfo);
      this.loading = true;

      const dataIdEncrypted =
        this.cardInfo.idt === this.UC_CMD_PT
          ? this.cardInfo.data.dataIdEncrypted
          : this.cardInfo.data;

      this.$store
        .dispatch(DECRYPT, { data: dataIdEncrypted })
        .then((res) => {
          if (this.cardInfo.idt !== this.UC_CMD_PT) {
            this.card = this.getCCValues({
              idt: this.cardInfo.idt,
              obj: JSON.parse(res),
              unlocked: true,
            });
          } else {
            this.card = this.getCMDValues({
              idt: this.cardInfo.idt,
              data: this.cardInfo.data,
              decryptedObj: JSON.parse(res),
              unlocked: true,
            });
          }
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
        case 'CMD_PT':
          return name == 'Name' ? 12 : 6;
        case 'CC_PT':
          return name == 'Surname'
            ? 7
            : name == 'PARENTS'
            ? 12
            : name == 'Sex' ||
              name == 'Height' ||
              name == 'Country' ||
              name == 'Birthdate' ||
              name == 'Givenname'
            ? 3
            : name == 'CivilianIdNumber' || name == 'Validityenddate'
            ? 6
            : name == 'NISS'
            ? 5
            : undefined;

        case 'SHUFTI_CC_':
          return name == 'last_name'
            ? 7
            : name == 'parents_name'
            ? 12
            : name == 'expiry_date'
            ? 4
            : 4;
      }
    },
    idCardStyle(idt, name) {
      switch (idt) {
        case 'UC_CMD_PT':
        case 'CMD_PT':
          return 'padding: 12px';
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
    right: 18px;
    display: inline-block;
    border: none;
    border-radius: 50%;
    min-width: unset !important;
    max-width: 38px;
  }
  .field {
    padding-right: 0 !important;
    & > div {
      text-align: left;
    }
    label {
      font-size: 11px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2.25;
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
      line-height: 2.05;
      letter-spacing: normal;
      text-align: left;
      color: var(--charcoal-grey);
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
