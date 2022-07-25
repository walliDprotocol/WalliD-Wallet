import {
  AccountTrackerController,
  AssetsContractController,
  TokenListController,
  ControllerMessenger,
  ComposableController,
  CurrencyRateController,
  KeyringController,
  PersonalMessageManager,
  MessageManager,
  NetworkController,
  PreferencesController,
  TokenBalancesController,
  TokenRatesController,
  TypedMessageManager,
  WalletDevice,
  GasFeeController,
  TokensController,
  CollectiblesController,
  TokenDetectionController,
  CollectibleDetectionController,
} from '@metamask/controllers';
// import Encryptor from './Encryptor';
import { toChecksumAddress } from 'ethereumjs-util';
import AppConstants from './AppConstants';
// import { store } from '../scripts/lib/store';
// import { isZero } from '../util/lodash';

const BSC_CHAIN_ID = 56;
const POLYGON_CHAIN_ID = 137;

const NON_EMPTY = 'NON_EMPTY';

// const encryptor = new Encryptor();
let currentChainId;

/**
 * Core controller responsible for composing other metamask controllers together
 * and exposing convenience methods for common wallet operations.
 */
class Engine {
  /**
   * ComposableController reference containing all child controllers
   */
  datamodel;

  /**
   * Object containing the info for the latest incoming tx block
   * for each address and network
   */
  lastIncomingTxBlockInfo;

