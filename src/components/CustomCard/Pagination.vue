<template>
  <div v-if="pageCount > 1" class="text-center pt-2">
    <v-btn
      v-if="pageCount < -3"
      :disabled="page <= 1"
      @click="$emit('updatePage', page - 1)"
      >back</v-btn
    >

    <div>
      <v-btn
        v-for="index in pageCount"
        :key="index"
        @click="$emit('updatePage', index)"
        :color="index == page ? '#009fb1' : '#b8b9bb'"
        :style="large ? '' : 'height: 18px;width: 18px;'"
        class="page-btn"
        rounded
        :x-small="!large"
        :small="large"
        text
        fab
      >
        <v-icon :style="large ? 'font-size: 16px' : 'font-size: 8px'"
          >mdi-checkbox-blank-circle</v-icon
        >
      </v-btn>
    </div>
    <v-btn
      v-if="pageCount < -3"
      :disabled="page >= pageCount"
      @click="$emit('updatePage', page + 1)"
      >next</v-btn
    >
  </div>
</template>
<script>
export default {
  computed: {
    totalPages: function() {
      return this.pageCount < 4 ? this.pageCount : 3;
    },
  },
  watch: {
    pageCount(value) {
      if (value != this.page) this.$emit("updatePage", value);
    },
    itemsLength() {
      if (this.pageCount != this.page) this.$emit("updatePage", this.pageCount);
    },
  },
  props: {
    itemsLength: {
      required: true,
    },
    pageCount: {
      required: true,
    },
    page: {
      required: true,
    },
    large: {},
  },
};
</script>
<style lang="scss" scoped>
.page-btn.v-btn {
}
</style>
