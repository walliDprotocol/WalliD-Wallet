<template>
  <v-container
    class="credentials list-storage"
    style="overflow-y: auto; height: 208px"
  >
    <v-row class="pl-4 py-4">
      <div
        class="id-chip"
        :class="{ selected: idAssetFilter === 'Legacy ID' }"
        @click="idAssetFilter = 'Legacy ID'"
      >
        Legacy IDs
      </div>
      <div
        class="id-chip"
        :class="{ selected: idAssetFilter === 'Web2 ID' }"
        @click="idAssetFilter = 'Web2 ID'"
      >
        Web2 IDs
      </div>
      <div
        class="id-chip"
        :class="{ selected: idAssetFilter === 'Web3 ID' }"
        @click="idAssetFilter = 'Web3 ID'"
      >
        Web3 IDs
      </div>
    </v-row>
    <v-row>
      <ListOnlineIDs v-if="idAssetFilter === 'Web2 ID'" />
      <ListIDs v-if="idAssetFilter === 'Legacy ID'" />
      <ListCrendentials v-if="idAssetFilter === 'Web3 ID'" />
    </v-row>
  </v-container>
</template>

<script>
import Asset from '../../components/Asset';

import ListIDs from '../../components/ListIDs';
import ListCrendentials from '../../components/ListCrendentials';
import ListOnlineIDs from '../../components/ListOnlineIDs';

import { mapGetters } from 'vuex';

const PDF_URL = 'https://mycredentials.wallid.io/ViewCredential/';

export default {
  name: 'IDs',
  components: {
    Asset,
    ListIDs,
    ListCrendentials,
    ListOnlineIDs,
  },
  computed: {
    ...mapGetters(['identities', 'showDeleteConfirmation']),
    idAssets: function () {
      var filter = this.idAssetFilter;
      return this.identities.filter(function (el) {
        return el.assetType === filter;
      });
    },
  },
  methods: {
    openDeleteAssetModal(asset) {
      this.$store.commit('setCurrentCred', asset);
      this.$store.commit('showDeleteConfirmation', true);
    },
    getName(credential) {
      if (this.isNFT(credential)) {
        return (
          credential.userData.user_data['PROJECT'] +
          '#' +
          (credential.userData.user_data['TOKEN ID'].length > 10
            ? this.reducedString(credential.userData.user_data['TOKEN ID'])
            : credential.userData.user_data['TOKEN ID'])
        );
      }

      return credential.credName || credential.assetName;
    },
    getCredentialName(credential) {
      return credential.caName || credential.username;
    },
    getImage(card) {
      if (card?.userData?.frontend_props?.currentLayout === 'Badge') {
        return card.userData?.imgArray?.[0];
      }
      return (
        card.userData?.credential_img ||
        card.userData?.frontend_props?.preview ||
        card.photoURL
      );
    },
    downloadURL(card) {
      // if (
      //   this.connected &&
      //   new RegExp(WALLID_DOMAINS.join('|')).test(this.connected.url)
      //   //  && !card.userData.pdf_url // Required for old users < 14/4/2021 ?
      // ) {
      if (this.isNFT(card)) {
        return card && card.userData && card.userData.imgArray[0];
      }
      return PDF_URL + card.id;
      // }
      // return card.userData.pdf_url;
    },
    viewCred(card) {
      console.log('List', this.credentials);
      console.log('List', card);
      this.$store.commit('setCurrentCred', card);
      this.$router.push({ name: 'Credential' });
    },
    shareProfile(asset) {
      this.$store.commit('currentCred', asset);

      this.$router.push({ name: 'SHARE_PROFILE_VIEW', params: { asset } });
    },
    deleteCred(card) {
      this.$store.commit('showDeleteConfirmation', true);

      this.$store.commit('setCurrentCred', card);
    },
    proofPage(card) {
      this.$store.commit('setCurrentCred', card);

      this.$router.push({ name: 'SHARE_PROFILE_VIEW' });
      // this.$router.push({ name: 'Proof' });
    },

    isValid(_expDate) {
      if (_expDate) {
        var parts = _expDate.split(' ');
        var expDate = new Date(parts[2], parts[1] - 1, parts[0]);
        let currDate = new Date();
        var millisecondsPerDay = 1000 * 60 * 60 * 24;
        var millisBetween = currDate.getTime() - expDate.getTime();
        var days = millisBetween / millisecondsPerDay;
        console.log(Math.floor(days));
        // Round down.
        return Math.floor(days) <= 0;
      } else {
        return false;
      }
    },
    assetTitle(asset) {
      if (this.idAssetFilter === 'Legacy ID') {
        return asset.idName;
      } else if (this.idAssetFilter === 'Web2 ID') {
        return asset.socialmedia;
      } else {
        return asset.titleField;
      }
    },
    assetSubtitle(asset) {
      if (this.idAssetFilter === 'Legacy ID') {
        return asset.date;
      } else if (this.idAssetFilter === 'Web2 ID') {
        return asset.username;
      } else {
        return asset.subtitleField;
      }
    },
    assetChip(asset) {
      if (this.idAssetFilter === 'Legacy ID') {
        return asset.validity;
      } else if (this.idAssetFilter === 'Web2 ID') {
        return;
      } else {
        return asset.validity;
      }
    },
  },
  data() {
    return {
      storeWeb3Link: 'https://www.wallid.io/Setup/?flow=WEB3', // "https://www.wallid.io/Setup/selectedDocumentType='Web3'",
      idAssetFilter: 'Legacy ID',
    };
  },
};
</script>

<style lang="scss" scoped>
/* TO DO: review used classes in this component */
.dot-menu {
  margin-top: 4px;
}
</style>
<style lang="scss">
.SECUNDARY-LINKS {
  a {
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.43;
    letter-spacing: normal;
    text-align: center;
    color: var(--charcoal-grey) !important;
    text-decoration: none;
    &:hover {
      color: #009fb1 !important;
    }
  }
}
.wallet-tooltip.v-tooltip__content.credential {
  width: 390px;
}
.tooltip-credential {
  border-radius: 3px;
  background-color: #eeeeee;
  padding: 8px 10px;
  margin: auto;
  p {
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.38;
    letter-spacing: normal;
    text-align: center;
    color: var(--charcoal-grey);
  }
}
.dot-menu {
  margin-top: 32px;
  .v-list {
    padding: 0;
  }

  .v-list-item {
    min-height: unset;
    padding: 10px 20px;
    &.disabled {
      pointer-events: none;
      .v-list-item__title,
      a {
        color: #b8b9bb !important;
      }
    }
    cursor: pointer;
    .SECUNDARY-LINKS:hover {
      color: #009fb1 !important;
    }
  }
}
.credentials {
  overflow-y: auto;
  overflow-x: hidden;

  height: 200px;
  .dot-menu-button {
    &:hover .v-btn__content {
      svg {
        g {
          fill: #009fb1 !important;
        }
      }
    }
    &::before {
      content: none;
    }
  }

  .card {
    background-color: var(--white);
    .sub-title-fields {
      font-size: 14px !important;
      text-align: left;
    }

    .col-8 {
      align-items: center;
      display: flex;
    }
    .FIELD-TEXT {
      text-align: left;
    }
    .back-btn {
      padding: 0 !important;
      min-width: 16px !important;
    }
  }
}

.id-chip {
  font-size: 13px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 21px;
  border: solid 1px #e5e5ec;
  background-color: #fff;
  margin-right: 12px;
  cursor: pointer;
}

.selected {
  background-color: #dbedef;
  border: solid 1px #009fb1;
  color: #009fb1;
}
</style>
