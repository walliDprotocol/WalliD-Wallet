import { toChecksumAddress } from "ethereumjs-util";

/* eslint-disable */

const mixinPlugin = {
  name: "mixinPlugin",
  components: {},
  methods: {
    checksumAddress(address) {
      const checksummed = address ? toChecksumAddress(address) : "";
      return checksummed;
    },
    debug(a, ...args) {
      if (this) {
        this.$log.debug(a, ...args);
      } else {
        console.log(a, ...args);
      }
    },
    logError(a, ...args) {
      if (this) {
        this.$log.error(a, ...args);
      } else {
        console.error(a, ...args);
      }
    },
  },
  data() {
    return {};
  },
};

/* eslint-enable */
export default mixinPlugin;
