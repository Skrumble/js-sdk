import { Logger } from "./Logger"
import { APISocket } from './APISocket';
import axios from 'axios';


/**
 * @class 
 * @hideconstructor
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



    /**
     * @summary
     * Check if a guest exists on a given team. 
     *
     * @description
     * Guests are unique to each team, so a Team or TeamID must also be supplied, and can only
     * be called after logging-in. This is called automatically by {@link Chat#inviteGuest `Chat.inviteGuest()`}.
     * 
     * @param {Object} opts             Options for this request
     * @param {String} opts.email       Email of the guest to look for
     * @param {Team|String} opts.team   The team to look for this guest in. Either a Team object or a Team ID
     *
     * @returns {Promise}               Promise that will resolve with a boolean representing if a team with that name exists or not, or rejected with the error as the first argument 
     *
     * @example
     * Guest.exists({ email: "guestuser@example.com", team: myTeam })
     *   .then((guestExists) => console.log(guestExists ? 'guest exists!' : 'no guest with that email'))
     *   .catch((err) => console.error(err))
     */
    static async exists(opts) {

        let options = Object.assign({}, {
            email: '',
            team: '',
        }, opts);

        let exists_res;
        let response_code;

        if (!options.email)  throw Error('Guest.exists requires an email (opts.email)');
        if (!options.team)   throw Error('Guest.exists requires a Team object or a team ID (opts.team)');

        if (typeof options.email != "string")   throw TypeError("Guest.exists email must be a string, received", typeof options.email)
        if (typeof options.team != "string" && options.team.constructor.name != "Team") {
            throw TypeError("Guest.exists team must be either a team ID or a Team object, received", typeof options.team);
        }

        // If user passed a Team object, pull the ID from that
        if (options.team.constructor.name == "Team") options.team = options.team.id 


        try {
            exists_res = await APISocket.post(`team/${options.team}/guest/exists`, { 
                emails: [options.email] 
            });
        } catch(err) {
            return new Error(err);
        }

        if (
            typeof exists_res == "object" 
            && Object.prototype.hasOwnProperty.call(exists_res, 'existing')
        ) {
            return !!exists_res.existing.length;
        }

    }


}
