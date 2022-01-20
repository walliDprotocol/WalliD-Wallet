<template>
  <v-app class="plugin-request">
    <v-app-bar height="74" flat app class="plugin-header">
      <v-img
        height="50"
        max-width="50"
        contain
        src="../images/logos/logo-wallid.png"
      />
      <h1 v-if="!success" class="T2 ml-5">
        {{ $t('request.' + type + '.title') }}
      </h1>
      <h1 v-else class="T2 ml-5">{{ $t('request.' + type + '.success') }}</h1>

      <div class="arrow-down-header"></div>
    </v-app-bar>

    <v-container class="request">
      <v-row
        v-show="!success"
        class="justify-space-around mt-2px"
        style="height:500px"
      >
        <v-row
          v-if="request.type == 'wallid_connect'"
          class="justify-space-around align-content-start mt-2px"
        >
          <v-col cols="8" class="pt-5 pb-0">
            <h2 class="sub-title-fields">
              <b> {{ websiteData.name }}</b>
              {{ $t('request.description') }}
            </h2>
          </v-col>
          <v-col cols="8" class="">
            <ul class="request-list-permissions text-center">
              <li class="sub-title-fields text-center">
                {{ $t('request.' + request.type + '.description') }}
              </li>
            </ul>
          </v-col>
        </v-row>

        <!-- website info and wallet -->
        <v-col cols="4" class="pr-1 pt-4 mr-n14 text-center">
          <WebSiteLogo
            :size="58"
            :imageURL="websiteData.icon"
            :name="websiteData.name"
          />
        </v-col>

        <v-col cols="4" class="px-0  mx-n7">
          <v-divider class="dashed" />
        </v-col>

        <v-col cols="4" class="pl-1 pt-4 ml-n14 text-center">
          <jazz-icon
            :address="address"
            :id="'request'"
            :size="50"
            :margin="2"
          />
          <p class="FIELD-TEXT">{{ walletAddress | truncate(8, '...') }}</p>
        </v-col>

        <v-row
          v-if="request.type !== 'wallid_connect'"
          class="justify-space-around align-content-start mt-2px"
        >
          <v-col cols="8" class="pt-5 pb-0">
            <h2 class="sub-title-fields">
              <b> {{ websiteData.name }}</b>
              {{ $t('request.description') }}
            </h2>
          </v-col>
          <v-col cols="7" class="">
            <ul class="request-list-permissions text-center">
              <li class="sub-title-fields text-center">
                {{ $t('request.' + request.type + '.description') }}
              </li>
            </ul>
          </v-col>
        </v-row>

        <v-row
          v-if="request.type !== 'wallid_connect'"
          class="justify-center align-content-start mt-2px"
        >
          <v-col cols="8" class="text-left d-flex pb-0 px-0">
            <label class="SECUNDARY-LINKS">
              {{ $t('request.currentLevel') }}
            </label>
          </v-col>
          <v-col
            cols="6"
            class=" d-flex pb-2 px-0"
            style="border-bottom: solid 1px #eee;"
          >
            <p
              class="SECUNDARY-LINKS text-left"
              v-html="getCurrentLevel.label"
            ></p>
            <v-tooltip bottom :content-class="'connection-level-tooltip'">
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on" class="d-flex align-center ml-2">
                  <TooltipIcon />
                </span>
              </template>
              <span>
                {{ getCurrentLevel.tooltip }}
              </span>
            </v-tooltip>
          </v-col>
          <v-col
            cols="2"
            class="justify-end d-flex pb-2 px-0"
            style="border-bottom: solid 1px #eee;"
          >
            <a
              @click="edit()"
              class="WARNING-NOTES-1 text-right text-decoration-none"
            >
              {{ $t('request.edit') }}
            </a>
          </v-col>
        </v-row>

        <v-col
          v-if="type == 'wallid_connect'"
          cols="10"
          class="px-4 direction-column"
        >
          <p class="FIELD-TEXT text-left">
            {{ $t('request.wallid_connect.permissions') }}
          </p>

          <v-radio-group class="levels-radio-group" v-model="permissionLevel">
            <v-radio
              v-for="l in $t('request.wallid_connect.levels')"
              :key="l.level"
              :value="l.level"
            >
              <template #label>
                <p class="mr-1" v-html="l.label"></p>

                <v-tooltip bottom :content-class="'connection-level-tooltip'">
                  <template v-slot:activator="{ on, attrs }">
                    <div class="d-flex" v-bind="attrs" v-on="on">
                      <TooltipIcon />
                    </div>
                  </template>
                  <span>
                    {{ l.tooltip }}
                  </span>
                </v-tooltip>
              </template>
            </v-radio>
          </v-radio-group>
        </v-col>

        <!-- Option buttons -->
        <v-col v-show="!success" cols="6" class="pr-2 pb-0" align-self="end">
          <v-btn text class="cancel-btn" @click="cancel">
            {{ $t('request.cancel') }}
          </v-btn>
        </v-col>
        <v-col v-show="!success" cols="6" class="pl-2 pb-0" align-self="end">
          <v-btn
            text
            class="advance-btn"
            :disabled="disableButtonRequest"
            @click="authorizeRequest(12)"
          >
            {{ $t('request.' + type + '.button') }}
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-show="success" class="justify-space-around connected mt-2px">
        <v-col cols="12" class="my-3 py-7 px-14">
          <div class="back-arrow">
            <h2 class="sub-title-fields">
              <b> {{ websiteData.name }}</b>
              {{ $t('request.' + type + '.successText') }}
            </h2>
          </div>
        </v-col>

        <!-- website info and wallet -->
        <v-col cols="4" class="pr-0 pt-4">
          <WebSiteLogo
            :size="58"
            :imageURL="websiteData.icon"
            :name="websiteData.name"
          />
        </v-col>

        <v-col cols="4" class="px-0 pt-4 check">
          <v-divider class="dashed" />
          <CheckSuccessIcon />
          <v-divider class="dashed" />
        </v-col>

        <v-col cols="4" class="pl-0 pt-4">
          <jazz-icon
            :address="address"
            :id="'request-2'"
            :size="62"
            :margin="3"
          />
          <p class="FIELD-TEXT">{{ walletAddress | truncate(8, '...') }}</p>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import WarningIcon from '../images/icon-warning-blue';
