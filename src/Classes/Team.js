import { APISocket } from "./APISocket";
import { Logger } from "./Logger";

(async function loadDependencies() {
})()

/**
 * @class Team
 * @classdesc
 * The settings and info for a team. 
 *
 * @summary
 * Creates a team object
 *
 */
export class Team {

    constructor(opts) {


        /**
         * @prop id
         * @type {String} 
         * @summary
         * Unique ID of the team.
         */
        this.id = "";


        /**
         * @prop owner
         * @type {User}
         * @summary
         * The User that created this team.
         */
        this.owner = false;


        /**
         * @prop team_name
         * @type {String}
         * @summary 
         * Display name of the team.
         */
        this.team_name = "";


        /**
         * @prop team_avatar
         * @type {String}
         * @summary
         * The URL of the team's avatar.
         */
        this.team_avatar = "";


        /**
         * @prop slug
         * @type {String}
         * @summary
         * Team name with special characters removed. Used to create URL-friendly guest links.
         */
        this.slug = "";


        /**
         * @prop country
         * @type {String}
         * @summary
         * Team's country.
         */
        this.country = "";


        /**
         * @prop city
         * @type {String}
         * @summary
         * Team's city.
         */
        this.city = "";


        /**
         * @prop state
         * @type {String}
         * @summary
         * Team's province or state
         */
        this.state = "";


        /**
         * @prop address_1
         * @type {String} 
         * @summary
         * Team's address line 1
         */
        this.address_1 = "";


        /**
         * @prop address_2
         * @type {String}
         * @summary
         * Team's address line 2
         */
        this.address_2 = "";


        /**
         * @prop postal
         * @type {String}
         * @summary
         * Team's postal or zip code
         */
        this.postal = "";


        /**
         * @prop timzeon
         * @type {String}
         * @summary
         * The TZ string of this team's timezone
         */
        this.timezone = "";

        /**
         * @prop autoreception
         * @type {String}
         * @summary
         * What point of setting-up autoreception is complete. Options are `completed` @todo
         */
        this.autoreception = "";


        /**
         * @prop caller_id_name
         * @type {String}
         * @summary
         * The default caller ID name field for all members.  
         *
         * @see {@link User#caller_id_name}
         */
        this.caller_id_name = "";


        /**
         * @prop caller_id_number
         * @type {String}
         * @summary
         * The default caller ID number field for all members.
         *
         * @see {@link User#caller_id_number}
         */
        this.caller_id_number = "";


        for(let [key, value] of Object.entries(opts)) {
            if (this.hasOwnProperty(key)) { 
                this[key] = value;
            } else {
                // Logger.info("Key not found", key, value);
            }
        }

    }

    /**
     * Loads a team by ID
     *
     * @param {Object} opts Options for the request
     * @param {String} opts.id  The ID of the team to load
     */
    static async get(opts) {

        var options = Object.assign({}, {
            id: false
        }, opts);

        var team = await APISocket.get(`team/${options.id}?populate=departments&users=true`)
        console.log('team is', team);
        return new Team(team);

    }

}
