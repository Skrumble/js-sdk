import { APISocket } from "./APISocket";
import { Logger } from "./Logger";
import { User } from "./User";
import { Guest } from "./Guest";

(async function loadDependencies() {
})()

/**
 * @class ChatMessage
 * @classdesc
 * ChatMessage instances describe individual messages inside a {@link Chat}
 */
export class ChatMessage {

    constructor(opts) {

        /**
         * @prop type
         * @type {String}
         * @summary
         * The type of event this message is for. 
         *
         * @description
         * ChatMessages don't just represent traditional text messages or files, but also several different types of notifications about the chat itself. Options are:
         *
         * | Type | Description |
         * | --- | --- |
         * | `text` | This is a text chat message, with the content in {@link ChatMessage#body `body`}. |
         * | `file` | A file message with the properties of the file on the {@link ChatMessage#file `file`} property. |
         * | `call_log` | A record of a call with this chat. Call logs for groups will have the `body.type` of `conference_started` (starting a call), `conference_ended` (call ended), `conference_join` (user joining call), or `conference_leave` (user leaving call). Private chats will have the `body.type` of `missed` or `call` (which will have `body.duration` with the duration of the call in seconds). |
         * | `voicemail` | A voicemail left by another user in a private chat. The {@link ChatMessage#file `file`} field will be a wav file of the message |
         * | `chat_renamed` | Group chat only. The `name` of this chat was changed. The `body` will be an object: `{ 'new': 'group new name', 'old': 'group previous name' }` |
         * | `chat_purpose` | Group chat only. The `purpose` of this chat was changed. The `body` will be an object: `{ 'new': 'group new purpose', 'old': 'group prev purpose' }` |
         * | `chat_locked` | Group chat only. A user has locked/unlocked a group. The `body` will be `1` if the group was locked, and `0` if it was unlocked |
         * | `participant_added` | Group chat only. User(s) have been added to the chat. The `body` will be an array of users that have been added. | 
         * | `participant_removed` | Group chat only. User(s) have been removed from the chat. The `body` will be an array of users that have been removed. | 
         * | `recording_video` | The recording of a group conference, along with an optional transcript. The attached file is the recording. |  
         */
        this.type = ""

        /**
         * @prop body
         * @type {String}
         * @summary
         * The content of the message.
         */
        this.body = "" 


        /**
         * @prop file
         * @type {Object}
         * @summary
         * Files attached to this message, or `false`. 
         *
         * @description
         * For messages with a {@link ChatMessage#type `type`} of `file`, `recording_video`, or `voicemail`, this will be the information about the file. Messages of other types will have this set to `false`.
         *
         * | Property       | Description                                           |
         * | --------       | -----------                                           |
         * | `url`          | Public URL to download this file                      |
         * | `created_at`   | ISO 8601 string of the time the file was created      |
         * | `name`         | Full uploaded path and filename                       |
         * | `size`         | Filesize in bytes                                     |
         * | `filename`     | Filename only                                         |
         * | `thumb_url`    | Thumbnail URL, for `png`, `jpg`, and `gif` files only | 
         * | `thumbHeight`  | Height in px of the thumbnail                         |
         * | `thumbWidth`   | Width in px of the thumbnail                          |
         */
        this.file = false;

        /**
         * @prop chat
         * @type {String}
         * @summary
         * The ID of the Chat this belongs to
         */
        this.chat = ""


        /**
         * @prop created_at
         * @type {String}
         * @summary
         * The ISO 8601 string representing the time this message was created on the server
         */
        this.created_at = ""

        /**
         * @prop from
         * @type {(User|Guest)}
         * @summary
         * Who this message was sent by.
         */
        this.from = "" 

        /**
         * @prop id
         * @type {String}
         * @summary
         * The unique ID of this message.
         */
        this.id = ""

        /**
         * @prop language
         * @type {String}
         * @summary
         * The language this message was sent in.
         */
        this.language = ""

        /**
         * @prop links
         * @type {String[]}
         * @summary
         * An array of URLs in this message.
         */
        this.links = []

        /**
         * @prop room_mentions
         * @type {Array}
         * @summary
         * An array of mentions to chats in this message.
         */
        this.room_mentions = []

        /**
         * @prop user_mentions
         * @type {Array}
         * @summary
         * An array of mentions to users in this message
         */
        this.user_mentions = []


        // Assign in passed values
        for(let [key, value] of Object.entries(opts)) {
            if (this.hasOwnProperty(key)) { 

                if (key == "from" && value.role) { 
                    if (value.role !== "guest") value = new User(value);
                    if (value.role === "guest") value = new Guest(value);
                }

                this[key] = value;
            } else {
                // Logger.info("Key not found", key, value);
            }
        }


    }


    /**
     * @summary
     * Converts a chat to an HTML fragment for debugging purposes.
     *
     * @example
     * document.getElementById("chat_msg_debug") = chat_message.toHTML();
     */
    toHTML() {

        var date = new Date(this.created_at).toLocaleString();
        var message = `<em>(${date})</em> <strong>${this.from.first_name} ${this.from.last_name}</strong>`;

        switch (this.type) {

            case "text":
                this.body = ("" + this.body).replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g, '<a href="$1" target="_blank">$1</a>')
                message += `: ${this.body}`;
                break;

            case "call_log":
                switch (this.body.type) {
                    case "conference_started":
                        message += ` started a call`;
                        break;
                    case "conference_ended":
                        message += ` ended the call`;
                        break;
                    case "conference_join":
                        message += ` joined the call`;
                        break;
                    case "conference_leave":
                        message += ` left the call`;
                        break;
                    case "missed": 
                        message += ` called <strong>${this.body.to.first_name} ${this.body.to.last_name}</strong> (missed)`
                        break;
                    case "call":
                        message += ` called <strong>${this.body.to.first_name} ${this.body.to.last_name}</strong> <em>(${this.body.duration}s)</em>` 
                        break;
                    default: 
                        // debugger;

                }
                break; 

            case "participant_added":
                message += " joined the conversation";
                break;

            case "participant_removed":
                message += " left the conversation";
                break;

            case "chat_locked":
                if (!!this.body) {
                    message += " locked the conversation";
                } else {
                    message += " unlocked the conversation";
                }
                break;

            case "chat_purpose":
                message += ` changed the purpose from <em>${this.body.old}</em> to <em>${this.body.new}</em>`;
                break;

            case "chat_renamed": 
                message += ` renamed the conversation from <em>${this.body.old}</em> to <em>${this.body.new}</em>`;
                break;

            case "voicemail": 
                message += ` left a voicemail [<a href="${this.file.url}" target="_blank">link</a>]`;
                break;

            case "file": 
                message += ` sent <em>${this.file.filename}</em> [<a href="${this.file.url}" target="_blank">link</a>]`;
                break;

            case "recording_video":
                message += ` made a recording [<a href="${this.file.url}" target="_blank">link</a>]`;
                break;

            case "room":
                message = "";
                break;

            default:
                // debugger;
                message = "";
                break;
        }

        return message;
    }


}
