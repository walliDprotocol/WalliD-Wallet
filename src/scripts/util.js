import { toChecksumAddress } from 'ethereumjs-util';
import { mapGetters } from 'vuex';
import JazzIcon from '../components/JazzIcon';
import { idtsNames } from './const';

/* eslint-disable */
const INVALID = 'Invalid mnemonic phrase';
const SHUFTI = 'SHUFTI';

const Contracts = [
  '0xF3E778F839934fC819cFA1040AabaCeCBA01e049', // Avastar
  '0xF5b0A3eFB8e8E4c201e2A935F110eAaF3FFEcb8d', // Axie
  '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', // BoredApes
  '0x1A92f7381B9F03921564a437210bB9396471050C', // CoolCats
  '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB', // CryptoPunks
  '0x7Bd29408f11D2bFC23c34f18275bBf23bB716Bc7', // Meebits
  '0xBd3531dA5CF5857e7CfAA92426877b022e612cf8', // PudgyPenguins
  '0x3Fe1a4c1481c8351E91B64D5c398b159dE07cbc5', // SupDucks
];

const mixinPlugin = {
  name: 'mixinPlugin',
  components: {
    JazzIcon,
  },
  computed: {
    ...mapGetters(['connections', 'connected']),
    isConnected() {
      if (this.connected) {
        console.log('updateIsConnected');
        return {
          msg: this.$i18n.t('state.connected[0]'),
          color: '#00e284',
          status: 1,
        };
      } else {
        return {
          msg: this.$i18n.t('state.locked[0]'),
          color: '#b8b9bb',
          status: 0,
        };
      }
    },
  },
  methods: {
    getSocialName(profile) {
      return profile?.socialName;
    },
    getUsername(profile) {
      return (
        profile?.profileData?.domainENS ||
        profile?.profileData?.screen_name ||
        profile?.profileData?.username ||
        profile?.username ||
        ''
      );
    },
    reducedString(val) {
      return val && val.slice(0, 6) + '...' + val.slice(36, 40);
    },
    isNFT(cred) {
      return (
        cred &&
        cred.userData &&
        cred.userData.frontend_props &&
        cred.userData.frontend_props.currentLayout &&
        cred.userData.frontend_props.currentLayout === 'NFT'
      );
    },
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
    validateAddress(address) {
      const isValid = address ? toChecksumAddress(address) : false;
      return { address: address, isValid };
    },
    getDomain(url) {
      var prefix = /^https?:\/\//i;
      var domain = /^[^\/:]+/;
      // remove any prefix
      url = url.replace(prefix, '');
      // assume any URL that starts with a / is on the current page's domain
      if (url.charAt(0) === '/') {
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
        throw new Error('');
      } catch (e) {
        error = e;
      }
      // IE9 does not have .stack property
      if (error.stack === undefined) {
        return '';
      }
      let stackTrace = error.stack.split('\n')[3];
      if (/ /.test(stackTrace)) {
        stackTrace = stackTrace.trim().split(' ')[1];
      }
      if (stackTrace && stackTrace.indexOf('.') > -1) {
        stackTrace = stackTrace.split('.')[1];
      }
      return stackTrace;
    },
    getIDTName(idt) {
      console.log('getIDTName', idt);
      return (idtsNames[idt] || idtsNames[SHUFTI])[this.$i18n.locale];
    },
    debug(a, ...args) {
      if (process.env.NODE_ENV !== 'production') {
        if (this) {
          let methodName = this.getMethodName();

          this.$log.debug(methodName + ' | ', a, ...args);
        } else {
          console.log(a, ...args);
        }
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
    return {
      INVALID: INVALID,
      UC_CMD_PT: 'UC_CMD_PT',
    };
  },
};

/* eslint-enable */
export default mixinPlugin;
