export default {
  data() {
    return {
      windowHeight: 0,
      windowWidth: 0,
    };
  },
  created() {
    window.addEventListener("resize", this.getWindowSize);
    this.getWindowSize();
  },
  mounted() {
    this.getWindowSize();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getWindowSize);
  },

  methods: {
    distance(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },

    getWindowSize() {
      if (this.$el) {
        this.windowHeight = this.$el.clientHeight;
        this.windowWidth = this.$el.clientWidth;
      }
    },
  },
};
