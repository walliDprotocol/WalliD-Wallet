import { SHARE_PROFILE } from '../actions';
import axios from 'axios';

const { API } = chrome.extension.getBackgroundPage();

const state = () => ({
    network: {
        ethereumMainnet: {name: 'Ethereum Mainnet' ,color: '#009fb1',},
        rinkebyTestNetwork :  {name: 'Rinkeby Test Network' ,color: '#f79520',},
        polygonMainnet :  {name: 'Polygon Mainnet' ,color: '#8247e5',},
        mumbaiTestnet :  {name: 'Mumbai Testnet' ,color: '#e95e5e',},
        luksoMainnet :  {name: 'Lukso Mainnet' ,color: '#65a5f1',},
        l16PublicTestnet :  {name: 'L16 Public Testnet' ,color: '#c787a1',},
        localhostNet :  {name: 'Localhost Net' ,color: '#373c43',},
    },
    currentNetwork: {name: 'Ethereum Mainnet' ,color: '#009fb1',},
});
const mutations = {
  currentNetwork: (state, value) => {
    state.currentNetwork = value ;
  },
};
const actions = {
  [SHARE_PROFILE]: ({ rootState, commit, state }, body) => {
    return new Promise((resolve, reject) => {
      rootState.debug('Action SHARE_PROFILES');
      rootState.debug('Body: ', body);
      let url = 'https://dca.wallid.io/api/v1/social-profile/share';
      axios(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: body,
      }).then((res) => {
        rootState.debug(res);
        resolve(res);
      });
    });
  },
};

const getters = {
    currentNetwork: (state) => state.currentNetwork,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};