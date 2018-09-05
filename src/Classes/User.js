import { APISocket } from "./APISocket";
import { Logger } from "./Logger";
import axios from 'axios';
import  _  from 'lodash';

/**
 * Fields that can be edited after creating a user
 *
 * @ignore
 */
let editable_fields = [
    'first_name', 
    'last_name', 
    'position', 
    'caller_id_name', 
    'caller_id_number', 
    'avatar', 
    'dateformat', 
    'forward', 
    'forward_number', 
    'home_number', 
    'mobile_number', 
    'language', 
    'latitude', 
    'longitude', 
    'password', 
    'state', 
    'status', 
    'theme', 
    'timeformat', 
    'timezone', 
    'tooltips', 
    'voicemail', 
    'website', 
    'work_number'
];


/**
 * @class 
 * @hideconstructor
 * @classdesc 
 * The User class allows read access to user information. It's also possible to update User information with {@link User#save `save()`} if the User you're editing is yourself, or 
 * if you're logged-in as an Admin. Static methods like {@link User#get `get()`} or {@link User#create `create()`} won't work on User instances, but will retrieve or create 
 * User objects respectively. Users will emit socket events when information about them is modified
 * 
 * @summary
 * A Skrumble Team Member.
 *
 *
 * @example 
 * var workingUser = User.create({
 *   email: "user@example.com",  // Required
 *   plan: "pro",                // Required
 *   first_name: "Test",         // Required, minlength: 2
 *   last_name: "User",          // Required, minlength: 2 
 *   password: "Password1",      // Required, minlength: 8
 *   team: "abc123"              // Required
 * })
 *
 * // Persist changes
 * workingUser.position = "CEO";
 * workingUser.save();
 *
 * @see {@linkcode User.create}
 * @see {@linkcode User.invite}
 */
export class User {

    /**
     * @readonly
     * @prop id
     * @type {String}
     * @summary
     * The ID of the user, assigned by the API
     *
     */
    id = ""

    /**
     * @prop first_name
     * @type {String}
     * @summary
     * The first name of the user
     */
    first_name = ""

    /**
     * @prop last_name
     * @type {String}
     * @summary
     * The last name of the user
     */
    last_name = ""

    /**
     * @prop position
     * @type {String}
     * @summary
     * Position in the team
     */
    position = ""

    /**
     * @prop email
     * @type {String}
     * @summary
     * Email address.
     */
    email = ""

    /**
    * @prop password
    * @type {String}
    * @summary
    * User password in plain text.
    */
    password = ""

    /**
     * @prop avatar
     * @type {String}
     * @summary
     * URL to the user's avatar
     */
    avatar = ""

    /**
     * @prop state
     * @type {String}
     * @summary
     * The state of the user, the options are `online` or
     * `offline`
     */
    state = ""

    /**
     * @prop status
     * @type {String}
     * @summary
     * The call availability of this user
     */
    status = ""


    /**
     * @prop role
     * @type {String}
     * @summary
     * The user's role on the team, possibilities are `admin` or `member`
     */
    role = ""


    /**
     * @prop plan
     * @type {String}
     * @summary
     * The user's subscription type, either the Pro or Unlimited packages currently
     */
    plan = ""


    /**
     * @prop language
     * @type {String}
     * @summary
     * The user's preferred language. 
     *
     * @description
     * Used for comparison when calling {@link ChatMessage#translate `ChatMessage.translate`}. Also used 
     * by official Skrumble clients to determine interface language.
     *
     * @see [List of ISO-639-1 codes - Wikipedia]{@link https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes}
     */
    language = "en"


    /**
     * @prop timezone
     * @type {String}
     * @summary
     * The TZ string value of the user's timezone
     */
    timezone = ""

    
    /**
     * @prop timeformat
     * @type {String}
     * @summary
     * The user's preferred formatting of time values: `12-hour` or `24-hour`
     */
    timeformat = ""


    /**
     * @prop dateformat
     * @type {String}
     * @summary
     * The formatting of dates
     */
    dateformat = ""


