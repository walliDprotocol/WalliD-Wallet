const { LSPFactory } = require('@lukso/lsp-factory.js');
const { ERC725 } = require('@erc725/erc725.js');
const RPC_ENDPOINT = 'https://rpc.l16.lukso.network';
const PRIVATE_KEY =
  '0x2b8170b52c7ddbdc7d48f0d0ee9cb39660f1a972775079cfe9e3f91529026293';

// lukso private key
// 0xa306f24e85b8fcc288eaa9c473377733899ad03f385dd94d0da98c8e16def4eb
// profile
// 0x1ca406412696d6330B6F7df5B354585177209498

require('isomorphic-fetch');
const IPFS_GATEWAY = 'https://2eff.lukso.dev/ipfs/';

import Web3 from 'web3';
const web3 = new Web3(RPC_ENDPOINT);
// const myEOA = web3.eth.accounts.wallet.add(PRIVATE_KEY);

import { ethers } from 'ethers';

// Contracts
import LSP0UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import LSP1UniversalReceiverDelegateVaultContract from '@lukso/lsp-smart-contracts/artifacts/LSP1UniversalReceiverDelegateVault.json';
import LSP6KeyManagerContract from '@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json';
import LSP7MintableContract from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json';
import LSP9VaultContract from '@lukso/lsp-smart-contracts/artifacts/LSP9Vault.json';

// Schemas
import LSP6KeyManagerSchema from '@erc725/erc725.js/schemas/LSP6KeyManager.json';
import LSP10VaultSchema from '@erc725/erc725.js/schemas/LSP10ReceivedVaults.json';

const constants = require('@lukso/lsp-smart-contracts/constants.js');

// Data Keys
const URD_DATA_KEY = constants.ERC725YKeys.LSP0.LSP1UniversalReceiverDelegate;
const LSP10_DATA_KEY = 'LSP10Vaults[]';

export default class LuksoController {
  #lspFactory;
  #UPAddress;
  #KMAddress;
  #EOA;

