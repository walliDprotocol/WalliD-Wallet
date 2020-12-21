import * as eth from "../lib/eth-utils";

export default class ConfigurationsController {
  // #provider = "https://mainnset.infura.io/v3/96f71504c4da4ad5b87e567aa3a79c9b"
  #provider = "https://rinkeby.infura.io/v3/96f71504c4da4ad5b87e567aa3a79c9b";

  constructor() {}

  setProvider(provider) {
    this.#provider = provider;
    return eth.setProvider(provider);
  }

  getProvider() {
    return this.#provider;
  }
}
