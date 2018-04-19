import { APISocket } from "./APISocket";
import { Logger } from "./Logger";
import { User } from "./User";
import { Guest } from "./Guest";
import { ChatMessage } from "./ChatMessage";

/**
 * @class Chat
 * @classdesc
 * A chat comes in two major types (see the `type` property):
 *
 * * **Private** chats between exactly two {@link User users}
 * * **Group** chats, which can contain a mixture of users and {@link Guest guests}. Groups must contain at least one user, but have no upper-limit. Groups also have the property `roomNumber` and `pin`, which allows outside callers to call the chat directly.
 */
export class Chat {

    _mimeTypes = {
        'ai'     : 'application/postscript',
        'au'     : 'audio/basic',
        'avi'    : 'video/x-msvideo',
        'bat'    : 'text/plain',
        'bmp'    : 'image/x-ms-bmp',
        'c'      : 'text/plain',
        'css'    : 'text/css',
        'doc'    : 'application/msword',
        'dot'    : 'application/msword',
        'eps'    : 'application/postscript',
        'gif'    : 'image/gif',
        'h'      : 'text/plain',
        'htm'    : 'text/html',
        'html'   : 'text/html',
        'jpeg'   : 'image/jpeg',
        'js'     : 'application/x-javascript',
        'json'   : 'application/json',
        'mov'    : 'video/quicktime',
        'movie'  : 'video/x-sgi-movie',
        'mp2'    : 'audio/mpeg',
        'mp3'    : 'audio/mpeg',
        'mp4'    : 'video/mp4',
        'mpeg'   : 'video/mpeg',
        'numbers': 'application/octet-stream',
        'pdf'    : 'application/pdf',
        'png'    : 'image/png',
        'pot'    : 'application/vnd.ms-powerpoint',
        'ppa'    : 'application/vnd.ms-powerpoint',
        'ppm'    : 'image/x-portable-pixmap',
        'pps'    : 'application/vnd.ms-powerpoint',
        'ppt'    : 'application/vnd.ms-powerpoint',
        'pptx'   : 'application/vnd.ms-powerpoint',
        'ps'     : 'application/postscript',
        'pwz'    : 'application/vnd.ms-powerpoint',
        'py'     : 'text/x-python',
        'pyc'    : 'application/x-python-code',
        'pyo'    : 'application/x-python-code',
        'qt'     : 'video/quicktime',
        'tif'    : 'image/tiff',
        'txt'    : 'text/plain',
        'vcf'    : 'text/x-vcard',
        'wav'    : 'audio/x-wav',
        'wiz'    : 'application/msword',
        'wsdl'   : 'application/xml',
        'xbm'    : 'image/x-xbitmap',
        'xlb'    : 'application/vnd.ms-excel',
        'xls'    : 'application/vnd.ms-excel',
        'xlsx'   : 'application/vnd.ms-excel',
        'xml'    : 'text/xml',
        'xpdl'   : 'application/xml',
        'xpm'    : 'image/x-xpixmap',
        'xsl'    : 'application/xml',
        'zip'    : 'application/zip'
    }


    _listeners = {
        "updated": [],
        "message": []
    }

    /**
     * @prop id
     * @type {String}
     * @summary
     * The ID of the chat.
     */
    id = "";


    /**
     * @prop type
     * @type {String} 
     * @summary
     * The type of the chat, options are `private` or `group`. 
     */
    type = "";


    /**
     * @prop name
     * @type {String} 
     * @summary
     * The name of the chat. For private chats, this will be name of the other user.
     * For a group chat, this will be a separate, unique name.
     */
    name = "";


    /**
     * @prop purpose
     * @type {String}
     * @summary
     * The intended purpose of the chat. Only present on groups, this will be ignored
     * for private chats
     */
    purpose = "";

    
    /**
     * @prop avatar
     * @type {String}
     * @summary
     * The avatar for the chat. Only present on rooms
     */ 
    avatar = "";

    /**
     * @prop roomNumber
     * @type {Number}
     * @summary
     * Room number for calling to this chat via PSTN bridge.
     */
    roomNumber = null;


