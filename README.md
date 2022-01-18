## WalliD Chrome Extension

The WalliD is a Chrome browser extension that enables users to interact with WalliD's protocol, platforms and APIs.
The _src_ folder contains all the code that describes the plugin's behaviour and functionalities. More specifically, the _scripts_ folder contains all of the plugin's backend code.
Detailed information about the _scripts_ folder can be found bellow.

---

### /src/scripts:

- **controllers:** a collection of controller modules built around clearly defined data entities. These modules are responsible for managing the plugin's multiple data entities and implementing all relevant functionalities relating to them.

- **lib:** a collection of functional modules responsible for the implementation of functionalities not specific to any controller. It contains miscelaneous utility functions meant to be imported and used by the main application instance, controllers, or any other scripts like the content-script.

- **resources:** contains all resources not directly related to the plugin's configuration. Currently used to store the ABIs of the smart-contracts that the plugin interacts with.

- **app-controller.js:** contains the implementation of the AppController module which represents the main plugin instance running in the browser's background process. It provides all necessary methods to interact with the backend subsytem. It is responsible for managing the plugin's internal state and controller instances.
  All controller modules are instanciated within the main AppController instance. Controller modules should not be accessed directly, instead any interaction with the controllers should be done through wrapped functions provided by the main AppController instance.
  This instance also provides a permissioned RequestAPI which exposes select controller functionalities to web applications. This allows applications to interact with the plugin's state and use its available features like, importing new credentials or using cryptographic functions. The methods provided by the RequestAPI require apps to have certain access levels in order to access them. Applications can use a specific method to request a given access level, which will in turn present the user with a popup window enabling him to accept or decline the requested access level.
  The AppController instance also exposes an internal API to the UI subsystem whose goal is to provide the plugin's UI components with all the functionalities they might need in order to implement the various user flows within the plugin.

- **background.js:** specific Chrome extension ManifestV2 script (https://developer.chrome.com/docs/extensions/mv2/background_pages/).
  The background script is persistent, meaning it continuously runs in the browser's background process despite the plugin being in use or not. The main AppController instance runs inside the background script. The in-memory state of the application is maintained within the context of this script.

- **content-script.js:** a specific Chrome extension script (https://developer.chrome.com/docs/extensions/mv3/content_scripts/).
  The content-script provides a way for the plugin to interface with web applications. The script is injected into web pages according to the whitelist defined in the _manifest.json_ file. In the context of the plugin, the content-script is used to inject code that allows web applications to interact with the plugin's RequestAPI and listen to relevant events emmited by the backend.

---

#### NOTE

This extension is built using ManifestV2. Google has recently launched ManifestV3 which introduces a big shift to the extensions platform, notably the replacement of background pages for service workers.

#### REQUIREMENTS

- Node v12.18.3
