// Lukso specific store to use lukso libs and contracts

// import { ethers } from 'ethers';
import extension from 'extensionizer';

const { API } = extension.extension.getBackgroundPage();

const state = () => ({
  UPAddress: API.getState().UPAddress,
  KMAddress: API.getState().KMAddress,
});
const mutations = {
  UPAddress(state, value) {
    state.UPAddress = value;
  },
  KMAddress(state, value) {
    state.KMAddress = value;
  },
};
const actions = {
  ['fetchProfile']: async ({ rootState, dispatch, state }) => {
    const fetchProfile = await API.fetchProfile(rootState.address);
    console.log('fetchProfile: ', fetchProfile);

    dispatch('updateLuskoStore');
    return fetchProfile;
  },
  ['fetchVaults']: async ({ rootState, dispatch, state }) => {
    const fetchVaults = await API.fetchVaults(rootState.address);
    console.log('fetchVaults: ', fetchVaults);

    dispatch('updateLuskoStore');
    return fetchVaults;
  },
  ['createUniversalProfile']: async ({ rootState, dispatch, state }) => {
    const deployedContracts = await API.createUniversalProfile(
      rootState.address
    );
    console.log('deployedContracts: ', deployedContracts);

    const myUPAddress = deployedContracts.LSP0ERC725Account.address;
    console.log('my Universal Profile address: ', myUPAddress);

    dispatch('updateLuskoStore');
    return deployedContracts;
  },
  ['importUniversalProfile']: async (
    { rootState, dispatch, state },
    UPAddressToImport
  ) => {
    const deployedContracts = await API.importUniversalProfile(
      rootState.address,
      UPAddressToImport
    );
    console.log('deployedContracts: ', deployedContracts);

    const myUPAddress = deployedContracts.LSP0ERC725Account.address;
    console.log('my Universal Profile address: ', myUPAddress);

    dispatch('updateLuskoStore');
    return deployedContracts;
  },

  ['mintLSP7Tokens']: async ({ rootState, dispatch, state }) => {
    const mintLSP7Tokens = await API.mintLSP7Tokens(rootState.address);
    console.log('mintLSP7Tokens: ', mintLSP7Tokens);

    dispatch('updateLuskoStore');
    return mintLSP7Tokens;
  },
  ['transferLSP7Tokens']: async ({ rootState, dispatch, state }) => {
    const transferLSP7Tokens = await API.transferLSP7Tokens(rootState.address);
    console.log('transferLSP7Tokens: ', transferLSP7Tokens);

    dispatch('updateLuskoStore');
    return transferLSP7Tokens;
  },

  ['createVaultOnUP']: async ({ rootState, dispatch, state }) => {
    console.log('Action createVaultOnUP: ');

    let newVaultAddress = await dispatch('createVault');
    console.log('newVaultAddress: ', newVaultAddress);

    let resultSetVaultUP = await dispatch('setVaultAddressUP', newVaultAddress);
    console.log('resultSetVaultUP: ', resultSetVaultUP);

    await dispatch('updateLuskoStore');
    return newVaultAddress;
  },

  ['createVault']: async ({ rootState, dispatch, state }) => {
    const createVault = await API.createVault(rootState.address);
    console.log('createVault: ', createVault);

    return createVault;
  },
  ['setVaultAddressUP']: async (
    { rootState, dispatch, state },
    vaultAddress
  ) => {
    const setVaultAddressUP = await API.setVaultAddressUP(vaultAddress);
    console.log('setVaultAddressUP: ', setVaultAddressUP);

    return setVaultAddressUP;
  },
  updateLuskoStore: ({ rootState, commit, state }) => {
    commit('UPAddress', API.getState().UPAddress);
    commit('KMAddress', API.getState().KMAddress);
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
