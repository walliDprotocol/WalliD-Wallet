<template>
  <div
    class="confirm-seed-phrase__seed-word"
    :class="[
      className,
      {
        'confirm-seed-phrase__seed-word--selected btn-primary': selected,
        'confirm-seed-phrase__seed-word--empty': !word,
      },
    ]"
    @click="toggleSelected(index)"
  >
    {{ word }}
  </div>
</template>

<script>
export default {
  props: ["index", "word", "selected", "className"],
  methods: {
    toggleSelected() {
      this.$emit("toggleSelected");
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss">
.confirm-seed-phrase {
  &__back-button {
    margin-bottom: 12px;
  }

  &__sorted-seed-words {
    padding: 6px 8px;
    border-radius: 3px;
    border: solid 1px transparent;
    justify-content: space-between;
    display: flex;
    flex-wrap: wrap;
    flex: 1 1 auto;
  }

  &__seed-word {
    // display: inline-flex;
    // flex-flow: row nowrap;
    // align-items: center;
    // justify-content: center;
    padding: 6px 7px;
    width: 108px;
    height: 28px;
    border-radius: 3px;
    border: solid 1px var(--teal-blue);
    font-size: 12px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: var(--teal-blue);
    text-align: center;
    border-radius: 3px;
    margin: 3px;
    background: white;
    &--sorted {
      cursor: pointer;
    }

    &--selected {
      color: var(--white);
      background-color: var(--teal-blue);
    }

    &--dragging {
      margin: 0;
    }

    &--empty {
      background-color: transparent;
      border-color: transparent;
      cursor: default !important;

      &:hover,
      &:active {
        background-color: transparent;
        border-color: transparent;
        cursor: default;
        box-shadow: none !important;
      }
    }

    &--hidden {
      display: none !important;
    }

    &--drop-hover {
      background-color: transparent;
      border-color: transparent;
      color: transparent;
    }
  }

  &__selected-seed-words {
    /*rtl:ignore*/
    justify-content: space-between;
    display: flex;
    flex-wrap: wrap;
    flex: 1 1 auto;
    width: 360px;
    height: 143px;
    border-radius: 3px;
    border: solid 1px #b8b9bb;
    padding: 4px 10px;
    margin-bottom: 6px;
    //Enable when draggin is implemented
    // .confirm-seed-phrase__selected-seed-word {
    //   cursor: move;
    // }
    &__error-verify {
      border-color: var(--coral);
    }
    &__pending-seed {
      display: none;
    }

    &__selected-seed {
      display: inline-flex;

      &:hover {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
      }
    }

    &--dragging {
      .confirm-seed-phrase__selected-seed-words__pending-seed {
        display: inline-flex;
      }

      .confirm-seed-phrase__selected-seed-words__selected-seed {
        display: none;
      }
    }
  }
}
</style>
