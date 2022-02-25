const { API } = chrome.extension.getBackgroundPage();

const state = {};
const mutations = {};
const actions = {
  ['INIT']: ({ rootState, commit, state }, { uri }) => {
    return new Promise((resolve, reject) => {
      rootState.debug('Action INIT walletConnect');
      rootState.debug('uri: ', uri);
      API.initFromURI(uri)
        .then((res) => resolve(res))
        .catch((err) => console.log(err));
    });
  },
  ['APPROVE']: ({ rootState, commit, state }) => {
    return new Promise((resolve, reject) => {
      rootState.debug('Action APPROVE walletConnect');
      API.approveSession()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
