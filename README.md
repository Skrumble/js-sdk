
![Skrumble API](https://img.shields.io/badge/Skrumble%20API-v2.3.2-2196f3.svg?style=flat-square) [![Join the chat at https://gitter.im/Skrumble/js-sdk](https://badges.gitter.im/Skrumble/js-sdk.svg)](https://gitter.im/Skrumble/js-sdk?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Installation
The JS SDK is distributed through the npm registry, which means it can be installed with npm. In a bash window, run:

```bash
npm i --save @skrumble/js-sdk 
```

Or to install with yarn, run:
```bash
yarn add @skrumble/js-sdk
```

## Usage
The SDK supports multiple formats for loading, depending on your environment:

**UMD**
```javascript
var {
  Chat,
  APISocket
} = require('@skrumble/js-sdk')
```

**ES6**
```javascript
import {
  Chat, 
  APISocket
} from '@skrumble/js-sdk'
```

In case your environment doesn't support either, the SDK also exports a global called `Skrumble`, which contains the same classes as properties: 

```javascript
let Chat = Skrumble.Chat    
let APISocket = Skrumble.APISocket
```

### Configuring & Logging-in 
First you'll need:
1. Client credentials from the Skrumble [Developer portal](https://portal.skrumble.com/request-key). See the [_Managing Applications_](https://developers.skrumble.com/managing-applications) guide for more about generating creds
2. Hostnames for the environment you're using, see the [_Environment URLs_](https://developers.skrumble.com/environment-ur-ls) guide for a reference

```javascript
import {
  Chat,
  APISocket
} from '@skrumble/js-sdk';
let registeredUser, loadedChat

APISocket.config({ 
  client_id: "iK47Sr....",
  client_secret: "$2y$10$J...", 
  api_hostname: "sandbox.skrumble.com",
  auth_hostname: "sandbox-auth.skrumble.com"
})

try {
  registeredUser = await APISocket.login({
    email: "skrumble_user@example.com",
    password: "123456"
  })
} catch(err) {
  throw new Error(err);  
}

try {
  chatList = await Chat.getAll();
} catch(err) {
  throw new Error(err);
}

console.log(`Logged in as ${registeredUser.first_name}, found chat list of ${chatList}`); 
```

## Contributing
The SDK is an open-source project, so Pull Requests and bug reports are encouraged. Before contributing, see the [Github Issues](https://github.com/Skrumble/js-sdk/issues) page to ensure your issue/feature isn't a duplicate, and consult the CONTRIBUTING.md doc for information about contribution guidelines as well as the feature roadmap.  
