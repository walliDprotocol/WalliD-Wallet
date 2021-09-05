<template>
  <v-container class="card-view pa-5">
    <v-row>
      <v-col cols="12" class="pt-1">
        <div class="back-arrow mb-3">
          <v-btn text @click="$router.push('/home')" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1 text-left">
            {{ card.caName }}
            {{ card.credName }}
          </h2>
        </div>
      </v-col>
    </v-row>
    <v-row class="">
      <v-col
        v-if="customTemplateName == 'templateEditor'"
        cols="12"
        class="pt-0 pb-2"
        style="text-align: initial"
      >
        <ShowCredentialImages
          :imgArray="imgArray"
          :currentLayout="frontend_props.currentLayout"
          :width="360"
          :height="265"
        />
      </v-col>
      <v-col v-else cols="12" class="pt-0 pb-2" style="text-align: initial">
        <CustomCard
          v-if="!loading"
          :frontTemplate="templateValues"
          :backTemplate="userData.table"
          :caName="card.caName"
          :credentialName="card.credName"
          :urlPhoto="photoCred"
          :frontend_props="frontend_props"
        />
      </v-col>
      <v-col cols="12">
        <v-tooltip
          :disabled="card.status == 'active'"
          content-class="wallet-tooltip credential"
          bottom
        >
          <template v-slot:activator="{ on }">
            <div v-on="on">
              <v-btn
                text
                @click="proofPage"
                :disabled="card.status != 'active'"
                class="advance-btn "
              >
                {{ $t('credentials.menu[1]') }}
              </v-btn>
            </div>
          </template>
          <div class="arrow-seed-tooltip"></div>
          <div class="tooltip-credential">
            <p>
              {{ card.caName }}
              {{ $t('credentials.tooltip') }}
            </p>
          </div>
        </v-tooltip>
      </v-col>

      <v-col cols="12">
        <a
          class="download-button"
          :class="{ disabled: !downloadURL }"
          :href="downloadURL"
          target="_blank"
          style="text-decoration:none"
        >
          <v-btn :disabled="!downloadURL" text class="advance-btn">
            {{ $t('credentials.menu[2]') }}
          </v-btn>
        </a>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import WalletAddress from '../components/WalletAddress';
import WalletState from '../components/WalletState';
import ArrowBack from '../images/icon-arrow-back.vue';

import CustomCard from '../components/CustomCard';

import ShowCredentialImages from '../components/ShowCredentialImages';

import { mapGetters } from 'vuex';
const FILESTACK = 'https://www.filestackapi.com/api/file/';

const WALLID_DOMAINS = [
  'https://demo.mycredentials.wallid.io',
  'http://localhost',
];

const PDF_URL = 'https://mycredentials.wallid.io/ViewCredential/';

export default {
  components: {
    WalletAddress,
    WalletState,
    ArrowBack,
    CustomCard,
    ShowCredentialImages,
  },
  methods: {
    proofPage() {
      this.$store.commit('setCurrentCred', this.card);

      this.$router.push({ name: 'SHARE_PROFILE_VIEW' });

      // this.$router.push({
      //   name: 'Proof',
      //   params: { card: this.currentCred },
      // });
    },
  },
  beforeDestroy() {
    // this.$store.commit('setCurrentCred', null);
  },
  created() {
    console.log('card', this.currentCred);
    this.card = JSON.parse(JSON.stringify(this.currentCred));
    this.frontend_props = this.card.userData.frontend_props;

    this.customTemplateName =
      this.card.userData.frontend_props &&
      this.card.userData.frontend_props.customTemplateName;

    console.log(this.customTemplateName);

    this.imgArray = [...this.card.userData.imgArray];
    if (
      this.card.userData.img_url &&
      !this.card.userData.img_url.startsWith('https')
    ) {
      this.photoCred = FILESTACK + this.card.userData.img_url;
    } else {
      this.photoCred = this.card.userData.img_url;
    }
  },
  mounted() {
    if (this.card.userData.userData) {
      this.userData = this.card.userData.userData;
    } else {
      let userData = { front: [], table: {} };
      if (this.card.userData.user_data.tables) {
        userData.table = JSON.parse(
          JSON.stringify(this.card.userData.user_data.tables)
        );
        delete this.card.userData.user_data.tables;
      }
      if (this.card.userData.template_itens)
        for (
          let index = 0;
          index < this.card.userData.template_itens.length;
          index++
        ) {
          const el = this.card.userData.template_itens[index];
          if (this.card.userData.user_data[el.attr] && el.order > -1) {
            this.templateValues[el.order] = {
              attr: el.attr,
              value: this.card.userData.user_data[el.attr],
            };
          } else if (this.card.userData.user_data[el.attr]) {
            this.templateValues.push({
              attr: el.attr,
              value: this.card.userData.user_data[el.attr],
            });
          }
        }
      else
        for (var a in this.card.userData.user_data) {
          var val = this.card.userData.user_data[a];
          this.templateValues.push({ attr: a, value: val });
        }
      this.userData = userData; // this.card.userData.user_data;
      this.loading = false;
    }
  },
  computed: {
    ...mapGetters(['address', 'currentCred']),

    downloadURL() {
      // if (
      //   this.connected &&
      //   new RegExp(WALLID_DOMAINS.join("|")).test(this.connected.url)
      // ) {
      // At least one match

      if (this.isNFT(this.card)) {
        return (
          this.card && this.card.userData && this.card.userData.imgArray[0]
        );
      }
      return PDF_URL + this.card.id;
      // }
      // return this.card.userData.pdf_url;
    },
  },
  data() {
    return {
      card: undefined,
      userData: null,
      frontend_props: null,
      photoCred: null,
      templateValues: [],
      loading: true,
      customTemplateName: null,
      imgArray: [],
    };
  },
};
</script>

<style lang="scss">
.credential-img {
  border-radius: 14px;
}
.download-button {
  &.disabled {
    cursor: default;
  }
}
#metamask-logo-details {
  max-height: 83px;
  max-width: 83px;

  border-radius: 50%;
  border: solid 2px #b8b9bb;
  margin: auto;
  margin-top: -35px;
}

.card-view {
  .back-btn.v-btn {
    height: 26px !important;
  }
}
</style>