    /**
     * @prop unread
     * @type {Number}
     * @summary
     * Number of unread messages in this chat from the current user's perspective.
     */
    unread = 0;

    
    /**
     * @prop locked
     * @type {Boolean}
     * @summary
     * Locked groups will block guest access, and disconnect any guests. Unlocked groups allow guests
     * to access the chat using the {@linkcode Chat#url} property
     */
    locked

    /**
     * @prop pin
     * @type {Number}
     * @summary
     * PIN for calling to this chat via PSTN bridge, or for guest logins.
     */
    pin = null;


    /**
     * @prop links
     * @type {Object[]}
     * @summary
     * List of URLs referenced in the messages of the chat.
     */
    links = [];


    /**
     * @prop files
     * @type {Object[]}
     * @summary
     * List of files sent in the chat.
     */
    files = [];


    /**
     * @prop url
     * @type {String}
     * @summary
     * The URL that guests can access this chat at. Only available on group chats.
     */
    url = "";


    /**
     * @prop messages
     * @type {ChatMessage[]} 
     * @summary
     * The list of {@link ChatMessages} in this chat, in chronological order.
     */
    messages = [];


    /**
     * @prop users
     * @type {User[]}
     * @summary 
     * The list of {@link User Users} in this chat.
     */
    users = [];


    /**
     * @prop created_at
     * @type {String}
     * @summary
     * ISO-8601 timestamp of when this chat was created. 
     */
    created_at = false;


    /**
     * @prop updated_at
     * @type {String}
     * @summary
     * ISO-8601 timestmap of when this chat was last modified.
     */
    updated_at = false;

    
    /**
     * @prop last_seen
     * @type {String}
     * @summary
     * ISO-8601 timestamp of when this chat was last read, from the perspective
     * of the currently logged-in user.
     */
    last_seen = false;


    /**
     * @prop last_message_time
     * @type {String}
     * @summary
     * ISO-8601 timestamp of when this chat received it's last message
     */
    last_message_time = false;


    /**
     * @prop do_not_disturb
     * @type {Boolean}
     * @summary
     * Has this chat been set to silence notifications, from the perspective
     * of the currently logged-in user.
     */
    do_not_disturb = false;


    /**
     * @prop favourite
     * @type {Boolean}
     * @summary
     * Has this chat been marked as a favourite, from the perspective of the 
     * currently logged-in user.
     */
    favourite = false;


    /**
     * @prop team
     * @type {Team}
     * @summary
     * ID of the Team that this chat belongs to. Needed for the `save()` method.
     * TODO: find a more elegant way to save this
     */
    team = false;




    constructor(opts) {

        // Assign in passed values
        for (let [key, value] of Object.entries(opts)) {
            if (this.hasOwnProperty(key)) { 

                // Stop using the word "room"
                if (key == "type" && value == "room") value = "group";

                // Turn the users list into real users
                if (key == "users") {
                    value = value.map((user) => {
                        user = new User(user)
                        return user;
                    });
                }

                this[key] = value;

            } else {
                // Logger.info("Key not found", key, value);
            }
        }


        if (this.id) {

            APISocket.on('chat', (chat_evt) => {
                
                let updated_evt = false; // Should this event trigger `updated` event
                let message_evt = false; // Should this event trigger `message` event

                switch (chat_evt.verb) {
                    case "addedTo": 
                        if (chat_evt.attribute == "messages") {
                           
                            switch (chat_evt.added.type) {
                                case "chat_renamed":
                                    this.name = chat_evt.added.body.new;
                                    updated_evt = true;
                                break;

                                case "chat_locked":
                                    this.locked = !!chat.evt.added.body;
                                    updated_evt = true;
                                break;

                                case "chat_purpose":
                                    this.purpose = chat_evt.added.body.new;
                                    updated_evt = true;
                                break;
                            }

                            // If this wasn't an update, it was message, so notify listeners
                            if (!updated_evt) message_evt = true;

                        } 
                    break;

                    case "updated":
                        if (typeof chat_evt.data.unread !== "undefined") { 
                            this.unread = chat_evt.data.unread; 
                            updated_evt = true
                        } else if (typeof chat_evt.data.last_message_time !== "undefined") {
                            this.last_message_time = chat_evt.data.last_message_time;
                            updated_evt = true
                        } else if (typeof chat_evt.data.updatedAt !== "undefined") {
                            this.updated_at = chat_evt.data.updatedAt;
                            updated_evt = true
                        } 
                    break;

                }

                if (updated_evt) {
                    this._listeners.updated.map((callback) => {
                        callback.call(this, chat_evt, this);
                    });
                } else if (message_evt) {
                    let message = new ChatMessage(chat_evt.added)
                    this._listeners.message.map((callback) => {
                        this.messages.unshift(message)
                        callback.call(this, chat_evt, this, message)
                    });
                }

            });

        }


    }


