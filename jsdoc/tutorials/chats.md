Skrumble Chats are exposed through the `Chat` class, which has a number of static methods to find or create chats. Chats can either be between two users, called _Private Chats_, or with 1 or more users, called _Group Chats_. 

> Note: These tutorials assume that you already have a user that is [logged-in](/tutorial-logging-in.html) to the socket. Where necessary, we'll refer to them as `myUser`.


## Finding chats
Chats can either be loaded individually by ID with {@link Chat.get `Chat.get()`}, or a list of all chats can be loaded with {@link Chat.getAll `Chat.getAll()`}.

```
import {
  Chat
} from '@skrumble/js-sdk';

// Load the first 100 chats visible to this user
var allChats = await Chat.getAll({
  limit: 100,
  skip: 0
})

// allChats now has a list of every chat, so we can do things like ...
allChats.map((chat) => {

  // logging info...
  if (chat.type == "private") { 
      console.log(`Private chat loaded! Message count: ${chat.messages.length}`);
  } else if (chat.type == "group") {
      console.log(`Group ${chat.name} loaded! Message count: ${chat.messages.length}`);
  }

  // ... or listening for events/messages
  // see below for handling these events 
  chat.on('message', incomingMessageHandler);
  chat.on('updated', chatUpdatedHandler);
})


// Or load an individual chat, if you know the ID....
var myChat = await Chat.get({ 
  id: "abc123..",
  message_limit: 1000,
  message_skip: 0
})

// ... and it returns a single Chat object
console.log(myChat.name);
```

## Creating chats
Creating and updating chats both use the `Chat.save()` method. If a Chat object has the properties `id` and `created_at` set, then the SDK assumes that the chat already exists and attempts to update it using the ID. If either of those fields are unset, then the SDK will assume that it's a new chat, and will attempt to create it instead.

```
import {
  Chat
} from '@skrumble/js-sdk';


// To create a group, specify `type: room`, and `users` is a list of 
// TeamUserIDs of who should be added. The user creating the group is always
// added as a participant
let myNewGroupChat = await new Chat({
  name: "My awesome group",
  purpose: "Let's discuss awesome stuff",
  type: "room",
  team: myUser.teams[0].id, // This is your logged-in user
  users: ['abc123...', 'xyz456...']
}).save();

// Now we can listen for messages  
myNewGroupChat.on('message', incomingMessageHandler);
myNewGroupChat.on('updated', chatUpdatedHandler);


// Or to create a private chat, specify `type: private` and the 
// list of users should just be the other user. Private chats
// don't have a name or purpose.
let myNewPrivateChat = await new Chat({
  type: "private",
  team: myUser.teams[0].id, // This is your logged-in user
  users: ['abc123...', 'xyz456...']
}).save();
```

## Chat Messages
Once a chat instance has been loaded, messages can be sent and recieved using `Chat.on('message')` and `Chat.sendMessage()` methods. We'll use the `myNewGroupChat` example from above, but this can be any instance of a Chat.

```
// Listen for new incoming message. `evt` is the raw socket event, 
// `message` is the new ChatMessage instance, and `chat` is the Chat instance. 
myNewGroupChat.on('message', (evt, message, chat) => {

  // The `type` of message will tell us if it's either a
  // file, text, or an in-chat event log
  switch (message.type) {
    case 'text':
      // Outputs: New message in mygroupname: Hello world!
      console.log(`New message in ${chat.name}: ${message.body}`);
    break;

    case 'file':
      // Outputs: New file in mygroupname: filename.jpg (100kb)
      console.log(`New file in ${chat.name}: ${message.file.name} (${message.file.size})`);
    break;

    // Messages are sent to the chat announcing things like 
    // users entering/leaving, starting or stopping a group call, 
    // or renaming the chat. Private chats will also log voicemails from the other user
    case 'call_log':
    case 'voicemail':
    case 'chat_renamed':
    case 'chat_purpose':
    case 'chat_locked':
    case 'participant_added':
    case 'particpant_removed':
    case 'recording_video':
      console.log(`New event log in ${chat.name}: ${message.type}, ${JSON.stringify(message.body)}`);
    break;
  }

});
```

