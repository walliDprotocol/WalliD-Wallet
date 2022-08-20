import extension from 'extensionizer';

const { API } = extension.extension.getBackgroundPage();

const state = () => ({
  networksList: API.getState().networkList,
  balance: 0,

  // network: {
  //   ethereumMainnet: { name: 'Ethereum Mainnet', color: '#009fb1' },
  //   rinkebyTestNetwork: { name: 'Rinkeby Test Network', color: '#f79520' },
  //   polygonMainnet: { name: 'Polygon Mainnet', color: '#8247e5' },
  //   mumbaiTestnet: { name: 'Mumbai Testnet', color: '#e95e5e' },
  //   luksoMainnet: { name: 'Lukso Mainnet', color: '#65a5f1' },
  //   l16PublicTestnet: { name: 'L16 Public Testnet', color: '#c787a1' },
  //   localhostNet: { name: 'Localhost Net', color: '#373c43' },
  // },
  previousNetwork: {},
  // currentNetwork: { name: 'Ethereum Mainnet', color: '#009fb1' },
  currentNetwork: API.getState().currentNetwork,
});
const mutations = {
  currentNetwork: (state, value) => {
    state.previousNetwork = state.currentNetwork;
    state.currentNetwork = value;
  },
  currentNetwork(state, value) {
    state.currentNetwork = value;
  },
  networksList(state, value) {
    state.networksList = value;
  },
  balance(state, value) {
    state.balance = value;
  },
};
const actions = {
  ['changeRpcTarget']: ({ rootState, dispatch, state }, network) => {
    return new Promise((resolve, reject) => {
      console.debug('Action changeRpcTarget');
      console.debug('network: ', network);

      resolve(API.changeRpcTarget(network));
    }).then(() => dispatch('updateNetworks'));
  },
  ['getNetworkAssets']: ({ rootState, dispatch, state }) => {
    return new Promise((resolve, reject) => {
      console.debug('Action getNetworkAssets');
      const network = state.currentNetwork;
      console.debug('network: ', network);

      switch (network.chainId) {
        case '2828':
          dispatch('lukso/getLuskoAssets', null, { root: true });
          break;

        default:
          reject(new Error('Not implemented yet'));
          break;
      }
    });
  },

  updateNetworks: async ({ rootState, commit, dispatch }) => {
    commit('currentNetwork', API.getState().currentNetwork);
    commit('networksList', API.getState().networkList);
    commit('balance', await API.getBalance(rootState.address));

    // get assets of network
    dispatch('getNetworkAssets');
  },
};

const getters = {
  currentNetwork: (state) => state.currentNetwork,
  networksList: (state) => state.networksList,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