    _onSocketMessage() {


    }



    // Try and get file extenion from the filename or mimetype
    _getFileExtension(fileObj) {

        let extension = /(?:\.([^.]+))?$/.exec(fileObj.filename)[1];

        // Try and get proper file extenion based on mimetype
        for (let ext in this._mimeTypes) {
            if(this._mimeTypes[ext] == fileObj.mimetype) extension = ext;
        }

        if (fileObj.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            extension = 'xlsx';
        }

        return extension;

    }
    


    /**
     * @static
     * @summary
     * Gets all chats that this user has access to, based on the pagination options `limit`, and `skip`
     *
     * @param {Object} opts                 The options for this requiest
     * @param {Number} [opts.limit=1000]    Maximum number of chats to load
     * @param {Number} [opts.skip=0]        Chat number to start from
     */
    static async getAll(opts) {

        let options = Object.assign({}, {
            limit: 1000,
            skip: 0
        }, opts);

        let chats = [];
        let chats_raw = await APISocket.get(`chat?populate=users&limit=${options.limit}&skip=${options.skip}`);

        chats_raw.map((chat_info) => {

            let chat = new Chat(chat_info)

            // Turn user list into real user obects
            if (chat_info.users && chat_info.users.legnth > 0) {
                chat.users = chat_info.users.map((chat_userinfo) => new User(chat_userinfo));
            }

            chats.push(chat);
        });

        return chats;
    }


    /**
     * @summary
     * Gets a specific chat by ID. Loads chat messages by default, but for smaller responses this can be disabled
     * with `opts.load_messages = false` 
     *
     * @param {Object} opts                         The options for this request
     * @param {String} opts.id                      The ID of the chat to load
     * @param {Boolean} [opts.load_messages=true]   `true` to load the chat message list, or `false` to disable
     * @param {Number} [opts.message_limit=50]      Maximum number of messages to load
     * @param {Number} [opts.message_skip=0]        Message number to start from
     */
    static async get(opts) {
            
        let options = Object.assign({}, {
            id: false,
            load_messages: true,
            message_limit: 50,
            message_skip: 0
        }, opts);

        if (!options.id) Logger.error("Chat.get requires an id");

        let querystring = "populate=users&sort=updatedAt+DESC&limit=1000&skip=0"

        let chat_info = await APISocket.get(`chat/${options.id}?${querystring}`)

        if (options.load_messages === true) {
            let messages = await APISocket.get(`chat/${options.id}/messages?populate=file&populate=user_mentions&limit=${options.message_limit}&skip=${options.message_skip}`);
           
            messages = messages.sort(function(a, b) {
                if (new Date(a) < new Date(b)) {
                    return 1;
                } else if (new Date(a) > new Date(b)) {
                    return -1;
                } else if (new Date(a) == new Date(b)) {
                    return 0;
                }
            });

            messages.map((message_data) => {
                chat_info.messages.push(new ChatMessage(message_data)); 
            })
        }

        return new Chat(chat_info);

    }


    /**
     * @static
     * @async
     * @summary
     * Saves a chat object by attempting to commit any dirty fields to the appropriate API endpoints. If the chat
     * has an `id` and `created_at` date, then it will attempt to save the information. If 
     */
    async save(opts) {
        
        let options = Object.assign({}, {

        }, opts);

        if (this.created_at && this.id) {
            console.log("Existing chat");
        } else {
            console.log("No created_at, creating new");
            // This is a totally new chat
            let type = (this.type == "group") ? "room" : this.type; 
            let chat_info = await APISocket.post(`chat/`, {
                name: this.name,
                type: type,
                purpose: this.purpose,
                team: this.team,
                users: this.users
            })
            console.log("Creating a chat returned", chat_info);
            return new Chat(chat_info); 

        }

    }


