import { APISocket } from "./APISocket";
import { Logger } from "./Logger";
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
 * @class User
 * @classdesc 
 * The User class allows read access to user information. It's also possible to update User information with {@link User#save `save()`} if the User you're editing is yourself, or 
 * if you're logged-in as an Admin. Static methods like {@link User#get `get()`} or {@link User#create `create()`} won't work on User instances, but will retrieve or create 
 * User objects respectively. Instances of User will emit socket events when information about them is modified, see {@link User#on `on()`} for more details
 * 
 * @summary
 * A Skrumble Team Member.
 *
 *
 * @example <caption>new User won't create users</caption>
 * var testUser = new User({ 
 *    first_name "test", 
 *    last_name: "user" 
 * });
 *
 * testUser.save(); // Returns error! Users must be created using 
 *                  // static method User.create
 *
 *
 * @example <caption>Proper way to create a user</caption>
 * var workingUser = User.create({
 *      email: "user@example.com",  // Required
 *      plan: "pro",                // Required
 *      first_name: "Test",
 *      last_name: "User"
 * })
 *
 * // Listen for events
 * workingUser.on("change", function() {
 *      console.log(workingUser, "has been updated!");
 * });
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
     * The user's preferred interface language. 
     *
     * @description
     * Currently this only modifies the interface language of app.skrumble.com, API responses won't be translated. Supported options are `en` and `es`
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
     * The original user object will be modified with whatever values are applied successfully. The new user object will also passed into the promise.
     *
     * @returns {Promise} Promise that will resolve with the signature `resolver(updated_user)`, 
     * where `updated_user` is the updated {@link User} object. or be rejected with 
     * the signature `rejected(error_obj)`.
     *
     * @example
     * let me = await APISocket.login({ ...opts })
     * Object.assign(me, {
     *   mobile_number: "555...",
     *   avatar: "http://gravatar.com/...",
     *   language:"es",
     * });
     *
     * me.save()
     *   .then((user) => console.log(user))
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

        console.log(save_res);

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
     * Admin-only: creates a user without inviting them, bypassing
     * email confirmation and setting the password manually
     *
     * @param opts {Object}     Options for the user to be created
     *
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
     * Admin-only: creates a user by sending them an email invite
     *
     * @ignore
     */
    static invite(opts) {
        // TODO
        // POST /team/:id/invite
    }


    /**
     * @summary
     * Check if a user exists, in order to create one safely
     * 
     * @param {Object} opts     Options for the request
     * @param {Object} opts.email 
     * @returns {Boolean}   `true` if the user exists, or `false` if not
     */
    static exists(opts) {

        let options = Object.assign({}, {
            email: false
        }, opts);

        if (!options.email) Logger.error("User.exists requires an email address");

        try {

        } catch(err) {

        }

    }

}
