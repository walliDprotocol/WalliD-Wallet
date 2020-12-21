export default {
  state: {
    connected: ["Conectado", "A sua carteira está conectada a este website"],
    locked: [
      "Desconectado",
      "A carteira não está conectada a este website. Para a conectar, procure o botão de ligação a carteiras web-3 no site em que se encontra.",
    ],
  },
  terms: {
    title: "Termos and condições",
  },
  faqs: {
    title: "FAQ's",
    questions: [
      {
        title: "O que é a carteira MyWalliD?",
        text:
          "MyWalliD é um plug-in com uma carteira web-3 que permite o armazenamento e gestão de documentos de identidade e credenciais ao mesmto tempo que serve de autenticador seguro na web.  .",
      },
      {
        title:
          "É possível comprar e guardar ETH ou outra criptomoeda nesta carteira? ",
        text:
          "Não. Nesta versão, a carteira MyWalliD apenas utiliza os seus pares de chaves privada e pública para autenticar o utilizador em dApps, encriptar e desencriptar dardos e gerir documentos de identidade e credenciais.",
      },
      {
        title:
          "Onde são guardadas as minhas credenciais e documentos de identidade?",
        text:
          "Os seus documentos de ID e credenciais são cifrados com a chave pública sua carteira e armazenados diretamente no seu dispositivo.Isto significa que o utilizador é o único proprietário  desta informação e o único com acesso a carteira e informação contida. Apenas a sua chave privada consegue decifrar os dados dos seus documentos de identidade e credenciais guardados no seu dispositivo.",
      },
      {
        title: "O que é a seed phrase?",
        text:
          "É uma lista de 12 palavras ordenadas especificamente e de forma única que permite reconstituir uma chave privada única. Apenas com s seed phrase é capaz de aceder à mesma carteira em dispositivos diferentes  .",
      },
      {
        title:
          "Como posso importar a minha carteira MyWalliD com a seed phrase?",
        text:
          "Clique em 'importar carteira', forneça a lista das 12 palavras da seed phrase na ordem correcta e a as chaves pública e privada serão reconstituídas?.",
      },
      {
        title: "Para que são usadas as minhas chaves pública e privada?",
        text:
          "A chave privada é utilizada para assinar a sua carteira com diferentes documentos de identidade e credenciais e para decifrar os dados guardados no seu dispositivo.A chave pública é utilizada para cifrar esses dados e autenticá-lo nos websites e serviços WalliD.",
      },
      {
        title: "Como posso copiar o meu endereço MyWalliD?",
        text:
          "Precisa apenas de clicar em cima do seu endereço público, apresentado na página principal do seu plug-in, e este será automaticamente copiado para o clipboard.",
      },
      {
        title: "O que é um pedido de conexão?",
        text:
          "Um pedido de conexão acontece sempre que entrar num website ou dApp que utilize funcionalidades da web-3. A carteira MyWalliD é chamada para autorizar a sincronização desses sites com o seu endereço público e chamar a sua carteira sempre que este necessitar de utilizar as suas chaves para alguma ação.",
      },
      {
        title: "O que é um pedido de autorização?",
        text:
          "É uma chamada de uma dApp ou website com funcionalidades associadas à web-3 para aceder às funcionalidades da sua carteira referentes à utilização das chaves privadas ou públicas.",
      },
      {
        title:
          "O que é um pedido de autorização para associar a carteira MyWalliD a um documento de identidade ou credencial?",
        text:
          "É um pedido para utilizar a chave privada da carteira para assiná-la com um documento de identidade ou credencial. Esta ação irá gerar uma assinatura da carteira que será usada no futuro para provar que o seu utilizador é também o dono de um determinado documento de ID. ",
      },
      {
        title:
          "O que é um pedido de autorização para apresentar o documento de identidade ou credencial?",
        text:
          "É um pedido para usar a chave privada e decifrar os dados do documento de identidade armazenados no dispositivo.",
      },
      {
        title:
          "O que é um pedido de autorização para armazenar um documento de identidade?",
        text:
          "É um pedido para utilizar a chave pública para cifrar os documentos de identidade e credenciais e armazená-los posteriormente no seu dispositivo",
      },
      {
        title:
          "O que é um pedido de autorização para apresentar o seu documento de identidade ou credencial?",
        text:
          "É um pedido para usar a chave privada e decifrar os dados do documento de identidade armazenados no dispositivo.",
      },
    ],
  },
  request: {
    wallid_connect: {
      title: "Pedido de Ligação",
      description: " Está a pedir autorização para se ligar à carteira.",
      alert: "Ligue-se apneas a sites em que confia",
      button: "Conectar",
      success: "Conectado com sucesso",
      successText: " conectado com sucesso à carteira!",
    },
    wallet_encrypt: {
      title: "Pedido de Autorização",
      description:
        " está a pedir a sua autorização para armazenar o documento de identidade na carteira:",
      button: "Authorise",
    },
    wallet_decrypt: {
      title: "Pedido de autorização",
      description:
        " está a pedir autorização para apresentar o seu documento de identidade:",
      button: "Autorizar",
    },
    wallid_token: {
      title: "Pedido de autorização",
      description:
        " está a pedir autorização para associar o documento de ID à sua MyWalliD:",
      button: "Autorizar",
    },
    wallid_import_cred: {
      title: "Pedido de armazenamento",
      description:
        " está a pedir autorização para armazenar esta credencial na sua carteira MyWalliD",
      button: "Armazenar",
    },
    // wallet_sign: {
    //   title: "Sign Request",
    //   description:
    //     " is requesting your authorisation to sign the Certificate data with you private key",
    //   button: "Sign",
    // },
    wallet_ec_sign: {
      title: "Pedido de Confirmação",
      description:
        " está a pedir para confirmar esta ação na plataforma WalliD com a sua carteira.",
      button: "Confirmar",
    },
    wallet_sign_erc191: {
      title: "Pedido de Confirmação",
      description:
        " está a pedir para confirmar esta ação na plataforma WalliD com a sua carteira",
      button: "Confirmar",
    },
    bScenes: "Saiba o que se passa nos bastidores da sua carteira",
    cancel: "Cancelar",
  },
  about: {
    title: "Sobre nós",
    design: "Desenvolvido pela WalliD",
    version: "Versão",
    links: [
      "Ligações",
      "FAQ’s",
      "Termos and Condições",
      "Política de Privacidade",
      "Contactos",
    ],
  },
  privKey: {
    title: "Mostrar chave privada",
    text:
      "Esta chave é garantia do seu controlo total sobre os seus dados e a sua carteira.É o único proprietário dela e só ela garante acesso à sua carteira. Forneça a sua passowrd para ter acesso à sua chave privada.",
    label: "A sua chave privada",
    alert:
      "NUNCA partilhe esta chave com ninguém! Quem a ela tiver acesso, poderá aceder à sua carteira e utilizar os documentos de identidade e credenciais em seu nome.",
  },
  seedPhrase: {
    title: "Revelar seed phrase",
    text:
      "Se alguma vez mudar de browser ou de desktop, precisará da seed phrase ºpara importar esta carteira e os respectivos documentos de identidade e credenciais para o novo dispositivo.",
    label: "A sua Seed Phrase",
    alert:
      "NUNCA partilhe esta frase com ninguém! É a uma peça única que pode reconstruir a sua chave privada e, com isso, reconstituir toda a sua carteira. ",
    copy: "Copiar para o clipboard",
    csv: "Guardar como ficheiro CSV",
  },
  settings: {
    title: "Definições",
    general: {
      title: "Geral",
      language: "Língua",
    },
    privacy: {
      title: "Privacidade e segurança",
      seed: [
        "A sua Seed Phrase",
        "Revelar Seed Phrase",
        "Saiba mais sobre a seed phrase",
      ],
      key: [
        "A sua chave privada",
        "Mostrar chave privada",
        "Saiba mais sobre a chave privada",
      ],
    },
  },
  sites: {
    title: "Sites conectados",
    subtitle:
      "Veja o histórico dos websites que se conectaram com a sua carteira:",
    tooltip: "Disconectar",
    noSites: "Não está ligado a nenhum website",
    disconnect: ["Disconectar ", " site"],
    confirm:
      "De certeza que se quer desconectar desde site? <br> Pode perder acesso a algumas funcionalidades.",
    button: ["Cancelar", "Disconectar"],
  },
  menu: {
    title: "MyWalliD",
    details: "informação sobre a carteira ",
    sites: "Sites conectados",
    settings: "Definições",
    about: "Sobre nós",
    lock: "Sair",
  },
  home: {
    title: "MyWalliD",
    address: "Endereço da carteira",
    tabs: ["Credenciais", "Documentos ID"],
  },
  credentials: {
    noCredentials: "Ainda não tem nenhuma credencial guardada na sua carteira",
    store: "Comece a coleccioná-las",
    menu: ["Ver credencial", "Partilhar credencial", "Apagar Credencial"],
    status: {
      active: "Válida",
      revoke: "Revogada",
      pending_approval: "Ver apenas",
      waiting_wallet: "À espera de carteira",
    },
    tooltip:
      " já foi notificado e vai confirmar que a credencial foi guardada com sucesso na sua carteira com o seu carimbo digital. Assim que o fizer, a sua credencial poderá ser partilhada online e verificada por terceiros. ",
  },
  proof: {
    title: "Partilhar credencial",
    text:
      "Para partilhar a credencial de forma verificável irá precisar de a associar a uma conta sua numa rede social ou website. Cole o URL da sua página de perfil na caixa em baixo e gere um link desta credencial que poderá ser verificado em qualquer sítio online",
    url: "URL",
    hint: "Página de perfil do Linkedin ou Instagram",
    urlError: "Este não é um URL válido de uma página de perfil",
    text1:
      "Em baixo está o link coma sua credencial verificável que poderá ser associado à sua página de perfil. Copie e cole-a em qualquer sítio online e partilhe-a com o mundo ou só quem entender. Quem aceder ao link terá acesso à sua credencial e à informação pública da sua página de perfil :",
    button: "Gerar link",
  },
  cards: {
    validity: ["Data de expiração:", "Válida", "Inválida", "Pendente"],
    noids: "Ainda não tem documentos de identidade nesta carteira",
    store: "Guarde os seus documentos ID agora",
    tooltip: "Show ID data",
  },
  import: {
    title: "Importe a sua carteira",
    subtitle:
      "Forneça as doze palavras da sua seed phrase pela ordem correcta.",
    seedPhrase: ["Seed phrase", "Mostrar seed phrase", "Esconder seed phrase"],
    password: [
      "Nova password",
      "Confirmar password",
      "Deve conter pelo menos 8 caracteres.",
    ],
    text:
      "Importou a sua carteira com sucesso. Lembre-se de manter a sua seed phrase guardada em segurança.É da sua responsabilidade e a responsável pelo total controlo e acesso aos seus dados.",
    button: "Importar carteira",
  },
  restore: {
    title: "Restaure a sua carteira",
    subtitle:
      "Forneça as doze palavras da sua seed phrase pela ordem correcta.",
    seedPhrase: [
      "Seed phrase",
      "Mostrar seed phrase",
      "Esconder seed phrase",
      "Seed phrases contêm 12 palavras",
      "Seed phrase incorrecta",
    ],
    password: [
      "Nova passowrd",
      "Confirmar password",
      "Deve conter pelo menos 8 caracteres.",
    ],
    button: "Restaurar carteira",
  },
  login: {
    title: "Bem-vindo de volta!",
    password: ["Password", "Password incorrecta"],
    button: "Entrar",
    restore: [
      "Restaurar carteira?",
      "Restaure usando a seed phrase da carteira.",
    ],
  },
  create: {
    title: "Bem-vindo à MyWalliD",
    text: "A carteira digital das suas credenciais e documentos de identidade",
    button: "Criar MyWalliD",
    import: [
      "Já tem uma carteira MyWalliD?",
      "Importe-a através da seed phrase",
    ],

    stepper: [
      {
        title: "Definir password",
        text:
          "Esta passowrd será usada para entrar na carteira MyWalliD e aceder aos seus documentos de identidade e credenciais.",
        password: [
          "Nova password",
          "Confirmar password",
          "Tem de conter no mínimo 8 caracteres.",
        ],
        terms: ["Li e aceito", "os Termos e Condições da WalliD"],
        button: "Crie uma password",
      },
      {
        title: "Proteja a carteira",
        text:
          "A seed phrase é a peça fundamental para reconstituir e aceder à carteira MyWalliD através de outro despositivo. Escreva-a e mantenha-a num lugar seguro.",
        seed: [
          "A sua seed phrase",
          "revelada",
          "Clique aqui para revelar a seed phrase",
          "Certifique-se que ninguém está a ver o seu ecrã",
        ],
        later: "Lembrar mais tarde (não recomendado)",
        button: "Já anotei a seed phrase",
      },
      {
        title: "Proteja a carteira",
        text:
          "Reescreva a seed phrase, seleccionando as palavras em baixo pela ordem que lhe foi apresentada anteriormente.",
        button: "Confirmar",
      },
      {
        title: "Parabéns",
        text:
          "Protegeu a sua carteira com sucesso. Lembre-se de manter a sua seed phrase em segurança. É da sua responsabilidade e a responsável pelo total controlo e acesso aos seus dados.",
        button: "Feito",
      },
    ],
  },
  passwordErrors: {
    lenght: "A passowrd não tem pelo menos 8 caracteres.",
    match: "Passwords não correspondem.",
  },
  buttons: {
    cancel: "Cancelar",
    confirm: "Confirmar",
    connect: "Conectar",
    disconnect: "Disconectar",
    done: "Feito",
  },
};