    /**
     * @prop tooltips
     * @type {Boolean} 
     * @summary
     * `true` if the user has requested UI tooltips for help on app.skrumble.com, `false` if disabled.
     */
    tooltips = false

    
    /**
     * @prop created_at
     * @type {String}
     * @readonly
     * @summary
     * The datetime a user was created in ISO 8601
     */
    created_at = ""


    /**
     * @prop extension
     * @type {String[]}
     * @summary.
     * The list of extensions this user can be called at, based on their {@link CallRoute CallRoutes}.
     */
    extension = []


    /*
     * @prop extensionSecret
     * @type {String} 
     * @summray
     * The user's password for SIP phone registration. 
     */
    extension_secret = "";


    /**
     * @readonly
     * @prop teams
     * @type {Team[]}
     * @summary
     * A list of teams this user is on
     */
    teams = []


    /**
     * @prop voicemail
     * @type {boolean}
     * @summary
     * Is voicemail enabled for this user or not. If `true`, then calls that go unanswered after 30s will be 
     * redirected to the user's voicemail box. `false` will disable voicemail entirely and missed calls will simply end.
     */
    voicemail = true


    /**
     * @prop forward
     * @type {Boolean} 
     * @summary
     * The user's call forwarding setting. `true` will forward all inbound calls to {@linkcode User#forward_number User.forward_number} and `false` will recieve calls normally
     */
    forward = false


    /**
     * @prop forward_number
     * @type {Dialstring}
     * @summary
     * If {@link User#forward `User.forward`} is enabled, this will set where inbound calls are directed to
     */
    forward_number = ""


    /**
     * @prop caller_id_name
     * @type {String} 
     * @summary
     * When making outbound calls, this will be the name field of the Caller ID, visible to the other caller. If this is blank
     * (default), the name will default to {@linkcode Team#caller_id_name Team.caller_id_name}.
     */
    caller_id_name = ""

    
    /**
     * @prop caller_id_number
     * @type {String}
     * @summary
     * When making outbound calls, this will be the number field of the Caller ID, visible to the other caller. If this is blank (default), the name will default to {@linkcode Team#caller_id_number Team.caller_id_number}.
     */
    caller_id_number = ""


    /**
     * @prop work_number
     * @type {Dialstring}
     * @summary
     * The work number the user has entered in their profile.
     */
    work_number = ""


    /**
     * @prop home_number
     * @type {Dialstring}
     * @summary
     * The home number the user has entered in their profile.
     */
    home_number = ""


    /**
     * @prop mobile_number
     * @type {Dialstring}
     * @summary
     * The mobile number the user has entered in their profile.
     */
    mobile_number = ""


    /**
     * @prop website
     * @type {String}
     * @summary
     * The website the user has entered in their profile. This should be a valid URL.
     */
    website = ""


    /**
     * @prop latitude
     * @type {String}
     * @summary
     * The user's last recorded latitude.
     */
    latitude = ""

    
    /**
     * @prop longitude
     * @type {String}
     * @summary
     * The user's last recorded longitude
     */
    longitude = ""


    /**
     * @prop theme
     * @type {String}
     * @summary
     * The user's preferrerd desktop theme, the options are `dark` and `light`. New users wll default to `dark`. 
     */
    theme = "dark"


    /**
     * @prop accepted
     * @type {String}
     * @summary
     * The ISO8601 datestamp of when the user accepted the invitation to join the team. If the user was created and not invited, then this will be equal to the user's {@linkcode User#created_at created_at}.
     */
    accepted = ""


    /**
     * @prop last_login
     * @type {String}
     * @summary
     * The ISO8601 datestamp of when this user last logged-in
     */
    last_login = ""


    /**
     * @prop deleted_at
     * @type {String}
     * @summary
     * The ISO8601 datestamp of when this user was deactivated. Deactivated users cannot send or recieve chat messages or calls, and won't appear in chat participant lists or lists of users
     */
    deleted_at = ""


    constructor(options) {

        // Assign in passed values
        for (let [key, value] of Object.entries(options)) {
            if (this.hasOwnProperty(key)) { 
                this[key] = value;
            } else {
                // Logger.info("Key not found in User", key, value);
            }
        }

    }


