<template>
  <div v-bind:class="flipped ? 'flip-container flipped' : 'flip-container'">
    <div class="flipper">
      <div
        class="front"
        :style="checkBackground()"
        style="background-position: center; background-size: contain;"
      >
        <slot name="front"></slot>
        <v-btn
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
        class="back"
        :style="checkBackground()"
        style="background-position: center; background-size: contain;"
      >
        <slot name="back"></slot>

        <v-btn
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
import IconRotate from '../../images/icon-rotate';

export default {
  name: 'FlipCard',
  props: ['hasBack', 'isForeign'],
  components: {
    IconRotate,
  },
  created() {},
  methods: {
    checkBackground() {
      if (this.isForeign) {
        return 'background: #fff';
      } else if (!this.hasBack) {
        return 'background-image: url(../../images/cmd-card.jpg)';
      } else {
        return 'background-image: url(../../images/citizen-card.jpg)';
      }
    },
  },
  data() {
    return {
      flipped: false,
    };
  },
};
</script>

<style lang="scss" scoped>
img.frontFlipBtn,
img.backFlipBtn {
  position: absolute;
  right: 0px;
  bottom: 0px;
  color: #ffffff;
  cursor: pointer;
}

.card .img-top {
  display: none;
  position: absolute;
  z-index: 99;
}

.card:hover .img-top {
  display: inline;
}

.unlock .img-top {
  display: none;
  position: absolute;
  z-index: 99;
}

.unlock:hover .img-top {
  display: inline;
}

i.backFlipBtn {
  -webkit-transform: rotateY(-180deg);
  -moz-transform: rotateY(-180deg);
  -o-transform: rotateY(-180deg);
  -ms-transform: rotateY(-180deg);
  transform: rotateY(-180deg);
}
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

    .rotate-btn {
      position: absolute;
      right: 0px;
      bottom: -20px;
      border: none;
      border-radius: 50%;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      background-color: #ffffff;
      min-width: unset;
      height: 44px;
      max-width: 44px;
    }
  }
}

.front,
.back {
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

  height: 235px;
  border-radius: 24px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
.back {
  transform: rotateY(-180deg);
  position: absolute;
  .row {
    min-height: unset !important;
    align-content: flex-start !important;
  }
}
.flip-container.flipped .back {
  transform: rotateY(0deg);
}
.flip-container.flipped .front {
  transform: rotateY(180deg);
}
.front {
  z-index: 2;
}
</style>