    /**
     * @async
     * @summary
     * Enables guest access on this chat by generating a new {@link Chat#pin PIN}, and invalidate any existing guest sessions.
     */
    async generateGuestURL(opts) {

        let options = Object.assign({}, {

        }, opts);

        let guest_response = await APISocket.get(`chat/${this.id}/generateUrl`)

        if (guest_response.constructor.name == "Array") {
            return new Chat(guest_response[0]); 
        } else {
            return new Chat(guest_response);
        }

    }

    /**
     * @async
     * @summary
     * Sends a chat message.
     *
     * @description
     * Sends a text message to a chat, and then triggers the `.on('message')` listeners with the content of the new message.
     * 
     * @param {String} message  The message to send
     */
    async sendMessage(message) {

        if (!message || typeof message != "string") return;
        if (!this.id) return;

        let message_props = {
            type: "text",
            body: message 
        }

        let result = APISocket.post(`chat/${this.id}/messages`, message_props)

        let msg_object = new ChatMessage(Object.assign(message_props, {
            from: APISocket.current_user,
            chat: this, 
            created_at: new Date().toString()
        }));

        this._listeners.message.map((callback) => {
            this.messages.unshift(msg_object)
            callback.call(this, {}, this, msg_object);
        });

        return new Promise((resolve, reject) => {
            resolve(msg_object);
        });

    }


    /**
     * @async
     * @summary
     * Sends a file 
     * 
     * @param {Object} fileObj      The file to send
     */
    async sendFile(fileObj) {

        if (!fileObj) return;
        if (!this.id) return;

        // Request data
        let message_props = {
            type: "filestack",
            chat_id: this.id,
            body: fileObj 
        }

        message_props.body.extension = this._getFileExtension(fileObj); 

        let result = APISocket.post(`chat/${this.id}/messages`, message_props)

        let msg_object = new ChatMessage(Object.assign(message_props, {
            from: APISocket.current_user,
            chat: this, 
            created_at: new Date().toString()
        }));

        this._listeners.message.map((callback) => {
            this.messages.unshift(msg_object)
            callback.call(this, {}, this, msg_object);
        });

        return new Promise((resolve, reject) => {
            resolve(msg_object);
        });

    }


    /**
     * @summary
     * Adds user(s) to a chat 
     *
     * @param {User[]} users  The user(s) to add. Either supply a single User object, or
     * an array of Users to add each.
     * 
     * @returns {Chat} Successfully adding will return `true` 
     */
     async addUser(users) {

        let add_response;

        if (typeof users === "object" && users.constructor.name === "User") {
            try {
                add_response = await APISocket.post(`chat/${this.id}/users`, {
                    user: users.id
                })
            } catch (err) {
                throw new Error(err);
                return false;
            }
        } else if (Array.isArray(users)) {
            return users.map(async (user) => {
                try {
                    add_response = await APISocket.post(`chat/${this.id}/users`, { user })
                } catch (err) {
                    throw new Error(err);
                    return false;
                }
            })
        } else {
            throw new Error("Chat.addUser only accepts User object(s), recieved", typeof users);
        }


     }


