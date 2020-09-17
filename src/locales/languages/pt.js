export default {
  state: {
    connected: ["Conectado", "A sua carteira está conectada com o site:"],
    locked: [
      "Não conectado",
      "A sua carteira não está conectada a este website. Para fazê-lo verifique se existe algum botão para o efeito algures no site e clique nele.",
    ],
  },
  request: {
    connection: {
      title: "Connection Request",
      description: " is asking for your permission to connect to your wallet:",
      alert: "Only connect with sites you fully trust.",
    },
    bScenes: "Know what's happening behind the scenes",
  },
  about: {
    title: "Sobre",
    design: "",
    version: "",
    links: ["", "", "", ""],
  },
  privKey: {
    title: "A sua chave privada",
    text:
      "A chave privada é o que prova que esta carteira é sua. Você é o seu único dono e por isso tem  também controlo total sobre ela.   Insira a password da sua carteira para aceder à sua chave privada.",
    label: "A sua chave privada",
    alert:
      "Nunca revele esta chave. Qualquer pessoa que a tenha em sua posse pode ter acesso à sua carteira e aos seus documentos de identidade.",
  },
  seedPhrase: {
    title: "A sua seed phrase",
    text:
      "Se mudar de browser ou de dispositivo, precisará da sua seed phrase para importar esta carteira e todos os documentos nela guardados.",
    label: "A sua seed phrase",
    alert:
      "Não partilhe esta seed phrase com ninguém! É a única chave capaz de reconfigurar a sua carteira em qualquer dispositivo.",
    copy: "Copiar clipboard",
    csv: "Guardar como CSV",
  },
  settings: {
    title: "Geral",
    general: {
      title: "Linguagem atual",
      language: "Privacidade e Segurança",
    },
    privacy: {
      title: "Privacidade e Segurança",
      seed: [
        "A sua seed phrase",
        "Revelar seed phrase",
        "Aprenda mais sobre a sua seed phrase",
      ],
      key: [
        "A sua chave privada",
        "Mostrar chave privada",
        "Aprende mais sobre a tua chave privada",
      ],
    },
  },
  sites: {
    title: "Sites conectados",
    subtitle:
      "Confira o histórico dos sites que estão conectados à sua carteira:",
    tooltip: "Desconectar",
    disconnect: ["Desconectar o site ", ""],
    confirm:
      "Tem a certeza que pretende desconectar a sua carteira deste site? Pode perder algumas funcionalidades.",
    button: ["Cancelar", "Desconectar"],
  },
  menu: {
    title: "A minha WalliD",
    details: "Detalhes da carteira",
    sites: "Sites conectados",
    settings: "Configurações",
    about: "Sobre",
    lock: "Bloquear",
  },
  home: {
    title: "A minha WalliD",
    address: "Endereço da sua carteira",
  },
  restore: {
    title: "Restore your wallet",
    subtitle: "Enter your twelve word seed phrase to import your wallet.",
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
    restore: ["Restore wallet?", "Import using wallet seed phrase"],
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
  buttons: {
    cancel: "Cancelar",
    confirm: "Confirmar",
    connect: "Conectar",
    disconnect: "Disconectar",
    done: "Done",
  },
};
