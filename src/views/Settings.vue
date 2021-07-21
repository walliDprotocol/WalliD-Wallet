<template>
  <v-container class="settings">
    <v-row>
      <v-col cols="12" class="pt-1">
        <div class="back-arrow mb-2">
          <v-btn text @click="$router.push('/home')" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1">
            {{ $t('settings.title') }}
          </h2>
        </div>
      </v-col>
    </v-row>
    <v-divider class="full-divider"></v-divider>
    <v-row>
      <v-col v-if="false" cols="12" class="pt-5 text-left">
        <h4 class="mb-2 ">
          {{ $t('settings.general.title') }}
        </h4>

        <label class="sub-title-fields">
          {{ $t('settings.general.language') }}
        </label>

        <v-select
          class="locale-changer"
          v-model="$i18n.locale"
          :items="langs"
          label="Combobox"
          item-text="name"
          item-value="id"
          single-line
          :ripple="false"
          hide-details
          height="44"
          :menu-props="{ contentClass: 'locale-changer select' }"
        >
          <template v-slot:append>
            <icon-dropdown />
          </template>
        </v-select>
      </v-col>
      <v-col cols="12" class="pt-3 pb-1 text-left">
        <h4 class=" mb-2 text-left">
          {{ $t('settings.privacy.title') }}
        </h4>

        <label class="sub-title-fields mb-1">
          {{ $t('settings.privacy.seed[0]') }}
        </label>
        <router-link
          tag="button"
          to="revealSeedPhrase"
          text
          class=" v-btn advance-btn mt-2"
        >
          {{ $t('settings.privacy.seed[1]') }}
        </router-link>
        <router-link to="/about" class="links mt-2">
          {{ $t('settings.privacy.seed[2]') }}
        </router-link>
      </v-col>

      <v-col cols="12" class="pt-2 pb-1 text-left">
        <label class="sub-title-fields mb-1">
          {{ $t('settings.privacy.key[0]') }}
        </label>
        <router-link
          tag="button"
          to="revealPrivKey"
          text
          class=" v-btn advance-btn mt-2"
        >
          {{ $t('settings.privacy.key[1]') }}
        </router-link>
        <router-link to="about" class="links mt-2">
          {{ $t('settings.privacy.key[2]') }}
        </router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ArrowBack from '../images/icon-arrow-back.vue';
import IconDropdown from '../images/icon-arrow-dropdown.vue';

export default {
  components: {
    ArrowBack,
    IconDropdown,
  },
  data() {
    return {
      langs: [
        { id: 'pt', name: 'Português' },
        { id: 'en', name: 'English' },
        { id: 'es', name: 'Español' },
      ],
    };
  },
};
</script>

<style lang="scss">
.locale-changer {
  padding: 0;
  &.select,
  .v-input__control {
    font-family: Montserrat;
    font-size: 13px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: var(--charcoal-grey);
    border-radius: 3px;
    border: solid 1px #b8b9bb;
    .v-input__slot {
      padding: 0 15px;
      &:before {
        content: none;
      }
      &::after {
        content: none;
      }

      .v-input__append-inner {
        margin-top: 12px;
        margin-right: 2px;
      }
    }
    .v-list {
      padding: 2px 0;
      .v-list-item--active {
        color: var(--teal-blue) !important;
        background: #c7eaee;
      }
      .v-ripple__container {
        display: none;
      }
      .v-list-item {
        min-height: 28px;
        &:focus:before {
          opacity: 0;
        }
      }
      .v-list-item--link:hover {
      }
      .v-list-item--link:before {
      }
      .v-list-item__content {
        text-align: left;
        padding: 8px;
      }
      .v-list-item__title {
        color: #373c43;
        font-size: 12px;
      }
    }
  }
}

.full-divider {
  max-width: unset;
  width: 400px;
  margin-left: -20px;
}
.settings {
  h4 {
    font-size: 18px;
    font-weight: 700;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: var(--charcoal-grey);
  }
}
</style>