    /**
     * @summary
     * Remoevs user(s) from a chat 
     *
     * @param {User[]} users  The user(s) to remove. Either supply a single User object, 
     * or an array of Users to delete each.
     * 
     * @returns {Chat} Successfully deleting will return `true`
     */
     async removeUser(users) {

        let add_response;

        if (typeof users === "object" && users.constructor.name === "User") {
            try {
                add_response = await APISocket.delete(`chat/${this.id}/users/${users.id}`)
            } catch (err) {
                throw new Error(err);
                return false;
            }
        } else if (Array.isArray(users)) {
            return users.map(async (user) => {
                try {
                    add_response = await APISocket.post(`chat/${this.id}/users/${user}`)
                } catch (err) {
                    throw new Error(err);
                    return false;
                }
            })
        } else {
            throw new Error("Chat.addUser only accepts User object(s), recieved", typeof users);
        }


     }

    
    /**
     * @summary
     * Invite guest(s) to join a group chat. 
     *
     * @description
     * Guests can only be added to chats with the {@link Chat#type `type`} of group, can only access the chat they're added to, and will be removed if {@link Chat#generateGuestURL `generateGuestURL`} is called again.
     *
     * @param {String|Array} emails     Either a single email address, or an array of email addresses to send guest invites to
     *
     * @returns {Promise}               Promise that will be resolved with the result of the invite, or rejected with the error as the first argument.
     *
     * @example
     * Chat.get({ id: "abc123" })
     *   .then((chat) => {
     *     // Send one invite
     *     chat.inviteGuest("myguest1@example.com")
     *
     *     // Send multiple invites
     *     chat.inviteGuest(["myguest2@example.com", "myguest3@example.com"]);
     *   })
     */
    async inviteGuest(emails = []) {

        if (!emails) throw Error("Chat.inviteGuest requires a list of emails");
        if (!Array.isArray(emails) && typeof emails != 'string') throw TypeError("Chat.inviteGuest requires an array or string, received", typeof emails);

        // User supplied a string; make an array for them
        if (!Array.isArray(emails)) emails = [emails]; 

        let add_response;

        // Check to see if the owner already exists
        for (let i = 0; i < emails.length; i++) {
            let guest_exists;
            try {
                guest_exists = await Guest.exists({ 
                    email: emails[i], 
                    team: this.team 
                }) 
            } catch (err) {
                throw Error(err);
            }
            if (guest_exists) throw Error(`Chat.inviteGuest can't invite existing guests, ${emails[i]} is already in use`);
        }

        try {
            add_response = await APISocket.post(`guest/invite`, {
                chat: this.id,
                emails
            })
        } catch (err) {
            throw new Error(err);
        }

        if (
            typeof add_response == "object" 
            && Array.isArray(add_response)
            && add_response.length > 0
        ) {
            return add_response;
        } else {
            throw new Error("Problem inviting guest, received", add_response)
        }

    }


    /**
     * @summary
     * Listen for changes to this chat coming in over the APISocket.
     *
     * @description
     * | Event | Description |
     * | --- | --- |
     * | `updated` | Chat information has changed. Callback will be called with the signature `callback(evt, chat)` with `evt` being the original socket event, and `chat` is the updated Chat object. This happens when a user changes the `purpose`, `locked`, or `name`. | 
     * | `message` | New message to this chat, from someone else or from the current user. Callback will be called with the signature `callback(evt, chat, message)` with `evt` being the original socket event, `chat` is the Chat object with the new message inserted in `messages`, and `message` is the {@link ChatMessage} that was sent. | 
     *
     * @param {String} evt          The event to listen for
     * @param {function} callback   The callback to fire when the event occurs
     */
    on(evt, callback) {

        if (!this.id) return;
        if (!evt || !this._listeners.hasOwnProperty(evt)) return;
        if (!callback || typeof callback != "function") return;

        this._listeners[evt].push(callback);

    }



    /**
     * @summary
     * Converts a chat to an HTML fragment for debugging purposes.
     *
     * @example
     * document.getElementById("chat_debug").innerHTML = my_chat.toHTML();
     */
    toHTML() {

        let name, second_line, messages;

        if (this.type == "private") {
            let other_user = Skrumble.removeSelf(this.users);
            name = `${other_user.first_name} ${other_user.last_name}`
            second_line = "" 
        } else {
            name = this.name;
            second_line = this.purpose;
        }

        if (this.messages.length) { 
            messages = this.messages.reduce(function(acc, msg) {
                acc = (typeof acc == "object") ? `${acc.toHTML()}<br />\n` : acc;
                return `${acc} ${msg.toHTML()}<br />\n`;
            })
        }

        return `
            <header>
                <h1>${name}</h1> 
                <p>${second_line}</p>
            </header>
            
            ${messages}`; 

    }




}