  /**
   * Creates a CoreController instance
   */
  constructor(initialState = {}) {
    if (!Engine.instance) {
      const preferencesController = new PreferencesController(
        {},
        {
          ipfsGateway: AppConstants.IPFS_DEFAULT_GATEWAY_URL,
          useStaticTokenList:
            initialState?.PreferencesController?.useStaticTokenList ===
              undefined ||
            initialState.PreferencesController.useStaticTokenList,
          // TODO: Use previous value when preferences UI is available
          useCollectibleDetection: true,
          openSeaEnabled: true,
        }
      );
      const networkController = new NetworkController({
        infuraProjectId: process.env.MM_INFURA_PROJECT_ID || NON_EMPTY,
        providerConfig: {
          getAccounts: (end, payload) => {
            // const { approvedHosts, privacyMode } = store.getState();
            const isEnabled = true; // !privacyMode || approvedHosts[payload.hostname];
            const { KeyringController } = this.context;
            const isUnlocked = KeyringController.isUnlocked();
            const selectedAddress = this.context.PreferencesController.state
              .selectedAddress;
            end(
              null,
              isUnlocked && isEnabled && selectedAddress
                ? [selectedAddress]
                : []
            );
          },
        },
      });
      const assetsContractController = new AssetsContractController();
      const collectiblesController = new CollectiblesController(
        {
          onPreferencesStateChange: (listener) =>
            preferencesController.subscribe(listener),
          onNetworkStateChange: (listener) =>
            networkController.subscribe(listener),
          getAssetName: assetsContractController.getAssetName.bind(
            assetsContractController
          ),
          getAssetSymbol: assetsContractController.getAssetSymbol.bind(
            assetsContractController
          ),
          getCollectibleTokenURI: assetsContractController.getCollectibleTokenURI.bind(
            assetsContractController
          ),
          getOwnerOf: assetsContractController.getOwnerOf.bind(
            assetsContractController
          ),
          balanceOfERC1155Collectible: assetsContractController.balanceOfERC1155Collectible.bind(
            assetsContractController
          ),
          uriERC1155Collectible: assetsContractController.uriERC1155Collectible.bind(
            assetsContractController
          ),
        },
        {
          useIPFSSubdomains: false,
        }
      );
      const tokensController = new TokensController({
        onPreferencesStateChange: (listener) =>
          preferencesController.subscribe(listener),
        onNetworkStateChange: (listener) =>
          networkController.subscribe(listener),
        config: { provider: networkController.provider },
      });
      this.controllerMessenger = new ControllerMessenger();
      const tokenListController = new TokenListController({
        chainId: networkController.provider.chainId,
        onNetworkStateChange: (listener) =>
          networkController.subscribe(listener),
        useStaticTokenList: preferencesController.state.useStaticTokenList,
        onPreferencesStateChange: (listener) =>
          preferencesController.subscribe(listener),
        messenger: this.controllerMessenger,
      });
      const currencyRateController = new CurrencyRateController({
        messenger: this.controllerMessenger,
        state: initialState.CurrencyRateController,
      });
      currencyRateController.start();

      const gasFeeController = new GasFeeController({
        messenger: this.controllerMessenger,
        getProvider: () => networkController.provider,
        onNetworkStateChange: (listener) =>
          networkController.subscribe(listener),
        getCurrentNetworkEIP1559Compatibility: async () =>
          await networkController.getEIP1559Compatibility(),
        getChainId: () => networkController.state.provider.chainId,
        getCurrentNetworkLegacyGasAPICompatibility: () => {
          const chainId = networkController.state.provider.chainId;
          return (
            isMainnetByChainId(chainId) ||
            chainId === BSC_CHAIN_ID ||
            chainId === POLYGON_CHAIN_ID
          );
        },
        legacyAPIEndpoint:
          'https://gas-api.metaswap.codefi.network/networks/<chain_id>/gasPrices',
        EIP1559APIEndpoint:
          'https://gas-api.metaswap.codefi.network/networks/<chain_id>/suggestedGasFees',
      });

      const controllers = [
        new KeyringController(
          {
            removeIdentity: preferencesController.removeIdentity.bind(
              preferencesController
            ),
            syncIdentities: preferencesController.syncIdentities.bind(
              preferencesController
            ),
            updateIdentities: preferencesController.updateIdentities.bind(
              preferencesController
            ),
            setSelectedAddress: preferencesController.setSelectedAddress.bind(
              preferencesController
            ),
          },
          {},
          initialState.KeyringController
        ),
        new AccountTrackerController({
          onPreferencesStateChange: (listener) =>
            preferencesController.subscribe(listener),
          getIdentities: () => preferencesController.state.identities,
        }),
        assetsContractController,
        collectiblesController,
        tokensController,
        tokenListController,
        new TokenDetectionController({
          onTokensStateChange: (listener) =>
            tokensController.subscribe(listener),
          onPreferencesStateChange: (listener) =>
            preferencesController.subscribe(listener),
          onNetworkStateChange: (listener) =>
            networkController.subscribe(listener),
          addTokens: tokensController.addTokens.bind(tokensController),
          getTokensState: () => tokensController.state,
          getTokenListState: () => tokenListController.state,
          getBalancesInSingleCall: assetsContractController.getBalancesInSingleCall.bind(
            assetsContractController
          ),
        }),
        new CollectibleDetectionController({
          onCollectiblesStateChange: (listener) =>
            collectiblesController.subscribe(listener),
          onPreferencesStateChange: (listener) =>
            preferencesController.subscribe(listener),
          onNetworkStateChange: (listener) =>
            networkController.subscribe(listener),
          getOpenSeaApiKey: () => collectiblesController.openSeaApiKey,
          addCollectible: collectiblesController.addCollectible.bind(
            collectiblesController
          ),
          getCollectiblesState: () => collectiblesController.state,
        }),
        currencyRateController,
        new PersonalMessageManager(),
        new MessageManager(),
        networkController,
        preferencesController,
        new TokenBalancesController(
          {
            onTokensStateChange: (listener) =>
              tokensController.subscribe(listener),
            getSelectedAddress: () =>
              preferencesController.state.selectedAddress,
            getBalanceOf: assetsContractController.getBalanceOf.bind(
              assetsContractController
            ),
          },
          { interval: 10000 }
        ),
        new TokenRatesController({
          onTokensStateChange: (listener) =>
            tokensController.subscribe(listener),
          onCurrencyRateStateChange: (listener) =>
            this.controllerMessenger.subscribe(
              `${currencyRateController.name}:stateChange`,
              listener
            ),
          onNetworkStateChange: (listener) =>
            networkController.subscribe(listener),
        }),
        new TypedMessageManager(),
        gasFeeController,
      ];
      // set initial state
      // TODO: Pass initial state into each controller constructor instead
      // This is being set post-construction for now to ensure it's functionally equivalent with
      // how the `ComponsedController` used to set initial state.
      //
      // The check for `controller.subscribe !== undefined` is to filter out BaseControllerV2
      // controllers. They should be initialized via the constructor instead.
      for (const controller of controllers) {
        if (
          initialState[controller.name] &&
          controller.subscribe !== undefined
        ) {
          controller.update(initialState[controller.name]);
        }
      }
      this.datamodel = new ComposableController(
        controllers,
        this.controllerMessenger
      );
      this.context = controllers.reduce((context, controller) => {
        context[controller.name] = controller;
        return context;
      }, {});

      const {
        CollectiblesController: collectibles,
        KeyringController: keyring,
        NetworkController: network,
      } = this.context;

      collectibles.setApiKey(process.env.MM_OPENSEA_KEY);
      network.refreshNetwork();
      transaction.configure({ sign: keyring.signTransaction.bind(keyring) });
      network.subscribe((state) => {
        if (
          state.network !== 'loading' &&
          state.provider.chainId !== currentChainId
        ) {
          // We should add a state or event emitter saying the provider changed
          setTimeout(() => {
            this.configureControllersOnNetworkChange();
            currentChainId = state.provider.chainId;
          }, 500);
        }
      });
      this.configureControllersOnNetworkChange();
      this.startPolling();
      Engine.instance = this;
    }
    return Engine.instance;
  }

