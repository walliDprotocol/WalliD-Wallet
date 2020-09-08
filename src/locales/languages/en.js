export default {
  restore: {
    title: "Restore your wallet",
    subtitle: "Enter your twelve word seed phrase to import your wallet.",
    seedPhrase: ["Seed phrase", "Show seed phrase", 'Hide seed phrase'],
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
    restore: ["Restore wallet?", "Import using wallet seed phrase"],
  },
  create: {
    title: "Welcome to WalliD",
    text: "The digital wallet to manage all your Identity document",
    button: "Create your wallet",
    import: ["Already have a wallet?", "Restore now using your seed phrase"],

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