    /**
     * @summary
     * Saves the details of a given user by sending a PATCH request.
     *
     * @description
     * For admins, this can be the information of any team member. For regular
     * users, it can only be their own information, or the API will return an error.
     * The original user object will be modified in-place with whatever values are applied successfully, and a copy will also passed into the promise.
     *
     * @returns {Promise} Promise that will resolve with the signature `resolver(updated_user)`, 
     * where `updated_user` is the updated {@link User} object. or be rejected with 
     * the signature `rejected(error_obj)`.
     *
     * @example
     * let me = await APISocket.login({ ...opts })
     * me.mobile_number = "555...";
     * me.avatar = "http://gravatar.com/...";
     * me.language = "es";
     *
     * me.save()
     *   .then((me_updated) => console.log(me_updated))
     *   .catch((err) => console.error(err));
     *
     */
    async save() {

        let save_res; 

        if (!this.id)           return Logger.error("User.save must be run on a User object with an ID");

        // Only send the params this request that can be edited 
        let request_options = _.pick(this, editable_fields);

        try {
            usr_save_res = await APISocket.patch(`user/${this.id}`, request_options);
        } catch (err) {

        }

        this.teams.map(async (team) => {
            try {
                save_res = await APISocket.patch(`team/${team.id}/users/${this.id}`, request_options);
            } catch (err) {

            }
        })

        // Assign in passed values
        if (save_res) {
            for (let [key, value] of Object.entries(save_res)) {
                if (this.hasOwnProperty(key)) { 
                    this[key] = value;
                } else {
                    // Logger.info("Key not found in User", key, value);
                }
            }
        }

        return this;

    }


    /**
     * @summary
     * Deactivates a user by sending a DELETE request. Deactivated users
     * cannot be reached or log-in, and don't count as an active subscription.
     * Deactivated users can be reactivated at any time
     *
     * @ignore
     */
    async deactivate() {
        // TODO
        // DELETE /user/:id
        // DELETE /team/:id/users/:uid
    }


    /**
     * @summary
     * Registers a device ID with a user's account, so that they can be 
     * sent push notifications
     *
     * @ignore
     */
    async registerDevice() {
        // TODO
        // POST /user/:id/devices
    }


    /**
     * @summary
     * Updates an existing device registration for push notifications
     *
     * @ignore
     */
    async updateDeviceRegistration() {
        // TODO
        // PATCH /user/:id/devices/:registration_id
    }


    /**
     * @summary
     * Sends a push notification to a user's device
     *
     * @ignore
     */
    async sendDeviceNotification() {
        // TODO
        // POST /user/:id/devices/notification
    }


    /**
     * @summary
     * Unregisters a device ID from a user's account, so push notifications
     * will no longer be sent to the device
     *
     * @ignore
     */
    async unregisterDevice() {
        // TODO
        // DELETE /user/:id/devices/:registration_id 
    }


    /**
     * @static
     * @summary
     * Loads a list of all users visible for the logged-in user.
     *
     * @param {Object} opts         The options for the request
     * @param {Number} opts.limit   The maximum number of users to return
     * @param {Number} opts.skip    The number to start "limit" at
     */
    static async getAll(opts) {

        let options = Object.assign({}, {
            limit: 1000,
            skip: 0,
        }, opts);

        let users = [];
        let users_raw;
        
        try {
            users_raw = await APISocket.get(`user?populate=teams,extension,role,plan&limit=${options.limit}&skip=${options.skip}`);
        } catch(err) {
            throw new Error('Cannot load user list', err);
        }

        users_raw.map((user_info) => {
            users.push(new User(user_info));
        });

        return users;

    }


    /**
     * @static
     * @summary
     * Loads a specific user.
     * 
     * @param {Object} opts     The options for the request
     * @param {String} opts.id  The ID of the user to find
     *
     * @returns {User} The found user if one exists
     */
    static async get(opts) {
            
        let user_info;
        let options = Object.assign({}, {
            id: false,
        }, opts);

        if (!options.id) Logger.error("User.get requires an id");

        try { 
            user_info = await APISocket.get(`user/${options.id}?populate=teams,extension,role,plan`)
        } catch (err) {
            throw new Error('Cannot find user', err);
        }

        return new User(user_info);

    }