  startPolling() {
    const {
      CollectibleDetectionController,
      TokenDetectionController,
      TokenListController,
    } = this.context;
    TokenListController.start();
    CollectibleDetectionController.start();
    TokenDetectionController.start();
  }

  configureControllersOnNetworkChange() {
    const {
      AccountTrackerController,
      AssetsContractController,
      TokenDetectionController,
      CollectibleDetectionController,
      NetworkController: { provider, state: NetworkControllerState },
    } = this.context;

    provider.sendAsync = provider.sendAsync.bind(provider);
    AccountTrackerController.configure({ provider });
    AssetsContractController.configure({ provider });

    TokenDetectionController.detectTokens();
    CollectibleDetectionController.detectCollectibles();
    AccountTrackerController.refresh();
  }

  /**
   * Returns true or false whether the user has funds or not
   */
  // hasFunds = () => {
  //   try {
  //     // const {
  //     //   engine: { backgroundState },
  //     // } = store.getState();
  //     const collectibles = backgroundState.CollectiblesController.collectibles;
  //     const tokens = backgroundState.TokensController.tokens;
  //     const tokenBalances =
  //       backgroundState.TokenBalancesController.contractBalances;

  //     let tokenFound = false;
  //     tokens.forEach((token) => {
  //       if (
  //         tokenBalances[token.address] &&
  //         !isZero(tokenBalances[token.address])
  //       ) {
  //         tokenFound = true;
  //       }
  //     });

  //     const fiatBalance = this.getTotalFiatAccountBalance();

  //     return fiatBalance > 0 || tokenFound || collectibles.length > 0;
  //   } catch (e) {
  //     console.log('Error while getting user funds', e);
  //   }
  // };

  resetState = async () => {
    // Whenever we are gonna start a new wallet
    // either imported or created, we need to
    // get rid of the old data from state
    const {
      TokensController,
      CollectiblesController,
      TokenBalancesController,
      TokenRatesController,
    } = this.context;

    //Clear assets info
    TokensController.update({
      allTokens: {},
      ignoredTokens: [],
      tokens: [],
      suggestedAssets: [],
    });
    CollectiblesController.update({
      allCollectibleContracts: {},
      allCollectibles: {},
      collectibleContracts: [],
      collectibles: [],
      ignoredCollectibles: [],
    });

    TokensController.update({
      allTokens: {},
      allIgnoredTokens: {},
      ignoredTokens: [],
      tokens: [],
      suggestedAssets: [],
    });

    TokenBalancesController.update({ contractBalances: {} });
    TokenRatesController.update({ contractExchangeRates: {} });
  };