import TooltipIcon from '../images/icons/icon-tooltip';

import BrokenLine from '../images/broken-line';
import CheckSuccessIcon from '../images/icon-sucessfully';
import WebSiteLogo from '../components/WebSiteLogo';

import {
  CANCEL_REQUEST,
  AUTHORIZE_REQUEST,
  ACCESS_LEVEL,
  GET_ACCESS_LEVEL,
  CONNECT,
  IMPORT,
  UPDATE_CONNECTED,
  ADDRESS,
} from '../store/actions';
import { mapGetters } from 'vuex';

export default {
  components: {
    CheckSuccessIcon,
    WarningIcon,
    BrokenLine,
    WebSiteLogo,
    TooltipIcon,
  },
  computed: {
    ...mapGetters(['address', 'credentials', 'connections']),
    getCurrentLevel() {
      console.log(this.currentLevel);
      return (
        this.$t('request.wallid_connect.levels')[this.currentLevel - 1] || {}
      );
    },
  },
  watch: {},
  mounted() {
    // this.debug('Request: ', this.request);
    this.walletAddress = this.address; //this.checksumAddress
  },
  async created() {
    this.debug('Address: ', this.address);
    this.debug('Request: ', this.request);
    this.debug('Request origin: ', this.request.origin);

    this.type = this.request.type;
    this.debug('Request type: ', this.type);
    this.websiteData = this.getWebsiteInfo(this.request.origin);

    // Get current access level to requesting webiste
    this.currentLevel = await this.$store.dispatch(GET_ACCESS_LEVEL, {
      url: this.request.origin,
    });
    console.log('currentLevel', this.currentLevel);

    switch (this.type) {
      case 'wallet_sign':
      case 'wallet_sign_erc191':
      case 'wallet_ec_sign':
        break;
      case 'wallid_open':
        this.findCredential(this.request.data);
        this.updateConnected(this.request.origin);
        break;
      case 'wallid_connect':
        // Rework this: is this realy needed??
        this.$store
          .dispatch(ACCESS_LEVEL, {
            url: this.request.origin,
            level: this.request.level,
          })
          .then((hasAccess) => {
            this.debug('hasAccess', hasAccess);
            if (hasAccess) {
              Promise.resolve(
                this.request.callback(null, 'ALREADY_CONNECTED')
              ).then(() => window.close());
            }
          });
        break;
      case 'wallid_disconnect':
        console.error('Invalid Request Type');
        break;
      case 'wallid_address':
      case 'wallid_import_sign':
      case 'wallid_import_cred':
      case 'wallid_token':
        var params;
        params = {
          origin: this.request.origin,
          icon: this.request.origin + '/favicon.ico',
          name: this.getDomain(this.request.origin),
        };
        this.$store
          .dispatch(ACCESS_LEVEL, { url: this.request.origin, level: 1 })
          .then((hasAccess) => {
            this.debug('hasAccess', hasAccess, params);
            if (!hasAccess) {
              this.$store.dispatch(CONNECT, { params }).then(() => {
                this.debug('Connected');
                this.authorizeRequest(0);
              });
            } else {
              this.authorizeRequest(0);
            }
          });
        break;
      default:
        console.log('Invalid Request Type');
        break;
    }
  },
  props: {
    request: {
      required: true,
    },
  },
  methods: {
    edit() {
      this.$router.push({
        name: 'sites',
        params: { toEditSite: this.websiteData.url },
      });
    },
    updateConnected(site) {
      if (this.connections) {
        let connectedSite = this.connections.find((e) => {
          return this.getDomain(e.url) == this.getDomain(site) ? e : '';
        });
        this.debug('connectedSite site: ', connectedSite);
        if (connectedSite) {
          this.$store.commit('updateConnected', connectedSite);
        }
      }
    },
    findCredential(id) {
      console.log('findCredential', id);
      let cred = this.credentials.find((cred) => {
        if (cred.id == id) {
          return cred;
        }
      });
      console.log('Credential', cred);

      if (cred) {
        this.$store.commit('clearPendingRequests');
        this.$store.commit('setCurrentCred', cred);
        this.$router.push({ name: 'Credential' });
      } else {
        this.authorizeRequest(0);
      }
    },
    getWebsiteInfo(origin) {
      let name = origin.split('//')[1].split('/')[0];
      let icon = origin + '/favicon.ico';
      return { name: name, icon: icon, url: origin };
    },

    authorizeRequest(time = 30) {
      this.disableButtonRequest = true;

      if (this.request.type == 'wallid_connect') {
        this.request.data.level = this.permissionLevel;
      }
      this.$store
        .dispatch(AUTHORIZE_REQUEST, {
          data: this.request.data,
          type: this.request.type,
          callback: this.request.callback,
          origin: this.request.origin,
          name: this.websiteData.name,
        })
        .then((res) => {
          if (this.request.type == 'wallid_connect') this.success = true;
          if (
            this.request.type != 'wallid_import_cred' &&
            this.request.type != 'wallid_import_sign' &&
            this.request.type != 'wallid_open'
          ) {
            // setTimeout(() => {
            //   this.$notification ? window.close() : this.$router.push('/home');
            // }, time * 100);
            console.log('authorizeRequest res:', res);
          } else {
            this.$router.push('/home');
          }
        })
        .catch((err) => console.error(err));
    },
    cancel() {
      this.$store
        .dispatch(CANCEL_REQUEST, {
          params: this.request.data,
          type: this.request.type,
          callback: this.request.callback,
          notification: this.$notification,
        })
        .then(() => {
          setTimeout(() => {
            this.$notification ? window.close() : this.$router.push('/home');
          }, 5 * 100);
        });
    },
  },
  data() {
    return {
      disableButtonRequest: false,
      walletAddress: '',
      type: '',
      success: false,
      websiteData: { name: '', icon: '' },
      permissionLevel: 1,
      currentLevel: -1,
    };
  },
};
</script>

<style lang="scss">
[id^='metamask-logo-request'] + p {
  // max-width: 76px;
  word-break: break-all;
}

.plugin-request {
  .request-list-permissions {
  }
  .float-bottom {
    position: absolute;
    bottom: 14px;
    width: 100%;
  }
  .request {
    padding-top: 74px !important;
  }
  .links {
    font-size: 12px !important;
    display: block;
  }
  .outer-box {
    padding: 12px 18px;
    border-radius: 3px;

    background-color: var(--pale-blue);
    display: flex;
    svg {
      align-self: center;
    }
    p {
      margin-left: 16px !important;
      margin-top: 2px !important;
    }
  }
  .arrow-down-header {
    background-color: #eeeeee;
    transform: rotate(45deg);
    width: 15px;
    height: 15px;
    position: absolute;
    bottom: -7px;
    left: 50%;
    margin-left: -7px;
    z-index: -1;
  }
  .dashed {
    margin-top: 38px;
    border: dashed thin #b8b9bb;
  }
  .connected {
    .dashed {
      border: solid thin var(--turquoise-green);
    }
    .check {
      display: flex;
      svg {
        height: 32px;
        width: 32px;
        margin-top: 22px;
      }
    }
  }
}
</style>
