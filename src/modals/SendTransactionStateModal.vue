<template>
  <v-dialog :value="success" class="dialog">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :disabled="disabled"
        :loading="loading"
        text
        v-bind="attrs"
        class="advance-btn"
        @click="$emit('click')"
      >
        Confirm
      </v-btn>
    </template>

    <v-container>
      <v-row style="padding: 15px 20px 20px 20px;">
        <v-col cols="12" class="d-flex align-center justify-space-between pa-0">
          <h2 class="T1">
            {{ success ? 'Successfully sent' : 'Trouble Sending' }}
          </h2>
          <v-img
            max-width="18"
            contain
            src="../images/icons/close-icon.png"
            style="cursor: pointer;"
            @click="close"
          ></v-img>
        </v-col>
        <v-col cols="12" class="mt-6 pa-5 d-flex align-center flex-column">
          <v-img v-if="success" contain src="../images/img/a-a.png" />
          <v-img
            v-else
            contain
            src="../images/img/icon-not-sucessfully.png"
          ></v-img>
          <p class="mt-1" style="font-size: 20px; font-weight: 800;">
            {{ success ? assetTitle + ' sent!' : 'Unable to send' }}
          </p>
          <p
            class="mt-1"
            style="font-size: 16px; font-weight: 600; max-width: 341px;"
          >
            {{
              success
                ? 'You’ve successfully sent ' +
                  assetTitle +
                  ' to ' +
                  truncate(recipientAddress, 12)
                : 'There was an error attempting to send ' +
                  assetTitle +
                  'to' +
                  recipientAddress
            }}
          </p>
        </v-col>
        <v-col class="pa-0">
          <v-btn depressed class="advance-btn" @click="close">
            {{ success ? 'Done' : 'Try again' }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: ['success', 'recipientAddress', 'loading', 'assetTitle', 'disabled'],
  computed: {
    ...mapGetters(['currentVault']),
  },
  methods: {
    truncate() {
      return this.$options.filters.truncate(...arguments)
    },
    close() {
      this.$store.commit('setCurrentAsset', null)
      this.$store.commit('showSendAssetModal', false)
    },
  },
  data() {
    return {
      dialog: false,
    }
  },
}
</script>