Sending a text message simply requires the chat instance, and the text to be sent. Similar to chat creation, `sendMessage` returns a promise that's resolved with the ChatMessage instance once the API has successfully sent the message.  

Successful outbound messages will also trigger `Chat.on('message')`, so user interfaces can respond to outbound messages as well.

If the message fails to send, the promise will be rejected with any applicable error.

```
myNewGroupChat.on('message', (evt, message, chat) => {
  if (message.from == myUser) console.log("Message from myself", message)

  // Inbound and outbound messages can use this same callback to update the UI
  document.getElementById("chatMessageList").innerHTML = chat.toHTML();
});

// Send the message...
try {
  let mySentMessage = await myNewGroupChat.sendMessage("Hello world!")
} catch (err) {
  console.error("Message failed to send:", err); 
}
```

### Emoji
There are two ways to send emoji inside of chat messages. The unicode glyph (eg, 🎱) can be used, or the shortcode version from [EmojiOne](https://www.emojione.com/emoji/v3) (eg `:confused:`) can be used. Messages can even use a combination of both: 

```javascript
let emojiMsg = await myChat.sendMessage('hello 👋 :thumbs_up:')
```

The official Skrumble clients will replace shortcodes with the proper emoji glyphs (eg, `:thumbs_up:` into 👍), and any unicode glyphs will be rendered in the local character set.


### Mentions
When sending messages with the type of `text`, the body can contain **mentions** of other users or groups. When a user is mentioned, they'll recieve an additional notification that someone has mentioned them in a chat. Users will only receive notifications if the mention happens in a group they have access to. Group mentions simply act as links to other groups.

On the official [skrumble desktop client](https://app.skrumble.com), both types of mentions will be parsed into links that can be hovered-over for more information. Messages can contain as many mentions as desired, and will work in both private and group chats.

The format for mentions is similar to XML. To mention a user, specify their TeamUserID as the `user` attribute, and their name as the content of the node. Or to mention a group, specify the Chat ID as the `room` attribute, and the group name as the content of the node:
```xml
<mention user="abc123...">Lauren Ipsum</mention>
<mention room="123abc...">My Group Name</mention>
```
Note that only one mention per tag is allowed, but a message can contain an unlimited number of mentions.

When sending, simply add the `<mention>` tag to the body of your message: 
```javascript
let userMentionMsg = await myChat.sendMessage(`Hey, <mention user="abc123...">Lauren Ipsum</mention> how's it going!`)
```

This can be made even easier if you already have the `User` object that you're trying to mention: 
```javascript
let user = await User.get({ id: "abc123..." });
let userMentionMsg = await myChat.sendMessage(`Hey, <mention user="${user.id}">${user.first_name} ${user.last_name}</mention> how's it going!`);
```

When receiving a message containing mentions, the ChatMessage properties `room_mentions` and `user_mentions` will respectively have an array of group or user objects, however: 
```
myNewGroupChat.on('message', (evt, message, chat) => {

  // This message contains user mentions
  if (message.user_mentions.length > 0) {

    // Log all the mentioned users 
    message.user_mentions.map((mentioned_user) => {
      console.log(`Mentioned user: ${mentioned_user.first_name} ${mentioned_user.last_name} (${mentioned_user.id})`) 
    });

  }

  // This message contains room mentions
  if (message.room_mentions.length > 0) {

    // Log all the mentioned groups 
    message.room_mentions.map((mentioned_group) => {
      console.log(`Mentioned group: ${mentioned_group.name} - ${mentioned_group.purpose} (${mentioned_group.id})`) 
    });

  }

});
```



### Translations
Any message with the type of `text` can be translated into the language of choice for the current user. Languages for the translation are automatic and based on the `language` property of the user sending the message, and the user performing the translation. For example, if a user with the `language` of `es` sends a message, and the current user has a language of `fr`, then this will attempt to translate from Spanish to French.

```
// Listen for new incoming message. `evt` is the raw socket event, 
// `message` is the new ChatMessage instance, and `chat` is the Chat instance. 
myNewGroupChat.on('message', async (evt, message, chat) => {
    
    if (message.from.language != "en") {
        // This is from a non-english speaking user
        let en_translation = await message.translate(); 
        console.log(`New message translated: ${en_translation}`)
    }

});
```
