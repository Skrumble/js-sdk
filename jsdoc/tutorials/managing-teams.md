Most of the functionality for managing a Team on the Communication API is handled through the `Team` class.   

## Creating Teams 
Creating a team can be done with the `Team.create()` method, which will create both the team owner and the team itself. Since both user emails and team names are unique, the SDK will throw an exception if either is already taken.

```javascript
import {
  APISocket,
  Team
} from '@skrumble/js-sdk';

// Configure the socket
APISocket.config({ 
  client_id: "iK47Sr....",
  client_secret: "$2y$10$J...", 
  api_hostname: "sandbox.skrumble.com",
  auth_hostname: "sandbox-auth.skrumble.com"
})

// Create the team
try {
  let myTeam = await Team.create({ 
    owner_first_name: "Lorem",
    owner_last_name: "Ipsum",
    owner_email: "first_user@example.com",
    owner_password: "hunter2",
    name: "Lorem Co",
    country: "Canada",
    city: "Toronto",
    state: "ON"
  });
} catch (err) { 
  // Team.create promise will be rejected with exceptions for 
  // emails/team names being taken, missing fields, or if the API fails
  // to return a 201 Created (network interruption, server error, etc)
  console.error(`Error creating team: ${err.message}`);
}
```


## Inviting users
```javascript
// Create the invite
User.invite({ 
  email: "newuser@example.com",
  team: myTeam
})
  .then((invite_result) => {
    
    // Now accept the invite
    User.acceptInvite({
       invite_token: invite_result.token,
       first_name: "Jane",
       last_name: "Doe",
       password: "hunter2",
       team: myTeam
    })
      .then((invitedUser) => console.log("User accepted", invitedUser);
      .catch((err) => console.error(err))

  })
  .catch((err) => console.error(err))
```

## Adding users
```javascript
User.create({
  first_name: "Jane",
  last_name: "Doe",
  email: "user@example.com",
  password: "hunter2",
  team: MyTeamObj
})
  .then((newUser) => console.log("Created user", newUser.first_name, newUser.last_name))
  .catch((err) => console.error("Problem creating user", err))
```

## Updating users
Users are able to update their own information, such as their name, position, preferred language, and other properties visible on the [User](User.html#toc1__anchor) object.  

```javascript
let me = await APISocket.login({ ...opts })
me.mobile_number = "555...";
me.avatar = "http://gravatar.com/...";
me.language = "es";

me.save()
  .then((me_updated) => console.log(me_updated))
  .catch((err) => console.error(err));
```

In addition, all Admins on the team are allowed to modify the information of other users.
For instance, an Admin would be able to loop through all the users on the team and set their work phone number: 

```javascript
let user_list = await User.getAll();

user_list.forEach((user) => {

  user.work_number = "123-555-1234";

  try {
    user.save();
  } catch (err) {
    console.error(`Error updating user phone #: ${err.message}`);
  }
})
```
