import { toChecksumAddress } from "ethereumjs-util";
import { mapGetters } from "vuex";
import JazzIcon from "../components/JazzIcon";

/* eslint-disable */
const INVALID = "Invalid mnemonic phrase";

const mixinPlugin = {
  name: "mixinPlugin",
  components: {
    JazzIcon,
  },
  computed: {
    ...mapGetters(["connections", "connected"]),
    isConnected() {
      if (this.connected) {
        console.log("updateIsConnected");
        return {
          msg: this.$i18n.t("state.connected[0]"),
          color: "#00e284",
          status: 1,
        };
      } else {
        return {
          msg: this.$i18n.t("state.locked[0]"),
          color: "#b8b9bb",
          status: 0,
        };
      }
    },
  },
  methods: {
    scrollInto(id_top, offset) {
      this.$nextTick(() => {
        // var element = document.getElementById(id_top);
        // var myElement = document.getElementById("element_within_div");
        // var topPos = element.offsetTop;

        document.getElementById(id_top).scrollTop = offset;

        // var headerOffset = offset;
        // var elementPosition =
        //   element.getBoundingClientRect().top + window.scrollY;
        // var offsetPosition = elementPosition - headerOffset;
        // var behavior = "smooth";
        // window.scrollTo({
        //   top: offsetPosition,
        //   behavior: behavior,
        // });
      });
    },
    checksumAddress(address) {
      const checksummed = address ? toChecksumAddress(address) : "";
      return checksummed;
    },
    getDomain(url) {
      var prefix = /^https?:\/\//i;
      var domain = /^[^\/:]+/;
      // remove any prefix
      url = url.replace(prefix, "");
      // assume any URL that starts with a / is on the current page's domain
      if (url.charAt(0) === "/") {
        url = window.location.hostname + url;
      }
      // now extract just the domain
      var match = url.match(domain);

      if (match) {
        return match[0];
      }
      return null;
    },
    getMethodName() {
      let error = {};
      try {
        throw new Error("");
      } catch (e) {
        error = e;
      }
      // IE9 does not have .stack property
      if (error.stack === undefined) {
        return "";
      }
      let stackTrace = error.stack.split("\n")[3];
      if (/ /.test(stackTrace)) {
        stackTrace = stackTrace.trim().split(" ")[1];
      }
      if (stackTrace && stackTrace.indexOf(".") > -1) {
        stackTrace = stackTrace.split(".")[1];
      }
      return stackTrace;
    },
    debug(a, ...args) {
      if (this) {
        let methodName = this.getMethodName();

        this.$log.debug(methodName + " | ", a, ...args);
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
    return { INVALID: INVALID };
  },
};

/* eslint-enable */
export default mixinPlugin;
