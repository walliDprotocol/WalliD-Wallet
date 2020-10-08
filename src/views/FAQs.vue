<template>
  <v-container class="faqs">
    <v-row>
      <v-col cols="12" class="pt-1 pb-0">
        <div class="back-arrow mb-6">
          <v-btn text @click="$router.push('/home')" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1">
            {{ $t("faqs.title") }}
          </h2>
        </div>
      </v-col>
    </v-row>

    <v-divider class=""></v-divider>
    <v-row>
      <v-col class="force-scrol pt-0" cols="12">
        <v-expansion-panels accordion flat tile class="faqs-panel">
          <v-expansion-panel
            v-for="(item, i) in $t('faqs.questions')"
            :key="i"
            id="example"
          >
            <v-expansion-panel-header
              class="MENU-SELECTED pl-0"
              @click="changeIcon(i)"
            >
              {{ item.title }}
              <template v-slot:actions>
                <v-icon v-if="i != expanded" color="#373c43">mdi-plus</v-icon>
                <v-icon v-else color="#009fb1">mdi-minus</v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="faqs-panel-content pl-0">
              <v-card-text class="FIELD-TEXT text-left pl-0 pt-0">{{
                item.text
              }}</v-card-text>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ArrowBack from "../images/icon-arrow-back.vue";

export default {
  components: {
    ArrowBack,
  },
  created() {},
  beforeDestroy() {},
  mounted() {},
  computed: {},
  methods: {
    changeIcon(i) {
      i == this.expanded ? (this.expanded = -1) : (this.expanded = i);
    },
  },
  data() {
    return {
      expanded: -1,
    };
  },
};
</script>

<style lang="scss">
.faqs {
  .col.force-scrol {
    max-height: 420px;
    overflow: auto;
  }
  .faqs-panel {
    .v-expansion-panel {
      border-bottom: solid 1px var(--very-light-grey);
    }
    .v-expansion-panel-header {
      min-height: unset;
      padding-right: 10px;
    }
    .v-expansion-panel-header:hover {
      i {
        color: #009fb1 !important;
      }
    }
    .v-expansion-panel-header--active {
      color: #009fb1 !important;
    }
    .v-expansion-panel-content__wrap {
      padding-left: 0;
      padding-right: 0;
    }
  }
}
</style>
