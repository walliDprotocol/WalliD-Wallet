import WalletConnect from '@walletconnect/client';

export const ETH_STANDARD_PATH = "m/44'/60'/0'/0";
export const ENTROPY_KEY = 'ENTROPY';
export const MNEMONIC_KEY = 'MNEMONIC';

export const DEFAULT_ACTIVE_INDEX = 0;
export const MAINNET_CHAIN_ID = 1;
export const ROPSTEN_CHAIN_ID = 3;
export const RINKEBY_CHAIN_ID = 4;
export const GOERLI_CHAIN_ID = 5;
export const DEFAULT_CHAIN_ID = MAINNET_CHAIN_ID;

export const DEFAULT_ACCOUNTS = [];
export const DEFAULT_ADDRESS = '';

export const INITIAL_STATE = {
  loading: false,
  scanner: false,
  connector: null,
  uri: '',
  peerMeta: {
    description: '',
    url: '',
    icons: [],
    name: '',
    ssl: false,
  },
  connected: false,
  chainId: DEFAULT_CHAIN_ID,
  accounts: DEFAULT_ACCOUNTS,
  address: DEFAULT_ADDRESS,
  activeIndex: DEFAULT_ACTIVE_INDEX,
  requests: [],
  results: [],
  payload: null,
};

export default class walletConnectController {
  #state;

  constructor() {
    console.log('*** new walletConnectController *** ');
    this.#state = {
      ...INITIAL_STATE,
    };
  }
  resetApp = async () => {
    await this.setState({ ...INITIAL_STATE });
  };

  getCachedSession() {
    const local = localStorage ? localStorage.getItem('walletconnect') : null;

    let session = null;
    if (local) {
      try {
        session = JSON.parse(local);
      } catch (error) {
        throw error;
      }
    }
    return session;
  }

  setState(obj) {
    Object.keys(obj).forEach((e) => (this.#state[e] = obj[e]));
  }

  // Wallet Connect methods
  async initFromURI(uri, address) {
    try {
      const connector = new WalletConnect({ uri });

      if (!connector.connected) {
        await connector.createSession();
      }

      this.setState({ connector, address });

      this.subscribeToEvents();
      return { success: true, message: 'Call approveSession now' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  subscribeToEvents() {
    console.log('ACTION', 'subscribeToEvents');
    const { connector, address, chainId } = this.#state;

    if (connector) {
      connector.on('session_request', (error, payload) => {
        console.log('EVENT', 'session_request');

        if (error) {
          throw error;
        }
        console.log('SESSION_REQUEST', payload.params);

        this.approveSession();

        const { peerMeta } = payload.params[0];
        this.setState({ peerMeta });
      });

      connector.on('session_update', (error) => {
        console.log('EVENT', 'session_update');

        if (error) {
          throw error;
        }
      });

      connector.on('call_request', async (error, payload) => {
        // tslint:disable-next-line
        console.log('EVENT', 'call_request', 'method', payload.method);
        console.log('EVENT', 'call_request', 'params', payload.params);

        if (error) {
          throw error;
        }
      });

      connector.on('connect', (error, payload) => {
        console.log('EVENT', 'connect');

        if (error) {
          throw error;
        }

        this.setState({ connected: true });
      });

      connector.on('disconnect', (error, payload) => {
        console.log('EVENT', 'disconnect');

        if (error) {
          throw error;
        }

        this.resetApp();
      });

      if (connector.connected) {
        const { chainId, accounts } = connector;
        const index = 0;
        // const address = accounts[index];
        console.log(accounts, chainId);
        this.setState({
          chainId,
        });
      }

      this.setState({ connector });
    }
  }

  async initFromSession() {
    let { chainId } = this.#state;

    const session = this.getCachedSession();

    if (session) {
      //     await getAppControllers().wallet.init(activeIndex, chainId);
      //   } else {
      const connector = new WalletConnect({ session });

      const { connected, accounts, peerMeta } = connector;

      const address = accounts[0];

      // activeIndex = accounts.indexOf(address);
      chainId = connector.chainId;

      // await getAppControllers().wallet.init(activeIndex, chainId);
      this.setState({
        connected,
        connector,
        address,
        accounts,
        chainId,
        peerMeta,
      });

      this.subscribeToEvents();
    }
    // await getAppConfig().events.init(this.state, this.bindedSetState);
  }

  //=============================================================================
  // EXTERNAL API
  //===============================================================================

  approveSession() {
    console.log('ACTION', 'approveSession');
    const { connector, chainId, address } = this.#state;
    if (connector) {
      return new Promise((resolve, reject) => {
        const t = setTimeout(() => reject('ERR_TIMEOUT'), 6 * 1000);
        try {
          connector.on('session_request', (error, payload) => {
            console.log('EVENT', 'session_request');

            if (error) {
              throw error;
            }
            console.log('SESSION_REQUEST', payload);

            connector.approveSession({ chainId, accounts: [address] });
            clearTimeout(t);

            const { peerMeta } = payload.params[0];
            this.setState({ peerMeta });
            resolve(peerMeta);
          });
        } catch (error) {
          clearTimeout(t);
          resolve(error);
        }
      });
    }
    // this.setState({ connector });
  }

  /**
   * Pops and returns the next request on queue.
   *
   * @returns {Object} request - Object as generated by the request API
   */
  getNextRequest() {
    let requests = this.#state.requests;
    let next = requests.shift();
    this.setState({ requests });

    return next;
  }

  /**
   * Returns an object with the controller's functions.
   * Exposes the controller's functionalities to the UI subsystem.
   *
   * @returns {Object} api
   */
  getAPI() {
    return {
      approveSession: this.approveSession.bind(this),
      initFromURI: this.initFromURI.bind(this),
    };
  }
}
