import WalletConnectClient from '@walletconnect/client';
import { parseWalletConnectUri } from '@walletconnect/utils';

// import { EventEmitter } from 'events';

// const eventEmitter = new EventEmitter();

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

const mw = 'MyWalliD';
const prefix = `@${mw}:`;

const WALLETCONNECT_SESSIONS = `${prefix}walletconnectSessions`;

const CLIENT_OPTIONS = {
  // Required
  description: 'MyWalliD Plugin',
  url: 'https://wallid.io',
  icons: ['https://www.wallid.io/_nuxt/img/logo-wallid.2a194a9.png'],
  name: 'MyWalliD',
  // ssl: true,
};

let connectors = [];
let initialized = false;
const tempCallIds = [];

const persistSessions = async () => {
  const sessions = connectors
    .filter(
      (connector) =>
        connector &&
        connector.walletConnector &&
        connector &&
        connector.walletConnector.connected
    )
    .map((connector) => connector.walletConnector.session);

  await localStorage.setItem(WALLETCONNECT_SESSIONS, JSON.stringify(sessions));
};

class WalletConnect {
  selectedAddress = null;
  chainId = null;
  redirect = null;
  autosign = false;

  constructor(options, address) {
    console.log('WalletConnect constructor', options, CLIENT_OPTIONS);
    this.selectedAddress = address;
    if (options.redirect) {
      this.redirectUrl = options.redirect;
    }

    if (options.autosign) {
      this.autosign = true;
    }

    this.walletConnector = new WalletConnectClient({
      ...options,
    });

    // Override default _clientMeta
    this.walletConnector._clientMeta = CLIENT_OPTIONS;

    /**
     *  Subscribe to session requests
     */
    console.log('walletConnector', this.walletConnector);
    this.walletConnector.on('session_request', async (error, payload) => {
      console.log('WC session_request:', payload);
      if (error) {
        throw error;
      }

      // await waitForKeychainUnlocked();

      try {
        const sessionData = {
          ...payload.params[0],
          autosign: this.autosign,
        };

        console.log('WC:', sessionData);

        // await waitForInitialization();

        await this.sessionRequest(sessionData);

        console.log('after sessionRequest');

        // TODO: get network chainId from networkController (TODO)
        // const { network } = Engine.context.NetworkController.state;

        // TODO: get current wallet address com wallet controller
        // this.selectedAddress =
        //   Engine.context.PreferencesController.state.selectedAddress;
        const approveData = {
          chainId: sessionData.chainId,
          accounts: [this.selectedAddress],
        };
        await this.walletConnector.approveSession(approveData);

        persistSessions();
        // this.redirectIfNeeded();
      } catch (e) {
        console.error(e);
        this.walletConnector.rejectSession();
      }
    });

    /**
     *  Subscribe to call requests
     */
    this.walletConnector.on('call_request', async (error, payload) => {
      console.log('CALL_REQUEST', error, payload);

      if (tempCallIds.includes(payload.id)) return;
      tempCallIds.push(payload.id);

      // await waitForKeychainUnlocked();

      if (error) {
        throw error;
      }

      const meta = this.walletConnector.session.peerMeta;

      if (payload.method) {
        if (payload.method === 'eth_sendTransaction') {
          const { TransactionController } = Engine.context;
          try {
            const txParams = {};
            txParams.to = payload.params[0].to;
            txParams.from = payload.params[0].from;
            txParams.value = payload.params[0].value;
            txParams.gas = payload.params[0].gas;
            txParams.gasPrice = payload.params[0].gasPrice;
            txParams.data = payload.params[0].data;
            const hash = await (
              await TransactionController.addTransaction(
                txParams,
                meta ? WALLET_CONNECT_ORIGIN + meta.url : undefined,
                WalletDevice.MM_MOBILE
              )
            ).result;
            this.walletConnector.approveRequest({
              id: payload.id,
              result: hash,
            });
          } catch (error) {
            this.walletConnector.rejectRequest({
              id: payload.id,
              error,
            });
          }
        } else if (payload.method === 'eth_sign') {
          const { MessageManager } = Engine.context;
          let rawSig = null;
          try {
            if (payload.params[2]) {
              throw new Error('Autosign is not currently supported');
              // Leaving this in case we want to enable it in the future
              // once WCIP-4 is defined: https://github.com/WalletConnect/WCIPs/issues/4
              // rawSig = await KeyringController.signPersonalMessage({
              // 	data: payload.params[1],
              // 	from: payload.params[0]
              // });
            } else {
              const data = payload.params[1];
              const from = payload.params[0];
              rawSig = await MessageManager.addUnapprovedMessageAsync({
                data,
                from,
                meta: {
                  title: meta && meta.name,
                  url: meta && meta.url,
                  icon: meta && meta.icons && meta.icons[0],
                },
                origin: WALLET_CONNECT_ORIGIN,
              });
            }
            this.walletConnector.approveRequest({
              id: payload.id,
              result: rawSig,
            });
          } catch (error) {
            this.walletConnector.rejectRequest({
              id: payload.id,
              error,
            });
          }
        } else if (payload.method === 'personal_sign') {
          const { PersonalMessageManager } = Engine.context;
          let rawSig = null;
          try {
            if (payload.params[2]) {
              throw new Error('Autosign is not currently supported');
              // Leaving this in case we want to enable it in the future
              // once WCIP-4 is defined: https://github.com/WalletConnect/WCIPs/issues/4
              // rawSig = await KeyringController.signPersonalMessage({
              // 	data: payload.params[1],
              // 	from: payload.params[0]
              // });
            } else {
              const data = payload.params[0];
              const from = payload.params[1];

              rawSig = await PersonalMessageManager.addUnapprovedMessageAsync({
                data,
                from,
                meta: {
                  title: meta && meta.name,
                  url: meta && meta.url,
                  icon: meta && meta.icons && meta.icons[0],
                },
                origin: WALLET_CONNECT_ORIGIN,
              });
            }
            this.walletConnector.approveRequest({
              id: payload.id,
              result: rawSig,
            });
          } catch (error) {
            this.walletConnector.rejectRequest({
              id: payload.id,
              error,
            });
          }
        } else if (
          payload.method === 'eth_signTypedData' ||
          payload.method === 'eth_signTypedData_v3'
        ) {
          const { TypedMessageManager } = Engine.context;
          try {
            const rawSig = await TypedMessageManager.addUnapprovedMessageAsync(
              {
                data: payload.params[1],
                from: payload.params[0],
                meta: {
                  title: meta && meta.name,
                  url: meta && meta.url,
                  icon: meta && meta.icons && meta.icons[0],
                },
                origin: WALLET_CONNECT_ORIGIN,
              },
              'V3'
            );

            this.walletConnector.approveRequest({
              id: payload.id,
              result: rawSig,
            });
          } catch (error) {
            this.walletConnector.rejectRequest({
              id: payload.id,
              error,
            });
          }
        } else if (payload.method === 'eth_signTypedData_v4') {
          const { TypedMessageManager } = Engine.context;
          try {
            const rawSig = await TypedMessageManager.addUnapprovedMessageAsync(
              {
                data: payload.params[1],
                from: payload.params[0],
                meta: {
                  title: meta && meta.name,
                  url: meta && meta.url,
                  icon: meta && meta.icons && meta.icons[0],
                },
                origin: WALLET_CONNECT_ORIGIN,
              },
              'V4'
            );

            this.walletConnector.approveRequest({
              id: payload.id,
              result: rawSig,
            });
          } catch (error) {
            this.walletConnector.rejectRequest({
              id: payload.id,
              error,
            });
          }
        }
        this.redirectIfNeeded();
      }
      // Clean call ids
      tempCallIds.length = 0;
    });

    this.walletConnector.on('connect', (error, payload) => {
      console.log('EVENT', 'connect', payload);

      if (error) {
        throw error;
      }

      // this.setState({ connected: true });
    });

    this.walletConnector.on('disconnect', (error) => {
      if (error) {
        throw error;
      }

      // delete walletConnector
      this.walletConnector = null;
      persistSessions();
    });

    this.walletConnector.on('session_update', (error, payload) => {
      console.log('WC: Session update', payload);
      if (error) {
        throw error;
      }
    });

    // Engine.context.TransactionController.hub.on(
    //   'networkChange',
    //   this.onNetworkChange
    // );
    // Engine.context.PreferencesController.subscribe(this.onAccountChange);
    // const { selectedAddress } = Engine.context.PreferencesController.state;
    // const { network } = Engine.context.NetworkController.state;

    // this.chainId = network;
  }

