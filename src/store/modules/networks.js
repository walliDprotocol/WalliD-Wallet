import extension from 'extensionizer';

const { API } = extension.extension.getBackgroundPage();

const state = () => ({
  currentNetwork: API.getState().currentNetwork,
  networkList: API.getState().networkList,
  balance: 0,
});
const mutations = {
  currentNetwork(state, value) {
    state.currentNetwork = value;
  },
  networkList(state, value) {
    state.networkList = value;
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

  updateNetworks: async ({ rootState, commit, state }) => {
    commit('currentNetwork', API.getState().currentNetwork);
    commit('networkList', API.getState().networkList);
    commit('balance', await API.getBalance(rootState.address));
  },
};

const getters = {
  currentNetwork: (state) => state.currentNetwork,
  networkList: (state) => state.networkList,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