  constructor({ KMAddress, UPAddress, EOA }) {
    console.log('UPAddress', UPAddress);

    this.#UPAddress = UPAddress;
    this.#KMAddress = KMAddress;
    this.#EOA = EOA;

    this.#lspFactory = new LSPFactory(RPC_ENDPOINT, {
      deployKey: PRIVATE_KEY, // priv_key for 0xfec13efcea97326cdfaa3331904fa7e11684460d
      chainId: 2828,
    });
  }

  serialize() {
    // if (this.#lspFactory.length == 0) {
    //   return JSON.stringify([]);
    // }
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

  encodeData({ data, schema, UPAddress }) {
    const config = { ipfsGateway: IPFS_GATEWAY };
    const provider = new Web3.providers.HttpProvider(RPC_ENDPOINT);

    const ERC725Object = new ERC725(schema, UPAddress, provider, config);

    return ERC725Object.encodeData(data);
  }

  createUniversalProfile(address) {
    return this.#lspFactory.UniversalProfile.deploy({
      controllerAddresses: [this.#EOA.address], // our EOA that will be controlling the UP
      lsp3Profile: {
        name: 'My Universal Profile',
        description: 'My Cool Universal Profile',
        tags: ['Public Profile'],
        links: [
          {
            title: 'My Website',
            url: 'https://my-website.com',
          },
        ],
      },
    });
  }
  async checkOwnership(ownerAddress, UPAddressToImport) {
    console.log('checkOwnership', ownerAddress, UPAddressToImport);

    let AddressPermissionsArray = await this.getDataKey(
      'AddressPermissions[]',
      UPAddressToImport,
      LSP6KeyManagerSchema
    );

    console.log(AddressPermissionsArray);
    let isOwner = AddressPermissionsArray.value.find((a) => {
      return ethers.utils.getAddress(ownerAddress) == a;
    });

    if (isOwner) {
      const myUP = new web3.eth.Contract(
        LSP0UniversalProfile.abi,
        UPAddressToImport
      );
      const keyManagerAddress = await myUP.methods.owner().call();

      console.log(
        ethers.utils.getAddress(ownerAddress),
        'km',
        keyManagerAddress
      );

      return {
        LSP0ERC725Account: { address: UPAddressToImport },
        LSP6KeyManager: { address: keyManagerAddress },
      };
    }
  }

  initEOA(privateKey) {
    const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);

    // const wallet =
    // this.#EOA = new ethers.Wallet(privateKey, provider);
    //
    this.#EOA = web3.eth.accounts.wallet.add(privateKey);
  }
  setUniversalProfileAddress(UPAddress) {
    this.#UPAddress = UPAddress;
  }
  setKeyManagerAddress(KMAddress) {
    this.#KMAddress = KMAddress;
  }

  getUniversalProfileAddress() {
    return this.#UPAddress;
  }
  getKeyManagerAddress() {
    return this.#KMAddress;
  }

  async fetchProfile(addressToFetch) {
    return await this.getDataKey('', addressToFetch);
  }

  async fetchVaults(addressToFetch) {
    return await this.getDataKey(
      LSP10_DATA_KEY,
      addressToFetch,
      LSP10VaultSchema
    );
  }

  async getDataKey(dataKey, address, _schema) {
    // Parameters for ERC725 Instance
    const schema =
      _schema ||
      require('@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json');
    const config = { ipfsGateway: IPFS_GATEWAY };
    const provider = new Web3.providers.HttpProvider(RPC_ENDPOINT);
    try {
      const profile = new ERC725(schema, address, provider, config);
      return await profile.fetchData(dataKey);
    } catch (error) {
      return console.log('This is not an ERC725 Contract', error);
    }
  }

  async mintLSP7Tokens() {
    // deploy + create an instance of the token contract

    let myToken = {
      LSP7DigitalAsset: {
        address: '0x09372CD63460a4B67C7592C58c8e8c8Ac43e564C',
      },
    };
    //  await this.#lspFactory.LSP7DigitalAsset.deploy({
    //   name: 'MyWalliD Token', // token name
    //   symbol: 'WALLID', // token symbol
    //   controllerAddress: this.#UPAddress, // new owner, who will mint later
    //   isNFT: false, // isNFT = TRUE, means NOT divisble, decimals = 0)
    // });

    console.log('myToken', myToken);
    console.log('this.#lspFactory', this.#lspFactory);
    console.log('this.#lspFactory.signer', this.#lspFactory.options.signer);

    const lsp7Factory = await new ethers.Contract(
      myToken.LSP7DigitalAsset.address,
      LSP7Mintable.abi,
      this.#lspFactory.options.signer
    );

    console.log('lsp7Factory', lsp7Factory);
    console.log('lsp7Factory', await lsp7Factory.owner());

    await lsp7Factory
      .connect(this.#lspFactory.options.signer)
      .mint(this.#UPAddress, 100, false, '0x');
  }

  async transferLSP7Tokens() {
    // Instance KeyManager
    const KeyManager = new web3.eth.Contract(
      KeyManagerContract.abi,
      keyManagerAddress
    );
  }

  async contractFactory(contractJSON, args = []) {
    console.log('Deploy contractJSON ', this.#EOA.address, contractJSON, args);

    // const contractFactory = new ethers.ContractFactory(
    //   contractJSON.abi,
    //   contractJSON.bytecode,
    //   this.#EOA
    // );

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

    // let contract = await contractFactory.deploy(...args);
    // await contract.deployed();

    // console.log('Deployed: ', contract);

    // return contract.address;
  }

  async deployingUniversalReceiverDelegate() {
    return this.contractFactory(LSP1UniversalReceiverDelegateVaultContract);
  }

  async deployVault(UPAddress) {
    return this.contractFactory(LSP9VaultContract, [UPAddress]);
  }

  // tested
  async createVault() {
    // // create an instance
    // const web3 = new Web3(new Web3.providers.HttpProvider(RPC_ENDPOINT));
    // const myEOA = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);

    // const myUniversalProfileAddress =
    // '0xD789d7E2Efe69302E94AA6F480bcD44D159f5a25'; // address of the UP
    // const myVaultAddress = '0xEa4f7cE3d7D022f3b703cFCA860256E9F53E6db0'; // address of the Vault
    // const myURDAddress = '0x63cCCFE257428121789FCCF9C66d553e54028371'; // address of the URD of the Vault

    // deploy the vault contract
    let vaultContractAddress = await this.deployVault(
      this.#UPAddress // address of the UniversalProfile
    );

    console.log('LSP9VaultFactory contract', vaultContractAddress);

    let vaultURDAddress = await this.deployingUniversalReceiverDelegate();

    console.log('vaultURDAddress contract', vaultURDAddress);

    // TESTING

    // const vaultInterface = new ethers.utils.Interface(LSP9VaultContract.abi);

    // // create an instance of the UP
    // const UniversalProfileInterface = new ethers.utils.Interface(
    //   LSP0UniversalProfile.abi
    // );

    // // encode setData Payload on the Vault
    // console.log('values', URD_DATA_KEY, vaultURDAddress);

    // const setDataPayload = await vaultInterface.encodeFunctionData(
    //   'setData(bytes32,bytes)',
    //   [URD_DATA_KEY, vaultURDAddress]
    // ); // Any other information can be stored here
    // console.log('setDataPayload', setDataPayload);

    // // encode execute Payload on the UP
    // const executePayload = await UniversalProfileInterface.encodeFunctionData(
    //   'execute',
    //   [
    //     0, // OPERATION CALL
    //     vaultContractAddress,
    //     0, // value to transfer
    //     setDataPayload,
    //   ]
    // );
    // console.log('executePayload', executePayload);
    // // create an instance of the KeyManager
    // const LSP6KeyManagerInstance = new ethers.Contract(
    //   this.#KMAddress,
    //   LSP6KeyManagerContract.abi,
    //   this.#EOA
    // );

    // // execute the executePayload on the KM
    // let result = await LSP6KeyManagerInstance.execute(executePayload);

    // console.log('Result  ', result);

    // Vitor code

    const myVault = new web3.eth.Contract(
      LSP9VaultContract.abi,
      vaultContractAddress
    );

    // create an instance of the UP
    const myUP = new web3.eth.Contract(
      LSP0UniversalProfile.abi,
      this.#UPAddress
    );

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
    let myKM = new web3.eth.Contract(
      LSP6KeyManagerContract.abi,
      myKeyManagerAddress
    );

    // execute the executePayload on the KM
    let result = await myKM.methods.execute(executePayload).send({
      from: this.#EOA.address,
      gasLimit: 6_000_000,
    });

    console.log('Result  ', result);

    return vaultContractAddress;
  }

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
      // const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);

      // const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

      console.log('LSP0UniversalProfile', LSP0UniversalProfile);

      const UniversalProfileContract = new web3.eth.Contract(
        LSP0UniversalProfile.abi,
        this.#UPAddress
      );
      // const UniversalProfileInterface = new ethers.utils.Interface(
      //   // this.#UPAddress,
      //   LSP0UniversalProfile.abi
      //   // wallet
      // );
      // console.log('UniversalProfileInterface', UniversalProfileInterface);

      // encode setData Payload on the Vault
      // const setDataPayload = await UniversalProfileInterface.encodeFunctionData(
      //   'setData(bytes32[],bytes[])',

      //   [encodedErc725Data.keys, encodedErc725Data.values]
      // );

      const setDataPayload = await UniversalProfileContract.methods[
        'setData(bytes32[],bytes[])'
      ](encodedErc725Data.keys, encodedErc725Data.values).encodeABI();

      console.log('setDataPayload', setDataPayload);

      // encode execute Payload on the UP
      // const executePayload = await UniversalProfileInterface.encodeFunctionData(
      //   'execute',
      //   [
      //     0, // OPERATION CALL
      //     this.#UPAddress,
      //     0, // value to transfer
      //     setDataPayload,
      //   ]
      // );
      const executePayload = await UniversalProfileContract.methods
        .execute(
          0, // OPERATION CALL
          this.#UPAddress,
          0, // value to transfer
          setDataPayload
        )
        .encodeABI();
      console.log('executePayload', executePayload);

      // getting the Key Manager address from UP

      // create an instance of the KeyManager
      // const LSP6KeyManagerInstance = new ethers.Contract(
      //   this.#KMAddress,
      //   LSP6KeyManagerContract.abi,
      //   wallet
      // );

      const myKeyManagerAddress = await UniversalProfileContract.methods
        .owner()
        .call();
      console.log('myKeyManagerAddress', myKeyManagerAddress);

      let myKM = new web3.eth.Contract(
        LSP6KeyManagerContract.abi,
        myKeyManagerAddress
      );

      // // execute the executePayload on the KM

      // let receipt = await myKM.methods.execute(executePayload).send({
      let receipt = await myKM.methods.execute(setDataPayload).send({
        from: this.#EOA.address,
        gasLimit: 6_000_000,
      });
      // await LSP6KeyManagerInstance.execute(executePayload, {
      //   from: myEOA.address,
      //   gasLimit: 5_000_000,
      // });
      console.log('executePayload receipt', receipt);

      return receipt;
      //////////////////////////////////////////////////////
    } catch (err) {
      console.warn('error execution : ', err);
      return;
    }
  }
}
