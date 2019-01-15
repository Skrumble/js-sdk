In order to authenticate, all applications need a set of _Client Credentials_, which identify an app to the API. Each set of credentials is specific to the [server environment](https://developers.skrumble.com/environment-ur-ls) they were created for, meaning Sandbox credentials won't work on Production and vice-versa. See the [Authentication](https://developers.skrumble.com/authentication) and [Managing Applications](https://developers.skrumble.com/managing-applications) guides on the _Skrumble for Developers_ website. 


Once your credentials are created, the first step is to import the SDK and configure the `APISocket` to use use your client creds, along with URLs for the server. For this tutorial we'll use the [Sandbox](https://developers.skrumble.com/sandbox-environment) to avoid costs.


```
import {
  APISocket
} from '@skrumble/js-sdk';
let registeredUser, loadedChat

APISocket.config({ 
  client_id: "iK47Sr....",
  client_secret: "$2y$10$J...", 
  api_hostname: "sandbox.skrumble.com",
  auth_hostname: "sandbox-auth.skrumble.com"
})
```

Now that the socket is configured with the correct hostnames and credentials, users can start to log-in to any existing team on the Communication API. To create a new team, see the [_Managing Teams_](./tutorial-managing-teams.html) tutorial.


Most of the JS-SDK is written with promises, which means that you can either log-in with the traditonal `.then()`/`.catch()` syntax, or [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) if your application is using ES2017: 

```
// either ES6-style with promises ...
myUser = APISocket.login({
  email: "skrumble_user@example.com",
  password: "123456"
}).then((myUser) => {
  console.log(myUser, 'now logged in!');
}).catch((error) => {
  throw new Error(err);  
});


// ... or ES2017 using async/await
try {

  let myUser = await APISocket.login({
    email: "skrumble_user@example.com",
    password: "123456"
  })

  console.log(myUser, 'now logged in!');

} catch(err) {
  throw new Error(err);  
}
```

The result for either example is that `myUser` will be a fully authenticated user, meaning that they should have an access token and refresh token. Incorrect username/password combinations will be rejected by the server, and in these examples will throw an Error. 

Both tokens are automatically decorated on the `APISocket`, as is the user who has connected:
```
// After login...
console.log(APISocket.access_token);  // abc123...
console.log(APISocket.refresh_token); // xyz123...
console.log(APISocket.current_user);  // User object  
```

Now it will be possible to start [using chats](./tutorial-chats.html), inviting [guests](./tutorial-guests.html), or [adding new users](./tutorial-managing-teams.html).
