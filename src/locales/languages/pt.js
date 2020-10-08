export default {
  state: {
    connected: ["Conectado", "A sua carteira está conectada com o site:"],
    locked: [
      "Não conectado",
      "A sua carteira não está conectada a este website. Para fazê-lo verifique se existe algum botão para o efeito algures no site e clique nele.",
    ],
  },
  request: {
    wallid_connect: {
      title: "Pedido de conexão",
      description:
        " está a pedir a sua permissão para conectar-se à sua carteira:",
      alert: "Apenas conecte a sua carteira a sites que confie totalmente.",
      button: "Conectar",
      success: "Conectado com sucesso",
      successText: " conectou-se com sucesso à sua carteira!",
    },
    wallet_encrypt: {
      title: "Pedido de autorização",
      description:
        " está a pedir a sua autorização para guardar o documento de identidade na sua carteira:",
      button: "Autorizar",
    },
    wallet_decrypt: {
      title: "Pedido de autorização",
      description:
        " está a pedir a sua autorização para mostrar os dados do seu documento de identidade:",
      button: "Autorizar",
    },
    wallid_token: {
      title: "Pedido de autorização",
      description:
        "está a pedir a sua permissão para associar a sua carteira a este documento de identidade:",
      button: "Autorizar",
    },
    bScenes: "Saiba o que se passa nos bastidores",
    cancel: "Cancelar",
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
    noSites: "Parece que não tem sites conectados a esta wallet",

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
  import: {
    title: "Importar carteira",
    subtitle:
      "Insira a sua seed phrase de doze palavras para importar a sua carteira.",
    seedPhrase: ["Seed phrase", "Mostrar seed phrase", "Esconder seed phrase"],
    password: [
      "Nova password",
      "Confirmar password",
      "Deve ter no mínimo 8 caracteres",
    ],
    text:
      "Importou com sucesso a sua carteira. Lembre-se que, manter a sua seed phrase em segurança, é da sua responsabilidade e a única razão pela qual apenas você tem acesso aos seus dados.",
    button: "Importar carteira",
  },
  restore: {
    title: "Recuperar carteira",
    subtitle:
      "Insira a sua seed phrase de doze palavras para importar a sua carteira.",
    seedPhrase: [
      "Seed phrase",
      "Mostrar seed phrase",
      "Esconder seed phrase",
      "Seed phrases tem que ter 12 palavras",
    ],
    password: [
      "Nova password",
      "Confirmar password",
      "Deve ter no mínimo 8 caracteres",
    ],
    button: "Recuperar carteira",
  },
  login: {
    title: "Bem-vindo de volta!",
    password: ["Password", "Password incorrecta"],
    button: "Desbloquear carteira",
    restore: [
      "Recuperar carteira?",
      "Recuperar através da seed phrase da carteira",
    ],
  },
  create: {
    title: "Bem-vindo à WalliD",
    text:
      "A carteira digital para gerir todos os seus documentos de identidade",
    button: "Criar carteira",
    import: ["Já tem uma carteira?", "Importe agora usando a sua seed phrase"],

    stepper: [
      {
        title: "Configure a sua password",
        text:
          "Esta password será utilizada para desbloquear a sua carteira sempre que quiser utilizar os seus documentos de identidade online.",
        password: [
          "Nova password",
          "Confirmar password",
          "Deve ter no mínimo 8 caracteres",
        ],
        terms: ["Eu li e aceito os ", "Termos e Condições da WalliD."],
        button: "Configurar password",
      },
      {
        title: "Proteja a sua carteira",
        text:
          "A seed phrase é a chave definitiva da sua carteira e a única forma de recuperá-la ou de ter acesso a partir de outro dispositivo. Anote e guarde-a num local seguro.",
        seed: [
          "A sua seed phrase",
          "revelada",
          "Clique aqui para revelar a sua seed phrase",
          "Certifique-se que ninguém está a olhar para o seu ecrã",
        ],
        later: "Lembrar-me depois (não recomendado)",
        button: "Eu escrevi a minha seed phrase",
      },
      {
        title: "Proteja a sua carteira",
        text:
          "Selecione cada palavra da seed phrase e ordene pela ordem que lhe foi apresentada.",
        button: "Verificar",
      },
      {
        title: "Sucesso",
        text:
          "Protegeu com sucesso a sua carteira. Lembre-se que manter a sua seed phrase em segurança é da sua responsabilidade e a única razão pela qual apenas você tem acesso aos seus dados.",
        button: "Concluído",
      },
    ],
  },
  passwordErrors: {
    lenght: "A password não tem o número mínimo de caracteres necessários",
    match: "As passwords não coincidem",
  },
  buttons: {
    cancel: "Cancelar",
    confirm: "Confirmar",
    connect: "Conectar",
    disconnect: "Disconectar",
    done: "Done",
  },
};