    /**
     * @summary
     * Admin-only: creates a user on a Team without inviting them, bypassing
     * email confirmation and setting the password manually
     *
     * @param {Object} opts             Options for the user to be created
     * @param {String} opts.first_name  First name of the user
     * @param {String} opts.last_name   Last name of the user
     * @param {String} opts.email       Email of the user. Used in authentication and cannot be modified after creation
     * @param {String} opts.password    Password of the user
     * @param {Team|String} opts.team   Either a Team object, or the ID of a team 
     * 
     * @returns {Promise}               Promise that will be resolved with the new User object as the first argument, or rejected with the error as the first argument
     *
     * @example
     * User.create({
     *   first_name: "Jane",
     *   last_name: "Doe",
     *   email: "user@example.com",
     *   password: "hunter2",
     *   team: MyTeamObj
     * })
     *   .then((newUser) => console.log("Created user", newUser.first_name, newUser.last_name))
     *   .catch((err) => console.error("Problem creating user", err))
     */
    static async create(opts) {

        let options = Object.assign({}, {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            team: ''
        }, opts);

        if (!options.email)         return Logger.error('User.create requires an email');
        if (!options.first_name)    return Logger.error('User.create requires a first name');
        if (!options.last_name)     return Logger.error('User.create requires a last name');
        if (!options.password)      return Logger.error('User.create requires a password');
        if (!options.team)          return Logger.error('User.create requires a Team object or a team ID');

        // If user passed a Team object, pull the ID from that
        if (options.team.constructor.name == "Team") options.team = options.team.id 

        const user = await APISocket.post(`team/${options.team}/add`, {
            first_name: options.first_name,
            last_name: options.last_name,
            email: options.email,
            password: options.password
        });

        return new User(user);

    }


    /**
     * @summary
     * Admin-only: creates a user by sending them an email invite. 
     *
     * @description
     * The email sent to the user and the resolver for this function will both contain an invite token, 
     * which can be used by {@link User.acceptInvite `acceptInvite`} to complete the invitation process and 
     * finish setting-up the user.
     *
     * @param {Object} opts             Options for the request
     * @param {String} opts.email       Email of the user to be invited
     * @param {Team|String} opts.team   The team to look for this guest in. Either a Team object or a Team ID
     *
     * @returns {Promise}               Promise that will resolve with an object representing a successful invite, or rejected with the error as the first argument. Successful invites will have the properties `email`, `user_id`, and `token` which is the email token needed for {@link User.acceptInvite `acceptInvite`}.
     *
     * @example
     * User.invite({ 
     *   email: "newuser@example.com",
     *   team: myTeam
     * })
     *   .then((invite_result) => {
     *     console.log(invite_result.email, invite_result.token, invite_result.user_id);
     *   })
     *   .catch((err) => console.error(err))
     *
     */
    static async invite(opts) {

        let options = Object.assign({}, {
            email: '',
            team: ''
        }, opts);

        if (!options.email)  throw Error('User.invite requires an email (opts.email)');
        if (!options.team)   throw Error('User.invite requires a Team object or a team ID (opts.team)');

        if (typeof options.email != "string")   throw TypeError("User.invite email must be a string, received", typeof options.email)
        if (typeof options.team != "string" && options.team.constructor.name != "Team") {
            throw TypeError("Guest.exists team must be either a team ID or a Team object, received", typeof options.team);
        }

        // If user passed a Team object, pull the ID from that
        if (options.team.constructor.name == "Team") options.team = options.team.id; 

        let user_exists;
        let user_res;

        // Check to see if the owner already exists
        try {
            user_exists = await User.exists(options.email); 
        } catch (err) {
            throw Error(err);
        }
    
        if (user_exists) { 
            throw Error(`User.invite can't use an existing email, ${options.email} is already in use`);
        }

        try {
            user_res = await APISocket.post(`team/${options.team}/invite`, Array({ email: options.email }) );
        } catch (err) {
            throw Error(err);
        }

        return user_res[0];

    }