  onAccountChange = () => {
    const { selectedAddress } = Engine.context.PreferencesController.state;

    if (selectedAddress !== this.selectedAddress) {
      this.selectedAddress = selectedAddress;
      this.updateSession();
    }
  };

  onNetworkChange = () => {
    const { network } = Engine.context.NetworkController.state;
    // Wait while the network is set
    if (network !== 'loading' && network !== this.chainId) {
      this.chainId = network;
      this.updateSession();
    }
  };

  sessionRequest(peerInfo) {
    return new Promise((resolve, reject) => {
      console.log('peerInfo', peerInfo);
      window.eventEmitter.emit('walletconnectSessionRequest', peerInfo);

      window.eventEmitter.once(
        'walletconnectSessionRequest::approved',
        (peerId) => {
          console.log(peerInfo.peerId, peerId, peerInfo.peerId === peerId);
          if (peerInfo.peerId === peerId) {
            resolve(true);
          }
        }
      );
      window.eventEmitter.on(
        'walletconnectSessionRequest::rejected',
        (peerId) => {
          if (peerInfo.peerId === peerId) {
            reject(new Error('walletconnectSessionRequest::rejected'));
          }
        }
      );
    });
  }

  updateSession = (sessionData) => {
    // const { network } = Engine.context.NetworkController.state;
    // const { selectedAddress } = Engine.context.PreferencesController.state;
    try {
      this.walletConnector.updateSession(sessionData);
    } catch (e) {
      console.log('Error while updating session', e);
    }
  };

