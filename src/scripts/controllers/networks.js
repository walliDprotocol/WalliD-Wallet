var ethers = require('ethers');
// enum of default chain ids
const NetworksChainId = {
  mainnet: '1',
  rinkeby: '4',
  polygon: '137',
  mumbai: '80001',
  luksol16: '2828',
  // localhost: '',
};

const NetworksName = {
  mainnet: 'Ethereum Mainnet',
  rinkeby: 'Rinkeby Test Network',
  polygon: 'Polygon Mainnet',
  mumbai: 'Mumbai Testnet',
  luksol16: 'L16 Public Testnet',
  // localhost: '',
};

const NetworksColors = {
  mainnet: '#009fb1',
  rinkeby: '#f79520',
  polygon: '#8247e5',
  mumbai: '#e95e5e',
  luksol16: '#c787a1',
  // localhost: '',
};

const NetworksBlockExplorer = {
  mainnet: '',
  rinkeby: '',
  polygon: '',
  mumbai: '',
  luksol16: 'https://explorer.execution.l16.lukso.network/',
  // localhost: '',
};

// enum of default rpc urls
const NetworksChainRpc = {
  mainnet: 'https://mainnet.infura.io/v3/463ed0e7b23c41178adf46fd4fbbc7c2',
  rinkeby: 'https://rinkeby.infura.io/v3/463ed0e7b23c41178adf46fd4fbbc7c2',
  polygon: 'https://rpc-mainnet.matic.network',
  mumbai: 'https://rpc-mumbai.matic.today',
  luksol16: 'https://rpc.l16.lukso.network',
  localhost: '',
};

// enum of default rpc urls
const NetworksTicker = {
  mainnet: 'ETH',
  rinkeby: 'ETH',
  polygon: 'MATIC',
  mumbai: 'MATIC',
  luksol16: 'LYXt',
  localhost: '',
};
/**
 * @type ProviderConfig
 *
 * Configuration passed to web3-provider-engine
 * @property rpcTarget - RPC target URL.
 * @property type - Human-readable network name.
 * @property chainId - Network ID as per EIP-155.
 * @property ticker - Currency ticker.
 * @property nickname - Personalized network name.
 */
// export interface ProviderConfig {
//   rpcTarget?: string;
//   type: NetworkType;
//   chainId: string;
//   ticker?: string;
//   nickname?: string;
// }

// default networks array to initiate controller
const defaultNetworkArray = (() => {
  let a = [];
  Object.keys(NetworksChainId).forEach((chain) =>
    a.push({
      chainId: NetworksChainId[chain],
      rpcTarget: NetworksChainRpc[chain],
      ticker: NetworksTicker[chain],
      name: NetworksName[chain],
      color: NetworksColors[chain],
      blockExplorer: NetworksBlockExplorer[chain],
      isCustomNetwork: false,
    })
  );
  return a;
})();
/**
 * @type NetworkState
 *
 * Network controller state
 * @property network - Network ID as per net_version
 * @property isCustomNetwork - Identifies if the network is a custom network
 * @property provider - RPC URL and network name provider settings
 */

export default class NetworksController {
  #networks; //array containing the networks
  #provider;
  #currentChainId;

  constructor(currentChainId = 1, networks = defaultNetworkArray) {
    this.#networks = defaultNetworkArray;
    this.#currentChainId = currentChainId;
    Object.keys(NetworksChainId).forEach((chain) =>
      console.log('chain:', chain)
    );
    console.log('networks:', networks);
    console.log('currentChainId:', currentChainId);

    this.updateProvider();
  }

