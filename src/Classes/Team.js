import { APISocket } from "./APISocket";
import { Logger } from "./Logger";
import { User } from "./User";
import axios from 'axios'; 


/**
 * Fields that can be edited after creating a team
 *
 * @ignore
 */
let editable_fields = [
    'team_name', 
    'country',
    'city',
    'state',
    'address_1',
    'address_2',
    'postal',
    'timezone',
    'caller_id_name',
    'caller_id_number',
];


/**
 * @class 
 * @hideconstructor
 * @classdesc
 * The settings and info for a team. 
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
        return new Team(team);

    }


    /**
     * @summary
     * Creates a team
     *
     * @description
     * Creates a team by first creating an Owner account, who is the first user
     * on the team. Then creates the team and assigns the Owner to it. NB: Team names are unique 
     *
     * @param {Object} opts                     Options for the request
     * @param {String} opts.owner_first_name    Owner's first name
     * @param {String} opts.owner_last_name     Owner's last name
     * @param {String} opts.owner_email         Owner's email. Used later for authentication and cannot be changed.
     * @param {String} opts.owner_password      Owner's password
     * @param {String} opts.name                Name of the team
     * @param {String} opts.country             Team country
     * @param {String} opts.city                Team city
     * @param {String} opts.state               Team state
     * @param {String} [opts.referral_code]     Referral code, if any
     *
     * @returns {Promise} Promise that will resolve with the newly created team if the team creation was successful, and be rejected with an error as the first argument if the attempt fails  
     *
     * @example
     * let owner_email = "owner@example.com";
     * let owner_password = "hunter2";
     *
     * Team.create({
     *   owner_first_name: "jane",
     *   owner_last_name: "doe",
     *   owner_email,
     *   owner_password,
     *   name: "My SDK Team",
     *   country: "Canada",
     *   city: "Toronto",
     *   state: "ON"
     * })
     *   .then((newTeam) => {
     *     console.log("new team created", newTeam);
     *
     *     // You can log-in now as the owner
     *     APISocket.login({ 
     *       email: owner_email,
     *       password: owner_password
     *     })
     *   })
     *   .catch((err) => console.error("team creation err", err))
     */
    static async create(opts) {

        var options = Object.assign({}, {
            owner_first_name: "",
            owner_last_name: "",
            owner_email: "",
            owner_password: "",
            name: "",
            country: "",
            city: "",
            state: "",
            referral_code: ""
        }, opts);

        let team_exists;
        let owner_exists;
        let owner_res;
        let team_res;

        // Check for required fields 
        if (!options.owner_first_name)  throw Error("Team.create requires an owner first name (opts.owner_first_name)");
        if (!options.owner_last_name)   throw Error("Team.create requires an owner last name (opts.owner_last_name)");
        if (!options.owner_email)       throw Error("Team.create requires an owner email (opts.owner_email)");
        if (!options.owner_password)    throw Error("Team.create requires an owner password (opts.owner_password)");
        if (!options.name)              throw Error("Team.create requires a team name (opts.name)");
        if (!options.country)           throw Error("Team.create requires a team country (opts.country)");
        if (!options.city)              throw Error("Team.create requires a team city (opts.city)");
        if (!options.state)             throw Error("Team.create requires a team state (opts.state)");

        // Type-check fields
        if (typeof options.owner_first_name !== "string") throw TypeError(`Team.create owner_first_name must be a string, received ${typeof options.owner_first_name}`);
        if (typeof options.owner_last_name !== "string") throw TypeError(`Team.create owner_last_name must be a string, received ${typeof options.owner_last_name}`);
        if (typeof options.owner_email !== "string") throw TypeError(`Team.create owner_email must be a string, received ${typeof options.owner_email}`);
        if (typeof options.owner_password !== "string") throw TypeError(`Team.create owner_email must be a string, received ${typeof options.owner_email}`);
        if (typeof options.name !== "string") throw TypeError(`Team.create name must be a string, received ${typeof options.name}`);
        if (typeof options.country !== "string") throw TypeError(`Team.create country must be a string, received ${typeof options.country}`);
        if (typeof options.city !== "string") throw TypeError(`Team.create city must be a string, received ${typeof options.city}`);
        if (typeof options.state !== "string") throw TypeError(`Team.create state must be a string, received ${typeof options.state}`);

        // Check to see if the team already exists
        try {
            team_exists = await Team.exists(options.name) 
        } catch (err) {
            throw Error(err);
        }

        if (team_exists) throw Error(`Team.create can't use an existing team name, ${options.name} is already in use`) 

        // Check to see if the owner already exists
        try {
            owner_exists = await User.exists(options.owner_email) 
        } catch (err) {
            throw Error(err);
        }
    
        if (owner_exists) { 
            throw Error(`Team.create can't use an existing owner, ${options.owner_email} is already in use`);
        } else {

            // First create the team owner
            try {
                owner_res = await axios.post(`${APISocket.api_url}/v3/user`, {
                    first_name: options.owner_first_name,
                    last_name: options.owner_last_name,
                    email: options.owner_email,
                    password: options.owner_password,
                }); 
            } catch(err) {
                throw Error(err);
            }

            // If the owner was created, create the team
            if (parseInt(owner_res.status, 10) === 201) { 
                try {
                    team_res = await axios.post(`${APISocket.api_url}/v3/team`, {
                        team_name: options.name,
                        owner: owner_res.data.id,
                        country: options.country,
                        city: options.city,
                        state: options.state,
                        ref: options.referral_code,
                    });
                } catch(err) {
                    throw Error(err);
                }

                if (parseInt(team_res.status, 10) === 201) { 
                    return new Team(team_res.data);
                } else {
                    throw Error(`Team.create failed to create a Team. Error ${team_res.status}: ${team_res.statusText}`)
                }

            } else {
                // Owner wasn't created properly
                throw Error(`Team.create failed to create a Team owner. Error ${owner_res.status}: ${owner_res.statusText}`)
            }

        }

    }



    /**
     * @summary
     * Admin-only: save any changed information about a Team. The original team object will be modified in-place
     * with whatever values are applied successfully, and a copy will be passed into the promise.
     *
     * @returns {Promise} Promise that will resolve with the updated Team as the first argument, or rejected with the error as the first argument 
     *
     * @example
     * let me = await APISocket.login({ ...opts })
     * let myTeam = me.teams[0];
     *
     * myTeam.team_name = "New team name";
     * myTeam.city = "Toronto";
     * myTeam.save()
     *   .then((myTeam) => console.log("Updated myTeam", myTeam))
     *   .catch((err) => console.error("Team save error", err))
     */
    async save() {

        let save_res; 

        if (!this.id) throw Error("Team.save must be run on a User object with an ID");

        // Only send the params this request that can be edited 
        let request_options = _.pick(this, editable_fields);

        // Send updated values to API 
        try {
            save_res = await APISocket.patch(`team/${this.id}`, request_options);
        } catch (err) {
            throw Error(err);
        }

        // Assign in passed values
        if (save_res) {
            for (let [key, value] of Object.entries(save_res)) {
                if (this.hasOwnProperty(key))  this[key] = value;  
            }
        }

        return this;

    }


    /**
     * @summary
     * Check if a team exists, in order to create one safely. This is called automatically during Team.create() 
     * 
     * @param {String} team_name        Team name to check the existence of  
     * @returns {Promise}           Promise that will resolve with a boolean representing if a team with that name exists or not, or rejected with the error as the first argument 
     *
     * @example
     * Team.exists("My team name")
     *   .then((teamExists) => console.log(teamExists ? 'team exists!' : 'no team with that name'))
     *   .catch((err) => console.error(err))
     */
    static async exists(team_name = "") {

        let exists_res;
        let response_code;

        if (!team_name) Logger.error("Team.exists requires a team name");
        if (typeof team_name !== "string") throw TypeError(`Team.exists team name must be a string, received ${typeof team_name}`);

        try {
            exists_res = await axios.post(`${APISocket.api_url}/v3/team/exist`, { team_name });
        } catch(err) {
            return new Error(err);
        }

        response_code = parseInt(exists_res.status, 10);

        if (Math.floor(response_code / 100) === 2) { 
            if (
                typeof exists_res.data == "object" 
                && Object.prototype.hasOwnProperty.call(exists_res.data, 'exists')
            ) {
                return !!exists_res.data.exists;
            }
        } else {
            return false;
        }

    }



}