  killSession = () => {
    this.walletConnector && this.walletConnector.killSession();
    this.walletConnector = null;
  };

  redirectIfNeeded = () => {
    if (this.redirectUrl) {
      setTimeout(() => {
        hub.emit('walletconnect:return');
      }, 1500);
    }
  };
}

export default {
  // eventEmitter,
  async init() {
    const sessionData = await localStorage.getItem(WALLETCONNECT_SESSIONS);
    if (sessionData) {
      console.log(sessionData);
      const sessions = JSON.parse(sessionData);
      sessions.forEach((session) => {
        connectors.push(new WalletConnect({ session }));
      });
    }
    initialized = true;
  },

  async getSessions() {
    let sessions = [];
    const sessionData = await localStorage.getItem(WALLETCONNECT_SESSIONS);
    if (sessionData) {
      sessions = JSON.parse(sessionData);
    }
    return sessions;
  },

  async resetApp() {
    // await this.setState({ ...INITIAL_STATE });
    localStorage.removeItem('walletconnect');
  },

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
  },

  isValidUri(uri) {
    const result = parseWalletConnectUri(uri);
    if (!result.handshakeTopic || !result.bridge || !result.key) {
      return false;
    }
    return true;
  },

  // setState(obj) {
  //   Object.keys(obj).forEach((e) => (this.#state[e] = obj[e]));
  // },

  // Wallet Connect methods

  // switchEthereumChain({ chainId }) {
  //   const { connector, address } = this.#state;

  //   connectors.map((c) => {
  //     c.updateSession({ chainId: chainId, accounts: [address] });
  //   });
  // },

  async killSession(id) {
    console.log('ACTION', 'killSession');
    // 1) First kill the session
    const connectorToKill = connectors.find(
      (connector) =>
        connector &&
        connector.walletConnector &&
        connector.walletConnector.session.peerId === id
    );
    if (connectorToKill) {
      await connectorToKill.killSession();
    }
    // 2) Remove from the list of connectors
    connectors = connectors.filter(
      (connector) =>
        connector &&
        connector.walletConnector &&
        connector.walletConnector.connected &&
        connector.walletConnector.session.peerId !== id
    );
    // 3) Persist the list
    await persistSessions();
  },

  // async initFromSession() {
  //   let { chainId } = this.#state;

  //   const session = this.getCachedSession();

  //   if (session) {
  //     //     await getAppControllers().wallet.init(activeIndex, chainId);
  //     //   } else {
  //     const connector = new WalletConnect({ session });

  //     const { connected, accounts, peerMeta } = connector;

  //     const address = accounts[0];

  //     // activeIndex = accounts.indexOf(address);
  //     chainId = connector.chainId;

  //     // await getAppControllers().wallet.init(activeIndex, chainId);
  //     this.setState({
  //       connected,
  //       connector,
  //       address,
  //       accounts,
  //       chainId,
  //       peerMeta,
  //     });

  //     this.subscribeToEvents();
  //   }
  //   // await getAppConfig().events.init(this.state, this.bindedSetState);
  // },

  // async updateSession(sessionParams) {
  //   console.log('updateSession', sessionParams);

  //   const { connector, chainId, accounts, activeIndex } = this.#state;
  //   const newChainId = sessionParams.chainId || chainId;
  //   const newActiveIndex = sessionParams.activeIndex || activeIndex;
  //   const address = accounts[newActiveIndex];
  //   if (connector) {
  //     connector.updateSession({
  //       chainId: newChainId,
  //       accounts: [address],
  //     });
  //   }
  //   await this.setState({
  //     connector,
  //     address,
  //     accounts,
  //     activeIndex: newActiveIndex,
  //     chainId: newChainId,
  //   });
  // },
  async updateChainId({ chainId }) {
    await this.updateSession({ chainId });
  },

  //=============================================================================
  // EXTERNAL API
  //===============================================================================

  initFromURI(uri, address) {
    console.log('ACTION', 'initFromURI', uri);

    const data = { uri };

    // if (redirect) {
    // 	data.redirect = redirect;
    // }
    // if (autosign) {
    // 	data.autosign = autosign;
    // }

    connectors.push(new WalletConnect(data, address));

    // TODO implement an event handler to manage session request/approve with frontend

    // try {
    //   // This needs to be revised, to kill last session to allow a new one
    //   // this.killSession();
    //   const connector = new WalletConnect({ uri });

    //   if (!connector.connected) {
    //     console.log('new session');
    //     await connector.createSession();
    //   }

    //   this.setState({ connector, address });

    //   this.subscribeToEvents();
    //   return { success: true, message: 'Call approveSession now' };
    // } catch (error) {
    //   console.log(error);
    //   throw error;
    // }
  },
  async approveSession(peerId) {
    console.log('ACTION', 'approveSession', peerId);

    // 1) Find session to approve
    const connectorToApprove = connectors.find(
      (connector) =>
        connector &&
        connector.walletConnector &&
        connector.walletConnector.session.peerId === id
    );

    // 2) Approve the session
    if (connectorToApprove) {
      await connectorToApprove.approveSession();
    }

    // 3) Persist the list
    await persistSessions();

    // if (connector) {
    //   return new Promise((resolve, reject) => {
    //     const t = setTimeout(() => reject('ERR_TIMEOUT'), 6 * 1000);
    //     try {

    //       connector.on('session_request', (error, payload) => {
    //         console.log('EVENT', 'session_request');

    //         if (error) {
    //           throw error;
    //         }
    //         console.log('SESSION_REQUEST', payload);
    //         const { chainId, peerMeta } = payload.params[0];

    //         connector.approveSession({ chainId, accounts: [address] });
    //         clearTimeout(t);

    //         this.setState({ peerMeta, chainId });

    //         resolve(peerMeta);
    //       });
    //     } catch (error) {
    //       clearTimeout(t);
    //       resolve(error);
    //     }
    //   });
    // }
    // this.setState({ connector });
  },

  /**
   * Pops and returns the next request on queue.
   *
   * @returns {Object} request - Object as generated by the request API
   */
  // getNextRequest() {
  //   let requests = this.#state.requests;
  //   let next = requests.shift();
  //   this.setState({ requests });

  //   return next;
  // },

  /**
   * Returns an object with the controller's functions.
   * Exposes the controller's functionalities to the UI subsystem.
   *
   * @returns {Object} api
   */
};