  serialize() {
    if (this.#networks.length == 0) {
      return JSON.stringify([]);
    }

    return JSON.stringify([this.#currentChainId, ...this.#networks]);
  }

  static deserialize(_nets) {
    if (
      !_nets ||
      (!Array.isArray(_nets) && typeof _nets != 'string') ||
      _nets.length == 0
    ) {
      return new NetworksController();
    }
    let nets = JSON.parse(_nets);
    return new NetworksController(...nets);
  }

  // private
  // create new providet with rpcUrl
  _registerProvider(rpcUrl) {
    this.#provider = rpcUrl
      ? new ethers.providers.JsonRpcProvider(rpcUrl)
      : ethers.getDefaultProvider();
  }

  _getIsCustomNetwork(chainId) {
    return (
      chainId !== NetworksChainId.mainnet &&
      chainId !== NetworksChainId.rinkeby &&
      chainId !== NetworksChainId.polygon &&
      chainId !== NetworksChainId.mumbai &&
      chainId !== NetworksChainId.lukso &&
      chainId !== NetworksChainId.localhost
    );
  }

  updateProvider(rpcUrl) {
    // this.safelyStopProvider(this.provider);
    this._registerProvider(rpcUrl);
  }

  addCustomNetwork({ chainId }) {
    if (this._getIsCustomNetwork(chainId)) {
      this.#networks.push({ ...arguments });
    } else {
      throw Error('Network is not a custom network');
    }
  }
  setCurrentChainId(chainId) {
    return new Promise((resolve, reject) => {
      let currentNetwork = this.#networks.find((n) => n.chainId == chainId);

      if (!currentNetwork) {
        return reject(`ERR_NETWORK_NOT_IN_LIST`);
      }
      this.#currentChainId = chainId;

      this.updateProvider(currentNetwork.rpcTarget);

      return resolve(currentNetwork);
    });
  }
  getCurrentNetworkRpcTarget() {
    return new Promise((resolve, reject) => {
      let currentNetwork = this.#networks.find(
        (n) => n.chainId == this.#currentChainId
      );

      if (!currentNetwork) {
        return reject(`ERR_NETWORK_NOT_ACTIVE`);
      }
      return resolve(currentNetwork.rpcTarget);
    });
  }

  currentNetwork() {
    let currentNetwork = this.#networks.find(
      (n) => n.chainId == this.#currentChainId
    );

    return currentNetwork;
  }

  async getBalance(address) {
    return await this.#provider.getBalance(address);
  }

  //test provider
  async lookupNetwork() {
    const { chainId, error } = await this.#provider.getNetwork();
    this.#currentChainId = error ? 'loading' : chainId;
    return chainId;
  }

  addCustomNetwork(rpcTarget, chainId, ticker, nickname) {
    return new Promise((resolve, reject) => {
      if (this.#networks.findIndex((c) => c.chainId == chainId) != -1) {
        return reject(`ERR_NETWORK_ALREADY_EXISTS`);
      }

      console.log(arguments);
      this.#networks.push({
        rpcTarget,
        chainId,
        ticker,
        nickname: nickname || ticker,
        isCustomNetwork: true,
      });
      return resolve();
    });
  }

  changePermissionLevel(url, level) {
    return new Promise((resolve, reject) => {
      console.log(url, level);
      if (level < 1 || level > 3) return reject('ERR_INV_ACCESS_LEVEL');
      let index = this.#networks.findIndex((c) => c.url == url);

      if (index != -1) {
        this.#networks[index].level = level;
        return resolve(true);
      }
      return reject(`ERR_CONN_NOT_FOUND`);
    });
  }

  removeNetwork(url) {
    console.log(url);
    return Promise.resolve(this.#networks.findIndex((c) => c.url == url)).then(
      (index) => {
        console.log(index);
        if (index != -1) {
          this.#networks.splice(index, 1);
          Promise.resolve(`DISCONNECTED(${url})`);
        } else {
          return Promise.reject(`ERR_CONN_NOT_FOUND`);
        }
      }
    );
  }

  getAllNetworks() {
    return this.#networks;
  }

  isConnected(url) {
    return Promise.resolve(this.#networks.findIndex((c) => c.url == url)).then(
      (index) => index != -1
    );
  }

  getConnectionAccessLevel(url) {
    return Promise.resolve(this.#networks.findIndex((c) => c.url == url)).then(
      (index) =>
        index == -1
          ? Promise.resolve(-1)
          : Promise.resolve(this.#networks[index].level)
    );
  }
}
