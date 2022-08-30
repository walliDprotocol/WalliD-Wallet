// This is the controller for lukso network that allows the use of LSPs
// https://docs.lukso.tech/standards/introduction

const { LSPFactory } = require('@lukso/lsp-factory.js');
const { ERC725 } = require('@erc725/erc725.js');
const RPC_ENDPOINT = 'https://rpc.l16.lukso.network';

require('isomorphic-fetch');
const IPFS_GATEWAY = 'https://2eff.lukso.dev/ipfs/';

import Web3 from 'web3';
const web3 = new Web3(RPC_ENDPOINT);

import { ethers } from 'ethers';

// Contracts
import LSP0UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import LSP1UniversalReceiverDelegateVaultContract from '@lukso/lsp-smart-contracts/artifacts/LSP1UniversalReceiverDelegateVault.json';
import LSP6KeyManagerContract from '@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json';
import LSP7DigitalAssetContract from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json';
import LSP8IdentifiableDigitalAssetContract from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json';
import LSP9VaultContract from '@lukso/lsp-smart-contracts/artifacts/LSP9Vault.json';

// Schemas
import LSP4DigitalAssetSchema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import LSP6KeyManagerSchema from '@erc725/erc725.js/schemas/LSP6KeyManager.json';
import LSP10VaultSchema from '@erc725/erc725.js/schemas/LSP10ReceivedVaults.json';
const LSP8IdentifiableDigitalAssetSchema = [
  ...LSP4DigitalAssetSchema,
  {
    name: 'LSP8MetadataJSON:<bytes32>',
    key: '0x9a26b4060ae7f7d5e3cd0000<bytes32>',
    keyType: 'Mapping',
    valueType: 'bytes',
    valueContent: 'JSONURL',
  },
];
const constants = require('@lukso/lsp-smart-contracts/constants.js');

const INTERFACE_IDS = {
  LSP7DigitalAsset: '0xe33f65c3',
  LSP8IdentifiableDigitalAsset: '0x49399145',
};

// Data Keys
const URD_DATA_KEY = constants.ERC725YKeys.LSP0.LSP1UniversalReceiverDelegate;
const LSP10_DATA_KEY = 'LSP10Vaults[]';
const LSP5_DATA_KEY = 'LSP5ReceivedAssets[]';
const LSP12_DATA_KEY = 'LSP12IssuedAssets[]';
// LSP8 custom data key
const LSP8_DATA_KEY = (tokenId) => [
  'LSP4TokenName',
  'LSP4TokenSymbol',
  {
    keyName: 'LSP8MetadataJSON:<bytes32>',
    dynamicKeyParts: tokenId,
  },
  'LSP4Metadata',
];

export default class LuksoController {
  #UPAddress;
  #KMAddress;
  #EOA;

  constructor({ KMAddress, UPAddress, EOA }) {
    console.log('UPAddress', UPAddress);

    this.#UPAddress = UPAddress;
    this.#KMAddress = KMAddress;
    this.#EOA = EOA;
  }

  serialize() {
    return JSON.stringify({
      KMAddress: this.#KMAddress,
      UPAddress: this.#UPAddress,
      EOA: this.#EOA,
    });
  }

  static deserialize(_luksoController) {
    console.log('_luksoController', _luksoController);

    if (!_luksoController || typeof _luksoController != 'string') {
      return new LuksoController({});
    }
    let luksoController = JSON.parse(_luksoController);
    console.log('luksoController parsed', luksoController);

    return new LuksoController(luksoController);
  }

  /**
   * creates a UP for the current wallet
   * @param {string} address - address of the owner
   * @param {Object} profileData - the profile data to be set on the profile
   * @param {string} privateKey - private key to deploy the UP
   * @returns the deploy universal profile
   */
  encodeData({ data, schema, UPAddress }) {
    const config = { ipfsGateway: IPFS_GATEWAY };
    const provider = new Web3.providers.HttpProvider(RPC_ENDPOINT);

    const ERC725Object = new ERC725(schema, UPAddress, provider, config);

    return ERC725Object.encodeData(data);
  }

  /**
   * adds the wallet private key to web3 module
   * @param {string} privateKey - private key to use with web3
   */
  initEOA(privateKey) {
    this.#EOA = web3.eth.accounts.wallet.add(privateKey);
  }

