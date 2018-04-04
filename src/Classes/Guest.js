import { Logger } from "./Logger"


/**
 * @class Guest
 * @classdesc
 * Guests are temporary users that are granted access to one group {@link Chat} using the chat's {@link Chat#guest_url guest URL}. 
 */
export class Guest {
    
    constructor(options) {


        /**
         * @readonly
         * @prop id
         * @type {String}
         * @summary
         * The ID of the user, assigned by the API
         *
         */
        this.id = ""


        /**
         * @prop first_name
         * @type {String}
         * @summary
         * The first name of the guest.
         */
        this.first_name = ""


        /**
         * @prop last_name
         * @type {String}
         * @summary
         * The last name of the guest.
         */
        this.last_name = ""


        /**
         * @prop avatar
         * @type {String}
         * @summary
         * The URL of the guest's avatar.
         */
        this.avatar = ""


        /**
         * @prop email
         * @type {String}
         * @summary
         * The email address of the guest.
         */
        this.email = ""


        /**
         * @prop chat_id
         * @type {String}
         * @summary
         * The {@link Chat#id Chat ID} this guest is valid for.
         */
        this.chat_id = ""


        /*
         * @prop extensionSecret
         * @type {String} 
         * @summray
         * The user's password for SIP phone registration. 
         */
        this.extension_secret = "";


        /**
         * @prop role
         * @type {String}
         * @summary
         * The user's role on the team, possibilities are `admin` or `member`
         */
        this.role = ""



        /**
         * @readonly
         * @prop teams
         * @type {Team[]}
         * @summary
         * A list of teams this user is on
         */
        this.teams = []


        /**
         * @prop caller_id_name
         * @type {String} 
         * @summary
         * When making outbound calls, this will be the name field of the Caller ID, visible to the other caller. If this is blank
         * (default), the name will default to {@linkcode Team#caller_id_name Team.caller_id_name}.
         */
        this.caller_id_name = ""

        
        /**
         * @prop caller_id_number
         * @type {String}
         * @summary
         * When making outbound calls, this will be the number field of the Caller ID, visible to the other caller. If this is blank (default), the name will default to {@linkcode Team#caller_id_number Team.caller_id_number}.
         */
        this.caller_id_number = ""


        // Assign in passed values
        for(let [key, value] of Object.entries(options)) {
            if (this.hasOwnProperty(key)) { 
                this[key] = value;
            } else {
                // Logger.info("Key not found in Guest", key, value);
            }
        }

    }

}
