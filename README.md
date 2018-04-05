
![Skrumble API](https://img.shields.io/badge/Skrumble%20API-v2.3.2-2196f3.svg?style=flat-square) [![Join the chat at https://gitter.im/Skrumble/js-sdk](https://badges.gitter.im/Skrumble/js-sdk.svg)](https://gitter.im/Skrumble/js-sdk?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Installation
The JS SDK is distributed through the npm registry, which means it can be installed with npm. In a bash window, run:

```bash
npm i --save @skrumble/js-sdk 
```

Or to install with yarn, run:
```bash
yarn install @skrumble/js-sdk
```

## Usage
The SDK supports multiple formats for loading, depending on your environment:

**UMD**
```js
var {
    Chat,
    APISocket
} = require('@skrumble/js-sdk')
```

**ES6**
```js
import {
    Chat, 
    APISocket
} from '@skrumble/js-sdk'
```

In case your environment doesn't support either, the SDK also exports a global called `Skrumble`, which contains the same classes as properties: 

```js
let Chat = Skrumble.Chat    
let APISocket = Skrumble.APISocket
```


### Configuring & Logging-in 
First you'll need:
1. Client credentials from the Skrumble [Developer site](developers.skrumble.com/request-key)
2. Hostnames for the environment you're using, see the [Environments list](developers.skrumble.com/knowledge-base/skrumble-api-overview/#environments) in the developer docs
3. An existing team on the server

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
The SDK is an open-source project, and PRs, contributions, and bug reports are encouraged.

### Documentation
There are separate NPM tasks for generating and serving docs. To generate the docs, run `npm run docs`, which will read the code in `src/` and output it to `docs/`. 

To view it in a browser using SimpleHTTPServer, run `npm run docs_serve`. The docs should now be visible at [http://localhost:5000](http://localhost:5000)

### Testing
The SDK currently uses mocha/chai as a testing suite. `npm run test` will run the tests and output results to the console. 