  /**
   * creates a UP for the current wallet
   * @param {string} address - address of the owner
   * @param {Object} profileData - the profile data to be set on the profile
   * @param {string} privateKey - private key to deploy the UP
   * @returns the deploy universal profile
   */
  createUniversalProfile(address, { username }, privateKey) {
    console.log('createUniversalProfile: ', address, username);

    let lspFactory = new LSPFactory(RPC_ENDPOINT, {
      deployKey: privateKey,
      chainId: 2828,
    });

    return lspFactory.UniversalProfile.deploy({
      controllerAddresses: [this.#EOA.address], // our EOA that will be controlling the UP
      lsp3Profile: {
        name: username,
        description: 'My Cool WalliD Universal Profile',
        tags: ['Public Profile'],
        links: [
          {
            title: 'MyWalliD',
            url: 'https://wallid.io',
          },
        ],
      },
    });
  }

  /**
   * Checks if the given EOA address is the owner of the UP Address
   * @param {string} ownerAddress - EOA address to check
   * @param {string} UPAddressToImport - UP address to check
   * @returns the key manager address and the UP address
   */
  async checkOwnership(ownerAddress, UPAddressToImport) {
    console.log('checkOwnership', ownerAddress, UPAddressToImport);

    let AddressPermissionsArray = await this.getDataKey(
      'AddressPermissions[]',
      UPAddressToImport,
      LSP6KeyManagerSchema
    );

    console.log(AddressPermissionsArray);
    if (!AddressPermissionsArray) return { error: 'Your are not the owner of this profile' };
    let isOwner = AddressPermissionsArray.value.find((a) => {
      return ethers.utils.getAddress(ownerAddress) == a;
    });

    if (isOwner) {
      const myUP = new web3.eth.Contract(LSP0UniversalProfile.abi, UPAddressToImport);
      const keyManagerAddress = await myUP.methods.owner().call();

      console.log(ethers.utils.getAddress(ownerAddress), 'km', keyManagerAddress);

      return {
        deployedContracts: {
          LSP0ERC725Account: { address: UPAddressToImport },
          LSP6KeyManager: { address: keyManagerAddress },
        },
      };
    }
  }

  /**
   * sets Universal Profile Address
   * @param {string} UPAddress - universal profile address
   */
  setUniversalProfileAddress(UPAddress) {
    this.#UPAddress = UPAddress;
  }

  /**
   * sets Key Manager Address
   * @param {string} KMAddress - key manager address
   */
  setKeyManagerAddress(KMAddress) {
    this.#KMAddress = KMAddress;
  }

  /**
   * gets Universal Profile Address
   * @returns the Universal Profile Address
   */
  getUniversalProfileAddress() {
    return this.#UPAddress;
  }

  /**
   * gets Key Manager Address
   * @returns the key manager address
   */
  getKeyManagerAddress() {
    return this.#KMAddress;
  }

  /**
   * gets the given address profile data
   * @param {string} addressToFetch - address of the ERC725 contract
   * @returns the LSP0 data key
   */
  async fetchProfile(addressToFetch) {
    return await this.getDataKey('', addressToFetch);
  }

  /**
   * =Ggets the given address vaults data
   * @param {string} addressToFetch - address of the ERC725 contract
   * @returns the LSP10 data key
   */
  async fetchVaults(addressToFetch) {
    return await this.getDataKey(LSP10_DATA_KEY, addressToFetch, LSP10VaultSchema);
  }

  /**
   * Gets LSP5 - Received Assets from the given address
   * @param {string} addressToFetch - address of the ERC725 contract
   * @returns the LSP5 data key
   */
  async fetchLSP5(addressToFetch) {
    return await this.getDataKey(LSP5_DATA_KEY, addressToFetch);
  }
  /**
   * Gets LSP12 - Issued Assets from the given address
   * @param {string} addressToFetch - address of the ERC725 contract
   * @returns the  LSP12 data key
   */
  async fetchLSP12(addressToFetch) {
    return await this.getDataKey(LSP12_DATA_KEY, addressToFetch);
  }

  /**
   * Gets data key of the ERC752 address from the given schema
   * @param {string} dataKey - dataKey to retrieve
   * @param {string} address - address of the ERC725 contract
   * @param {string} _schema - the schema to lookup
   * @returns returns the data
   */
  async getDataKey(dataKey, address, _schema) {
    // Parameters for ERC725 Instance
    const schema =
      _schema || require('@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json');
    const config = { ipfsGateway: IPFS_GATEWAY };
    const provider = new Web3.providers.HttpProvider(RPC_ENDPOINT);
    try {
      const profile = new ERC725(schema, address, provider, config);
      return await profile.fetchData(dataKey);
    } catch (error) {
      return console.log('This is not an ERC725 Contract', error);
    }
  }

  /**
   * Deploys a given contract with the user wallet, can receive additional arguments to be passed
   * to the contract constructor.
   * @param {JSON} contractJSON - The contract to deploy.
   * @param {Array} args - additional arguments to pass to the con.
   * @returns The deployed contract address.
   */
  async contractFactory(contractJSON, args = []) {
    console.log('Deploy contractJSON ', this.#EOA.address, contractJSON, args);

    let contractFactory = new web3.eth.Contract(contractJSON.abi);

    // deploy the vault contract
    let contract = await contractFactory
      .deploy({
        data: contractJSON.bytecode,
        arguments: args, // address of the UniversalProfile
      })
      .send({
        from: this.#EOA.address,
        gas: 5_000_000,
        gasPrice: '1000000000',
      });

    return contract._address;
  }

  /**
   * Creates a new URD for the user wallet
   * @returns the created contract
   */
  async deployingUniversalReceiverDelegate() {
    return this.contractFactory(LSP1UniversalReceiverDelegateVaultContract);
  }

  /**
   * Creates a new vault contract with the given UPAddress being the owner
   * @param {string} UPAddress - the UP address that will be the owner of the vault
   * @returns the created contract
   */
  async deployVault(UPAddress) {
    return this.contractFactory(LSP9VaultContract, [UPAddress]);
  }

  /**
   * Creates a vault on the user UP, setting up all the required contracts
   * @returns the vault address that needs to be added to LSP10 next
   */
  async createVault() {
    // deploy the vault contract
    let vaultContractAddress = await this.deployVault(
      this.#UPAddress // address of the UniversalProfile
    );

    console.log('LSP9VaultFactory contract', vaultContractAddress);

    let vaultURDAddress = await this.deployingUniversalReceiverDelegate();

    console.log('vaultURDAddress contract', vaultURDAddress);

    const myVault = new web3.eth.Contract(LSP9VaultContract.abi, vaultContractAddress);

    // create an instance of the UP
    const myUP = new web3.eth.Contract(LSP0UniversalProfile.abi, this.#UPAddress);

    // encode setData Payload on the Vault
    const setDataPayload = await myVault.methods['setData(bytes32,bytes)'](
      URD_DATA_KEY,
      vaultURDAddress
    ).encodeABI(); // Any other information can be stored here

    console.log('setDataPayload', setDataPayload);

    // encode execute Payload on the UP
    const executePayload = await myUP.methods
      .execute(
        0, // OPERATION CALL
        vaultContractAddress,
        0, // value to transfer
        setDataPayload
      )
      .encodeABI();

    console.log('executePayload', executePayload);

    // getting the Key Manager address from UP
    const myKeyManagerAddress = await myUP.methods.owner().call();

    // create an instance of the KeyManager
    let myKM = new web3.eth.Contract(LSP6KeyManagerContract.abi, myKeyManagerAddress);

    // execute the executePayload on the KM
    let result = await myKM.methods.execute(executePayload).send({
      from: this.#EOA.address,
      gasLimit: 6_000_000,
    });

    console.log('Result  ', result);

    return vaultContractAddress;
  }

  /**
   * Sets a vault address on the the UP by editing the UP LSP10 - Received Vaults
   * @param {string} vaultAddress - the vault address to set
   * @returns returns the transaction receipt
   */
  async setVaultAddressUP(vaultAddress) {
    console.log('setVaultAddressUP ');

    const LSP9VaultInterfaceId = '0x8c1d44f6';

    // GET the current profile vaults
    let LSP10Vaults;
    try {
      LSP10Vaults = await this.fetchVaults(this.#UPAddress);
      console.log('log LSP10Vaults ', LSP10Vaults);
    } catch (ex) {
      // Error getting vault
      console.log('err get data  ', ex);
      throw new Error('Error getting vault');
    }

    // add new vault
    LSP10Vaults.value.push(vaultAddress);

    console.log('LSP10Vaults', LSP10Vaults, LSP10Vaults.value.length - 1);

    // https://docs.lukso.tech/standards/smart-contracts/interface-ids

    const encodedErc725Data = this.encodeData({
      data: [
        {
          keyName: 'LSP10Vaults[]',
          value: LSP10Vaults.value,
        },
        {
          keyName: 'LSP10VaultsMap:<address>',
          dynamicKeyParts: vaultAddress,
          value: [LSP9VaultInterfaceId, LSP10Vaults.value.length - 1], // LSP7 interface ID + index position of asset
        },
      ],
      schema: LSP10VaultSchema,
      UPAddress: this.#UPAddress,
    });
    // SEND transaction
    try {
      console.log('LSP0UniversalProfile', LSP0UniversalProfile);

      const UniversalProfileContract = new web3.eth.Contract(
        LSP0UniversalProfile.abi,
        this.#UPAddress
      );

      const setDataPayload = await UniversalProfileContract.methods['setData(bytes32[],bytes[])'](
        encodedErc725Data.keys,
        encodedErc725Data.values
      ).encodeABI();

      console.log('setDataPayload', setDataPayload);

      // encode execute Payload on the UP
      const executePayload = await UniversalProfileContract.methods
        .execute(
          0, // OPERATION CALL
          this.#UPAddress, // or vault address?
          0, // value to transfer
          setDataPayload
        )
        .encodeABI();
      console.log('executePayload', executePayload);

      // getting the Key Manager address from UP
      const myKeyManagerAddress = await UniversalProfileContract.methods.owner().call();
      console.log('myKeyManagerAddress', myKeyManagerAddress);

      let myKM = new web3.eth.Contract(LSP6KeyManagerContract.abi, myKeyManagerAddress);

      // // execute the executePayload on the KM
      let receipt = await myKM.methods.execute(setDataPayload).send({
        from: this.#EOA.address,
        gasLimit: 6_000_000,
      });
      console.log('executePayload receipt', receipt);

      return receipt;
    } catch (err) {
      console.warn('error execution : ', err);
      return;
    }
  }
  /**
   * Executes a dataPayload on a vault bythe UP with the Key Manager
   * @param {string} dataPayload - the encoded data that will be executed
   * @param {string} destinationAddress - the contract destination address
   * @param {string} vaultAddress - the vault address
   * @returns returns the transaction receipt
   */
  async executePayloadOnVault(dataPayload, destinationAddress, vaultAddress) {
    console.log('dataPayload', dataPayload);

    const UniversalProfileContract = new web3.eth.Contract(
      LSP0UniversalProfile.abi,
      this.#UPAddress
    );
    const VaultContract = new web3.eth.Contract(LSP9VaultContract.abi, vaultAddress);
    const executePayloadVault = await VaultContract.methods
      .execute(
        0, // OPERATION CALL
        destinationAddress,
        0, // value to transfer
        dataPayload
      )
      .encodeABI();
    console.log('executePayloadVault', executePayloadVault);

    const executePayloadUP = await VaultContract.methods
      .execute(
        0, // OPERATION CALL
        vaultAddress, // address of the contract we want to interact with
        0, // value to transfer
        executePayloadVault
      )
      .encodeABI();

    console.log('executePayloadUP', executePayloadUP);

    // getting the Key Manager address from UP
    const keyManagerAddress = await UniversalProfileContract.methods.owner().call();

    console.log('keyManagerAddress', keyManagerAddress);

    let LSP6KeyManagerInstance = new web3.eth.Contract(
      LSP6KeyManagerContract.abi,
      keyManagerAddress
    );

    // execute the executePayload on the KM
    let receipt = await LSP6KeyManagerInstance.methods.execute(executePayloadUP).send({
      from: this.#EOA.address,
      gasLimit: 6_000_000,
    });

    console.log('executePayload receipt', receipt);
    return receipt;
  }

  /**
   * Executes a dataPayload on the UP with the Key Manager
   * @param {string} dataPayload - the encoded data that will be executed
   * @param {string} destinationAddress - the contract destination address
   * @param {string} contractAddress - the UP address
   * @returns returns the transaction receipt
   */
  async executePayload(dataPayload, destinationAddress, contractAddress) {
    console.log('dataPayload', dataPayload);

    const UniversalProfileContract = new web3.eth.Contract(
      LSP0UniversalProfile.abi,
      contractAddress
    );
    const executePayload = await UniversalProfileContract.methods
      .execute(
        0, // OPERATION CALL
        destinationAddress,
        0, // value to transfer
        dataPayload
      )
      .encodeABI();
    console.log('executePayload', executePayload);

    // getting the Key Manager address from UP
    const keyManagerAddress = await UniversalProfileContract.methods.owner().call();

    console.log('keyManagerAddress', keyManagerAddress);

    let LSP6KeyManagerInstance = new web3.eth.Contract(
      LSP6KeyManagerContract.abi,
      keyManagerAddress
    );

    // execute the executePayload on the KM
    let receipt = await LSP6KeyManagerInstance.methods.execute(executePayload).send({
      from: this.#EOA.address,
      gasLimit: 6_000_000,
    });

    console.log('executePayload receipt', receipt);
    return receipt;
  }

  /**
   * Transfers a LSP7 token from a UP or a vault
   * @param {string} fromAccountAddress - the address the token from, can be a vault address
   * @param {string} toAccountAddress - the address the token to
   * @param {string} assetAddress - the asset address
   * @param {string} _amount - the amount to transfer
   * @param {boolean} isFromVault - flag that determines if is from vault
   * @returns returns the transaction receipt
   * https://github.com/lukso-network/example-dapp-lsps/blob/main/src/components/SendModalComponent.vue#L143
   */
  async transferLSP7Token(
    fromAccountAddress,
    toAccountAddress,
    tokenAddress,
    _amount,
    isFromVault
  ) {
    const amount = web3.utils.toWei(_amount);
    console.log(
      '***** transferLSP7Token *****',
      fromAccountAddress,
      toAccountAddress,
      tokenAddress,
      amount
    );
    const lsp7DigitalAssetInstance = new web3.eth.Contract(
      LSP7DigitalAssetContract.abi,
      tokenAddress
    );
    const dataPayload = await lsp7DigitalAssetInstance.methods
      .transfer(fromAccountAddress, toAccountAddress, amount, false, '0x')
      .encodeABI();

    let result;
    if (isFromVault) {
      result = await this.executePayloadOnVault(dataPayload, tokenAddress, fromAccountAddress);
    } else {
      result = await this.executePayload(dataPayload, tokenAddress, fromAccountAddress);
    }

    console.log('Result sendTokenFromVault  : ', result);
    return result;
  }

  /**
   * Transfers a LSP8 token from a UP or a vault
   * @param {string} fromAccountAddress - the address the token from, can be a vault address
   * @param {string} toAccountAddress - the address the token to
   * @param {string} assetAddress - the asset address
   * @param {string} tokenId - the token id
   * @param {boolean} isFromVault - flag that determines if is from vault
   * @returns returns the transaction receipt
   * https://github.com/lukso-network/example-dapp-lsps/blob/main/src/components/SendModalComponent.vue#L143
   */
  async transferLSP8Token(
    fromAccountAddress,
    toAccountAddress,
    assetAddress,
    tokenId,
    isFromVault
  ) {
    console.log(
      '***** transferLSP8Token *****',
      fromAccountAddress,
      toAccountAddress,
      assetAddress,
      tokenId
    );

    const LSP8IdentifiableDigitalAssetInstance = new web3.eth.Contract(
      LSP8IdentifiableDigitalAssetContract.abi,
      assetAddress
    );
    console.log('LSP8IdentifiableDigitalAssetInstance', LSP8IdentifiableDigitalAssetInstance);

    try {
      const force = true; // When set to TRUE, to may be any address; when set to FALSE to must be a contract that supports LSP1 UniversalReceiver and not revert.
      const data = '0x';

      const dataPayload = await LSP8IdentifiableDigitalAssetInstance.methods
        .transfer(fromAccountAddress, toAccountAddress, tokenId, force, data)
        .encodeABI();

      let result;
      if (isFromVault) {
        result = await this.executePayloadOnVault(dataPayload, assetAddress, fromAccountAddress);
      } else {
        result = await this.executePayload(dataPayload, assetAddress, fromAccountAddress);
      }

      console.log('Result sendTokenFromVault  : ', result);
      return result;
    } catch (error) {
      return console.log('Error transferring LSP8', error);
    }
  }

  /**
   * Gets a list of the accountAddress owned tokenIds of a LSP8 assetAddress
   * @param {string} accountAddress - the address to get the list from
   * @param {string} tokenAddress - the address to get the ids list from
   * @returns returns a list of the LSP8 token ids.
   */
  async tokenIdsOf(accountAddress, assetAddress) {
    const LSP8IdentifiableDigitalAssetInstance = new web3.eth.Contract(
      LSP8IdentifiableDigitalAssetContract.abi,
      assetAddress
    );
    const tokenIds = await LSP8IdentifiableDigitalAssetInstance.methods
      .tokenIdsOf(accountAddress)
      .call();

    return tokenIds;
  }

  /**
   * Gets the balance of tokenAddress of accountAddress
   * @param {string} accountAddress - the address of the token owner
   * @param {string} tokenAddress - the address to get the balance from
   * @returns returns the balance.
   */
  async balanceOf(accountAddress, tokenAddress) {
    console.log(`**** balance of ${accountAddress} of token ${tokenAddress} **** `);

    const lsp7DigitalAssetInstance = new web3.eth.Contract(
      LSP7DigitalAssetContract.abi,
      tokenAddress
    );

    const balance = await lsp7DigitalAssetInstance.methods.balanceOf(accountAddress).call();

    console.log('Result balanceOf  : ', balance);
    return balance;
  }
  /**
   * Gets the list of the ownerAddress current issued assets
   * @param {string} ownerAddress - the address to get the list from
   * @returns returns a list with the issue d asset address .
   */
  async getIssuedAssetsOfAddress(ownerAddress) {
    let LSP12IssuedAssets = await this.fetchLSP12(ownerAddress);
    return LSP12IssuedAssets.value;
  }

  /**
   * Gets the list of the ownerAddress current received assets
   * @param {string} ownerAddress - the address to get the list from
   * @returns returns a list with the asset address, assetType and tokenId if LSP8.
   */
  async getAssetsOfAddress(ownerAddress) {
    let LSP5ReceivedAssets = await this.fetchLSP5(ownerAddress);
    const assetsList = [];

    for (let i = 0; i < LSP5ReceivedAssets?.value?.length; i++) {
      const assetAddress = LSP5ReceivedAssets.value[i];

      const lsp8IdentifiableDigitalAssetContract = new web3.eth.Contract(
        LSP8IdentifiableDigitalAssetContract.abi,
        assetAddress
      );

      const [isLSP7, isLSP8] = await Promise.all([
        lsp8IdentifiableDigitalAssetContract.methods
          .supportsInterface(INTERFACE_IDS.LSP7DigitalAsset)
          .call(),
        lsp8IdentifiableDigitalAssetContract.methods
          .supportsInterface(INTERFACE_IDS.LSP8IdentifiableDigitalAsset)
          .call(),
      ]);
      if (isLSP8) {
        const tokenIds = await lsp8IdentifiableDigitalAssetContract.methods
          .tokenIdsOf(ownerAddress)
          .call();
        tokenIds.forEach((tokenId) => {
          assetsList.push({
            assetAddress: assetAddress,
            assetType: { isLSP7, isLSP8 },
            tokenId,
          });
        });
      } else {
        assetsList.push({
          assetAddress: assetAddress,
          assetType: { isLSP7, isLSP8 },
          tokenId: null,
        });
      }
    }
    return assetsList;
  }

  /**
   * Gets the metadata from a given assetAddress and a ownerAddress, for LSP8 a tokenId is required as well
   * @param {string} assetAddress - The asset address.
   * @param {string} ownerAddress - The owner address.
   * @param {string} tokenId - The token id of the asset if assetType is LSP8.
   * @param {string} assetType - The asset type.
   * @returns the asset metadata
   */

  async getMetadata(assetAddress, ownerAddress, tokenId, assetType) {
    let LSP4DigitalAsset;
    let balanceOf = 1;
    // get the data based on the assetType
    if (assetType.isLSP8) {
      LSP4DigitalAsset = await this.getDataKey(
        LSP8_DATA_KEY(tokenId),
        assetAddress,
        LSP8IdentifiableDigitalAssetSchema
      );
    } else {
      LSP4DigitalAsset = await this.getDataKey(
        ['LSP4TokenName', 'LSP4TokenSymbol', 'LSP4Metadata'],
        assetAddress,
        LSP4DigitalAssetSchema
      );
      // for LSP7 we get the balance from the contract
      const lsp4DigitalAssetContract = new web3.eth.Contract(
        LSP7DigitalAssetContract.abi,
        assetAddress
      );
      balanceOf = web3.utils.fromWei(
        await lsp4DigitalAssetContract.methods.balanceOf(ownerAddress).call()
      );
    }
    const tokenName = LSP4DigitalAsset[0].value;
    const tokenSymbol = LSP4DigitalAsset[1].value;
    const metadata = LSP4DigitalAsset[2].value;
    const assetImagePath = LSP4DigitalAsset[2].value.LSP4Metadata.icon[0].url.replace(
      'ipfs://',
      IPFS_GATEWAY
    );

    return {
      assetAddress,
      tokenName,
      tokenSymbol,
      metadata,
      assetImagePath,
      balanceOf,
      assetType,
      tokenId,
    };
  }
}