  sync = async ({
    accounts,
    preferences,
    network,
    transactions,
    seed,
    pass,
    importedAccounts,
    tokens: { allTokens, allIgnoredTokens },
  }) => {
    const {
      KeyringController,
      PreferencesController,
      NetworkController,
      TokensController,
    } = this.context;

    // Select same network ?
    await NetworkController.setProviderType(network.provider.type);

    // Recreate accounts
    await KeyringController.createNewVaultAndRestore(pass, seed);
    for (let i = 0; i < accounts.hd.length - 1; i++) {
      await KeyringController.addNewAccount();
    }

    // Recreate imported accounts
    if (importedAccounts) {
      for (let i = 0; i < importedAccounts.length; i++) {
        await KeyringController.importAccountWithStrategy('privateKey', [
          importedAccounts[i],
        ]);
      }
    }

    // Restore tokens
    await TokensController.update({ allTokens, allIgnoredTokens });

    // Restore preferences
    const updatedPref = { ...preferences, identities: {} };
    Object.keys(preferences.identities).forEach((address) => {
      const checksummedAddress = toChecksumAddress(address);
      if (
        accounts.hd.includes(checksummedAddress) ||
        accounts.simpleKeyPair.includes(checksummedAddress)
      ) {
        updatedPref.identities[checksummedAddress] =
          preferences.identities[address];
        updatedPref.identities[checksummedAddress].importTime = Date.now();
      }
    });
    await PreferencesController.update(updatedPref);

    if (accounts.hd.includes(toChecksumAddress(updatedPref.selectedAddress))) {
      PreferencesController.setSelectedAddress(updatedPref.selectedAddress);
    } else {
      PreferencesController.setSelectedAddress(accounts.hd[0]);
    }

    const mapTx = ({
      id,
      metamaskNetworkId,
      origin,
      status,
      time,
      hash,
      rawTx,
      txParams,
    }) => ({
      id,
      networkID: metamaskNetworkId,
      origin,
      status,
      time,
      transactionHash: hash,
      rawTx,
      transaction: { ...txParams },
    });

    return true;
  };
}

let instance;

export default {
  get context() {
    return instance && instance.context;
  },
  get controllerMessenger() {
    return instance && instance.controllerMessenger;
  },
  get state() {
    const {
      AccountTrackerController,
      AssetsContractController,
      CollectiblesController,
      TokenListController,
      CurrencyRateController,
      KeyringController,
      PersonalMessageManager,
      NetworkController,
      PreferencesController,
      TokenBalancesController,
      TokenRatesController,
      TypedMessageManager,
      GasFeeController,
      TokensController,
      TokenDetectionController,
      CollectibleDetectionController,
    } = instance.datamodel.state;

    // normalize `null` currencyRate to `0`
    // TODO: handle `null` currencyRate by hiding fiat values instead
    const modifiedCurrencyRateControllerState = {
      ...CurrencyRateController,
      conversionRate:
        CurrencyRateController.conversionRate === null
          ? 0
          : CurrencyRateController.conversionRate,
    };

    return {
      AccountTrackerController,
      AssetsContractController,
      CollectiblesController,
      TokenListController,
      CurrencyRateController: modifiedCurrencyRateControllerState,
      KeyringController,
      PersonalMessageManager,
      NetworkController,
      PreferencesController,
      TokenBalancesController,
      TokenRatesController,
      TokensController,
      TypedMessageManager,
      GasFeeController,
      TokenDetectionController,
      CollectibleDetectionController,
    };
  },
  get datamodel() {
    return instance.datamodel;
  },
  getTotalFiatAccountBalance() {
    return instance.getTotalFiatAccountBalance();
  },
  // hasFunds() {
  //   return instance.hasFunds();
  // },
  resetState() {
    return instance.resetState();
  },
  sync(data) {
    return instance.sync(data);
  },
  refreshTransactionHistory(forceCheck = false) {
    return instance.refreshTransactionHistory(forceCheck);
  },
  init(state) {
    instance = new Engine(state);
    Object.freeze(instance);
    return instance;
  },
};
