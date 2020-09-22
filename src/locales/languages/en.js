export default {
  state: {
    connected: ["Connected", "Your wallet is connected to the website:"],
    locked: [
      "Not connected",
      "Your wallet is not connected to this website. To do so find out if there is any wallet connection button on their page and click it.",
    ],
  },
  terms: {
    title: "Terms and conditions",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas varius tortor nibh, sit amet tempor nibh finibus et. Aenean eu enim justo. Vestibulum aliquam hendrerit molestie. Mauris malesuada nisi sit amet augue accumsan tincidunt. Maecenas tincidunt, velit ac porttitor pulvinar, tortor eros facilisis libero, vitae commodo nunc quam et ligula. Ut nec ipsum sapien. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer id nisi nec nulla luctus lacinia non eu turpis. Etiam in ex imperdiet justo tincidunt egestas. Ut porttitor urna ac augue cursus tincidunt sit amet sed orci. Ut nec ipsum sapien. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer id nisi nec nulla luctus lacinia non eu turpis. Etiam in ex imperdiet justo tincidunt egestas. Ut porttitor urna ac augue cursus tincidunt sit amet sed orci.",
  },
  faqs: {
    title: "FAQ's",
    questions: [
      {
        title: "What is this wallet used for?",
        text:
          "WalliD wallet plug-in is used to safely authenticate you on the web without requesting or storing any relevant identity information about yourself. It destroys the need to have a username and password and everything you do with keeps your online actions anonymous.",
      },
      {
        title:
          "Is it possible to store Eth or any other cryptocurrency in my wallet?",
        text:
          "No. At the moment WalliD web3 wallet only uses your public and private keys to authenticate you on dapps and services, encrypt, decrypt and manage your Identity documents.",
      },
      {
        title: "Where is my Identity document data being stored?",
        text:
          "Your identity documents data is encrypted with your wallet keys and stored directly in your phone. This means that you are its sole owner as you are the only one with access to your keys through WalliD’s wallet. Only your wallet keys are able to decrypt the data stored in your device.",
      },
      {
        title: "What is the seed phrase?",
        text:
          "The seed phrase is a list of 12 words than when put in a specific order allow you to recover your wallet’s private and public keys as they are the cryptographic result of those words with a serious of different computations. It is the only way to have access to any information related to your wallet usage and if you lose it, no one can retrieve your data.",
      },
      {
        title: "How can I import a wallet from the seed phrase?",
        text:
          "Click in “import wallet”, provide the 12 word sequence from you seed phrase and your wallets’ public and private keys will be restored.",
      },
      {
        title: "What are my private and public keys used for?",
        text:
          "Your private key is used to sign your wallet with different identity documents and to decrypt the data stored in your device. Your public key is used to encrypt that data and to authenticate you in online services.",
      },
      {
        title: "How can I copy my wallet public address?",
        text:
          "You just need to click on top of your public key address displayed on your plug-in home page and it will automatically be copied to your clipboard.",
      },
      {
        title: "What is a connection request?",
        text:
          "A connection request occurs every time you enter a dapp or website using web3 functionalities. It detects your browser has an web3 wallet such as WalliD running in it and request your authorisation to be able to send it futures authorisation requests to use your private and public keys through your wallet.",
      },
      {
        title: "What is an authorisation request?",
        text:
          "It is a ping by a dapp or web3 connected website to access your wallets private or public keys features, depending on the specific action you are undertaking on that website.",
      },
      {
        title:
          "What is an authorisation request to associate a wallet to an identity document?",
        text:
          "It is a request to use your wallet private key to sign your identity document data. This will generate a wallet signature, that will be used in the future to prove online that that person with a certain Identity document is the owner of that digital wallet.",
      },
      {
        title:
          "What is an authorisation request to display identity document data?",
        text: "",
      },
      {
        title:
          "What is an authorisation request to store an identity document?",
        text:
          "It is a request to use your public key to encrypt your identity document data so that only the usage of your own private keys could decrypt it back, keeping your data safe and away from any middle man (even WalliD doesn’t have access to it)",
      },
      {
        title:
          "What is an authorisation to display you identity document data?",
        text:
          "It is a request to use your private keys and decrypt your identity document data stored in your device",
      },
    ],
  },
  request: {
    wallid_connect: {
      title: "Connection Request",
      description: " is asking for your permission to connect to your wallet:",
      alert: "Only connect with sites you fully trust.",
      button: "Connect",
      success: "Successfully connected",
      successText: " sucessfully conected with your wallet!",
    },
    wallet_encrypt: {
      title: "Authorisation Request",
      description:
        " is requesting your authorisation to store your identity document in your wallet:",
      button: "Authorise",
    },
    wallet_decrypt: {
      title: "Authorisation Request",
      description:
        " is requesting your authorisation to display your identity document data:",
      button: "Authorise",
    },
    bScenes: "Know what's happening behind the scenes",
    cancel: "Cancel",
  },
  about: {
    title: "About",
    design: "Crafted by WalliD",
    version: "version 1.0",
    links: ["Links", "FAQ’s", "Terms and conditions", "Contact us"],
  },
  privKey: {
    title: "Show Private Key",
    text:
      "Your private key is the proof of your wallet ownership. You are its' sole owner and with it you have full control over your wallet. Type in your wallet password to display your private key.",
    label: "Your Private Key",
    alert:
      "Never disclose this key. Anyone with it can have access to your wallet and Identity documents held within",
  },
  seedPhrase: {
    title: "Reveal Seed Phrase",
    text:
      "If you ever change browsers or get a new desktop, you'll need the seed phrase to import this wallet and the identity documents held within.",
    label: "Your Seed Phrase",
    alert:
      "DO NOT share this phrase with anyone! It is the ultimate key to setup and access your wallet",
    copy: "Copy to clipboard",
    csv: "Save as CSV file",
  },
  settings: {
    title: "Settings",
    general: {
      title: "General",
      language: "Current Language",
    },
    privacy: {
      title: "Privacy and Security",
      seed: [
        "Your Seed Phrase",
        "Reveal Seed Phrase",
        "Learn more about your Seed Phrase",
      ],
      key: [
        "Your Private key",
        "Show Private Key",
        "Learn more about your Private Key",
      ],
    },
  },
  sites: {
    title: "Connected sites",
    subtitle:
      "Check out the history of the websites  connected to your wallet:",
    tooltip: "Disconnect",
    disconnect: ["Disconnect ", " site"],
    confirm:
      "Are you sure you want to disconnect? You may lose site funcionality.",
    button: ["Cancel", "Disconnect"],
  },
  menu: {
    title: "My WalliD",
    details: "Wallet details ",
    sites: "Connected sites",
    settings: "Settings",
    about: "About",
    lock: "Lock",
  },
  home: {
    title: "My WalliD",
    address: "Your wallet address",
  },
  import: {
    title: "Import your wallet",
    subtitle: "Enter your twelve word seed phrase to import your wallet.",
    seedPhrase: ["Seed phrase", "Show seed phrase", "Hide seed phrase"],
    password: [
      "New password",
      "Confirm password",
      "Must be at least 8 characters",
    ],
    button: "Import wallet",
  },
  restore: {
    title: "Restore your wallet",
    subtitle: "Enter your twelve word seed phrase to restore your wallet.",
    seedPhrase: ["Seed phrase", "Show seed phrase", "Hide seed phrase"],
    password: [
      "New password",
      "Confirm password",
      "Must be at least 8 characters",
    ],
    button: "Restore wallet",
  },
  login: {
    title: "Welcome back!",
    password: ["Password", "Incorrect password"],
    button: "Unlock wallet",
    restore: ["Restore wallet?", "Restore using wallet seed phrase"],
  },
  create: {
    title: "Welcome to WalliD",
    text: "The digital wallet to manage all your Identity document",
    button: "Create your wallet",
    import: ["Already have a wallet?", "Import now using your seed phrase"],

    stepper: [
      {
        title: "Set up your password",
        text:
          "This password will be used to unlock your wallet whenever you wish to come back online and use your identity documents.",
        password: [
          "New password",
          "Confirm password",
          "Must be at least 8 characters",
        ],
        terms: ["I have read and agree with", "WalliD’s Terms and conditions"],
        button: "Set up password",
      },
      {
        title: "Secure your wallet",
        text:
          "The seed phrase is the ultimate key to your wallet and the only way to recover or access it from another device. Write it downs and keep it in a safe place.",
        seed: [
          "Your seed phrase",
          "revealed",
          "Click here to reveal you seed phrase",
          "Make sure no one is watching your screen",
        ],
        later: "Remind me later (not recommended)",
        button: "I wrote down my seed phrase",
      },
      {
        title: "Secure your wallet",
        text: "Select each word in the order it was presented to you.",
        button: "Verify",
      },
      {
        title: "Congratulations",
        text:
          "You’ve successfully protected your wallet. Remember to keep your seed phrase safe, it’s your responsibility and the reason why your data is only accessible to you.",
        button: "Done",
      },
    ],
  },
  passwordErrors: {
    lenght: "Password not long enough",
    match: "Passwords don’t match",
  },
  buttons: {
    cancel: "Cancel",
    confirm: "Confirm",
    connect: "Connect",
    disconnect: "Disconnect",
    done: "Done",
  },
};
