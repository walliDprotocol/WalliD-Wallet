export default {
  state: {
    connected: ["Connected", "Your wallet is connected to the website:"],
    locked: [
      "Not connected",
      "Your wallet is not connected to this website. To do so find out if there is any wallet connection button on their page and click it.",
    ],
  },
  request: {
    connection: {
      title: "Connection Request",
      description: " is asking for your permission to connect to your wallet:",
      alert: "Only connect with sites you fully trust.",
      button: "Connect",
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
  restore: {
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
};