    /**
     * @summary
     * Accepts an invite using the invite token either from the invitation email, or from {@link User.invite `invite`}.
     *
     * @description
     * Accepting also requires a user to assigning missing metadata like the user's name and password. 
     * To send an invite, see {@link User.invite `invite`}.
     *
     * @param {Object} opts                 Options for the request
     * @param {String} opts.invite_token    The invite token created by {@link User#invite `invite`}
     * @param {String} opts.first_name      The first name of the user
     * @param {String} opts.last_name       The last name of the user
     * @param {String} opts.password        Password of the user
     * @param {Team|String} opts.team       The team that this invite is for. Either a Team object or a Team ID
     *
     * @returns {Promise}                   Promise that will resolve with the registered user, or rejected with the error as the first argument
     *
     * @example
     * // Create the invite
     * User.invite({ 
     *   email: "newuser@example.com",
     *   team: myTeam
     * })
     *   .then((invite_result) => {
     *     
     *     // Now accept the invite
     *     User.acceptInvite({
     *        invite_token: invite_result.token,
     *        first_name: "Jane",
     *        last_name: "Doe",
     *        password: "hunter2",
     *        team: myTeam
     *     })
     *       .then((invitedUser) => console.log("User accepted", invitedUser);
     *       .catch((err) => console.error(err))
     *
     *   })
     *   .catch((err) => console.error(err))
     */
    static async acceptInvite(opts) {

        let options = Object.assign({}, {
            invite_token: '',
            first_name: '',
            last_name: '',
            password: '',
            team: ''
        }, opts);

        // Check for required fields 
        if (!options.invite_token)  throw Error('Team.create requires an invite token (opts.invite_token)');
        if (!options.first_name)    throw Error('Team.create requires a first name (opts.first_name)');
        if (!options.last_name)     throw Error('Team.create requires a last name (opts.last_name)');
        if (!options.password)      throw Error('Team.create requires a password (opts.password)');
        if (!options.team)          throw Error('Team.create requires a Team object or a team ID (opts.team)');

        if (typeof options.invite_token !== "string") throw TypeError(`User.acceptInvite invite_token must be a string, received ${typeof options.invite_token}`);
        if (typeof options.first_name !== "string") throw TypeError(`User.acceptInvite first_name must be a string, received ${typeof options.first_name}`);
        if (typeof options.last_name !== "string") throw TypeError(`User.acceptInvite last_name must be a string, received ${typeof options.last_name}`);
        if (typeof options.password !== "string") throw TypeError(`User.acceptInvite password must be a string, received ${typeof options.password}`);
        if (typeof options.team != "string" && options.team.constructor.name != "Team") {
            throw TypeError("User.acceptInvite team must be either a team ID or a Team object, received", typeof options.team);
        }

        // If user passed a Team object, pull the ID from that
        if (options.team.constructor.name == "Team") options.team = options.team.id 
       
        let user_res;

        try {
            user_res = await APISocket.post(`team/${options.team}/accept`, { 
                token: options.invite_token,
                first_name: options.first_name,
                last_name: options.last_name,
                password: options.password,
            });
        } catch (err) {
            throw Error(err);
        }

        return new User(user_res);

    }

    /**
     * @summary
     * Check if a user exists, in order to create one safely.  
     * 
     * @param {String} email        Email address to check the existence of  
     * @returns {Promise}           Promise that will resolve with a boolean representing if a user exists or not, or rejected with the error as the first argument 
     *
     * @example
     * User.exists("existinguser@example.com")
     *   .then((userExists) => console.log(userExists ? 'user exists!' : 'no user with that email'))
     *   .catch((err) => console.error(err))
     */
    static async exists(email = "") {

        let exists_res;
        let response_code;

        if (!email) Logger.error("User.exists requires an email address");
        if (typeof email !== "string") throw TypeError(`User.exists email must be a string, received ${typeof email}`);

        try {
            exists_res = await axios.post(`${APISocket.api_url}/v3/user/exist`, { email });
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
