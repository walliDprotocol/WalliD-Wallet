<template>
  <div
    v-bind:class="flipped ? 'flip-container flipped' : 'flip-container'"
    :style="cardStyles"
  >
    <div class="flipper">
      <div
        class="front"
        style="background-position: center; background-size: contain;"
      >
        <v-img class="background-img" :src="imgArray[0]" :width="width" />

        <v-btn
          id="flip-btn"
          class="rotate-btn"
          v-if="hasBack"
          :ripple="false"
          text
          @click="flipped = true"
        >
          <IconRotate />
        </v-btn>
      </div>
      <div
        v-if="hasBack"
        class="back"
        style="background-position: center; background-size: contain;"
      >
        <v-img class="background-img" :src="imgArray[1]" :width="width" />

        <v-btn
          id="flip-btn"
          class="rotate-btn"
          v-if="hasBack"
          :ripple="false"
          text
          @click="flipped = false"
        >
          <IconRotate />
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import IconRotate from './assets/icon-rotate';

export default {
  name: 'ShowCredentialImages',
  components: {
    IconRotate,
  },
  props: {
    imgArray: {
      type: Array,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  computed: {
    hasBack() {
      return this.imgArray.length > 1;
    },
  },
  created() {
    console.log(this.imgArray);
  },
  methods: {},
  data() {
    return {
      flipped: false,
      cardStyles: {
        height: this.width / Math.sqrt(2) + 'px',
        width: this.width + 'px',
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.flip-container {
  min-height: 120px;
  -webkit-perspective: 1000;
  -moz-perspective: 1000;
  -o-perspective: 1000;
  perspective: 1000;

  .flipper {
    -moz-transform: perspective(1000px);
    -moz-transform-style: preserve-3d;
    position: relative;
    height: inherit;
    .rotate-btn {
      position: absolute;
      right: 0px;
      bottom: -20px;
      border: none;
      border-radius: 50%;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1) !important;
      background-color: #ffffff;
      min-width: unset;
      height: 44px;
      width: 44px;
      svg {
        margin-top: 5px;
      }
    }
  }
}

.front,
.back {
  height: inherit;

  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -o-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transition: 0.6s;
  -webkit-transform-style: preserve-3d;
  -moz-transition: 0.6s;
  -moz-transform-style: preserve-3d;
  -o-transition: 0.6s;
  -o-transform-style: preserve-3d;
  -ms-transition: 0.6s;
  -ms-transform-style: preserve-3d;
  transition: 0.6s;
  transform-style: preserve-3d;
  top: 0;
  left: 0;
  width: 100%;
  border-radius: 18px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.back {
  transform: rotateY(-180deg);
  position: absolute;
}

.flip-container.flipped .back {
  transform: rotateY(0deg);
}
.flip-container.flipped .front {
  transform: rotateY(180deg);
}
</style>
