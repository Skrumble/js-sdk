import axios from 'axios';
import io from "socket.io-client"

import { User } from "./User";
import { Team } from "./Team";
import { Logger } from "./Logger";
import { Guest } from "./Guest";
import { removeTrailingSlash } from "../Skrumble";


/**
 * @class 
 * @classdesc
 * Allows connection to the Skrumble API through a persistent socket connection. Many other classes like {@link User}, {@link Chat}, and {@link Department} rely on APISocket to make requests.  
 *
 * @example
 * something
 */
export class APISocket {

    constructor(opts) {

        /**
         * @prop socket
         * @type {Object}
         * @summary
         * The socket used to make requests.
         */
        this.socket = false;


        /**
         * @readonly
         * @prop client_id
         * @type {String}
         * @summary
         * The Client ID of the application. This is read-only, set using {@link config}
         */
        this.client_id = "";


        /**
         * @readonly
         * @prop client_secret
         * @type {String} 
         * @summary
         * The Client Secret of the application. This is read-only, set using {@link config}
         */
        this.client_secret = "";


        /**
         * @readonly
         * @prop hostname
         * @type {String}
         * @summary
         * The hostname for future API reqeust, set using {@link config}
         */
        this.hostname = "";

        /**
         * @readonly
         * @prop api_url
         * @type {String}
         * 
         */
        this.api_url = "https://app.skrumble.com";


        /**
         * @readonly
         * @prop auth_token
         * @type {String}
         * @summary
         * The logged-in user's bearer token, this will automatically be appended to all future requests.
         */
        this.auth_token = "";


        /**
         * @readonly
         * @prop refresh_token
         * @type {String}
         * @summary
         * The logged-in user's refresh token, this will automatically be used to refresh the {@link APISocket#auth_token}
         * when the token has expired or requests begin failing with an HTTP code of 403
         */
        this.refresh_token = "";

        
        /**
         * @readonly
         * @prop current_user
         * @type {User}
         * @summary
         * After logging in and auth/refresh tokens are set properly, this will be the currently logged-in user
         * for this socket connection.
         */
        this.current_user = false;


    }


    /**
     * @summary
     * Authenticate a user and start listening for events over a persistent socket connection.
     *
     * @description
     * Logs-in a user with the provided email and password. When the returned promise
     * is resolved, it will return the authenticated user. Also connects user to the socket by default.
     *
     * @memberof APISocket
     * @param {Object} opts     The options for this request
     * @param {String} opts.email    Email address of the account to log-in
     * @param {String} opts.password Password of the account to log-in
     * @param {Boolean} [opts.connect_socket=true]   After a successful login, should the user's socket
     * connection be initiated automatically. If this is disabled the socket connection must be created 
     * manually using {@link connectSocket} 
     *
     * @static
     *
     * @example
     * Skrumble.APISocket.login({
     *    email: "myuser@gmail.com",
     *    password: "123456"
     * })
     * .then((user) => {
     *    console.log(user, "is now logged in!");
     * })
     * .catch((err) => {
     *    console.error("Couldn't log-in!", err);
     * })
     *
     */
    static async login(opts) {

        let fields_missing = [];
        var options = Object.assign({}, {
            email: false,
            password: false,
            connect_socket: true
        }, opts); 

        if (!options.email)     fields_missing.push("email");
        if (!options.password)  fields_missing.push("password");

        if (fields_missing.length > 0) {
            throw new Error("Login error, fields missing:", fields_missing.join(', '))
        }
        
        let auth_url = `https://${this.auth_hostname}/v1/login-user` 

        // Get the user's token and refresh token
        let auth_result = await axios({
            method: "post",
            url: auth_url,
            data: {
                grant_type: "password",
                username: options.email,
                password: options.password,
                client_id: this.client_id,
                client_secret: this.client_secret
            }
        });
    
        if (Math.floor(auth_result.status/100) !== 2) { 
            throw new Error(err);
        } else {

            if (auth_result.data.access_token) this.access_token = auth_result.data.access_token;
            if (auth_result.data.refresh_token) this.refresh_token = auth_result.data.refresh_token;

            if (options.connect_socket && this.access_token && this.refresh_token) {
                var SocketRegistered = await this.connectSocket();
                let cur_user = new User(await this.loadCurUser());
                let user_teams = [];

                // Load all teams by ID
                for (var i = 0; i < cur_user.teams.length; i++) {
                    let team = await Team.get({ id: cur_user.teams[i].id })
                    user_teams.push(team);
                }

                cur_user.teams = user_teams;
                this.current_user = cur_user;

            } else {
                throw new Error("Socket registration failed", auth_result);
            }
        }

        return this.current_user;

    }



    /** 
     * @summary
     * Authenticates a guest and start listening for events over a persistent socket connection.
     *
     * @description
     * Logs-in a guest user, which are given access only to one group conversation. When the returned
     * promise is resolved, it will return the authenticated guest user. Also connects to the socket 
     * by default. 
     *
     * @memberof APISocket
     * @param {Object} opts             The options for this request
     * @param {String} opts.first_name  The first name of the guest
     * @param {String} opts.last_name   The last name of the guest
     * @param {String} opts.email       The email address of the guest
     * @param {String} opts.pin         The {@link Chat#pin PIN} of the chat the guest is joining.
     * @param {String} opts.chat        The {@link Chat#id ID} of the chat the guest is joining.
     * @param {String} opts.team        The {@link Team#slug slug} of the team that owns the chat
     *                                  the guest is joining.
     *
     */
    static async loginGuest(opts) {

        console.log("Logging guest in with options", opts);

        let fields_missing = [];
        let options = Object.assign({}, {
            first_name: false,
            last_name: false,
            email: false,
            pin: false,
            chat: false,
            team: false,
        }, opts);

        if (!options.email)         fields_missing.push('email');
        if (!options.first_name)    fields_missing.push('first_name');
        if (!options.last_name)     fields_missing.push('last_name'); 
        if (!options.pin)           fields_missing.push('pin');
        if (!options.chat)          fields_missing.push('chat');
        if (!options.team)          fields_missing.push('team');

        if (fields_missing.length > 0) {
            throw new Error("Guest login error, fields missing:", fields_missing.join(', '))
        }

        let auth_url = `${this.api_url}guest/join`;

        let auth_result  = await axios({
            method: 'POST',
            url: auth_url,
            data: options
        })


        if (Math.floor(auth_result.status/100) !== 2) { 
            throw new Error(err);
        } else {

            if (auth_result.data.access_token) this.access_token = auth_result.data.access_token;
            if (auth_result.data.refresh_token) this.refresh_token = auth_result.data.refresh_token;

            if (this.access_token && this.refresh_token) {
                var SocketRegistered = await this.connectSocket();
                let cur_user = new Guest(await this.loadCurUser());
                let user_teams = [];

                // Load all teams by ID
                for (var i = 0; i < cur_user.teams.length; i++) {
                    let team = await Team.get({ id: cur_user.teams[i].id })
                    user_teams.push(team);
                }

                cur_user.teams = user_teams;
                this.current_user = cur_user;

            } else {
                throw new Error("Socket registration failed", auth_result);
            }

        }

        return this.current_user;

    }


    /**
     * Load the current user based on their access token
     *
     * @memberof APISocket 
     * @static
     */
    static async loadCurUser() {

        var user_result = await APISocket.get(`user/me?populate=teams&extension=true`) 

        // User is on one team: normalize values that are stored on the TeamUser object
        if (user_result.teams.length === 1) {

            // Properties defined on the TeamUser that need to be normalized back into actual user properties
            var team_user = await APISocket.get(`team/${user_result.teams[0].id}/users/${user_result.id}`)
            for (let [key, value] of Object.entries(team_user)) { 
                user_result[key] = value;
            }

        }

        // Rename/remap fields
        user_result.extension_secret = (" " + user_result.extensionSecret).slice(1);
        delete user_result.extensionSecret;

        return user_result;
 
    }


    /**
     * @static
     * @async
     * @summary
     * Initiates the socket connection.
     *
     * @description
     * This connects a user to the socket and registers them for future changes. After the call to `login` completes, default behaviour will be to call this automatically.
     *
     */
    static connectSocket() {

        return new Promise((resolve, reject) => {

            const socket = io(
                `${this.api_url}`, 
                {
                    path: '/socket.io/',
                    transports: ['websocket'],
                    query: {
                        '__sails_io_sdk_version': '1.1.13',
                        '__sk_js_sdk_version': '0.1.1'
                    }
                }
            );

            this.socket = socket;

            socket.on('connect', async () => {
                try {
                    let register_res = await APISocket.post(`socket/register`)
                    resolve(true);
                } catch(err) {
                    reject(err);
                }
            });

            socket.on('connect_error',   onConnectError)
            socket.on('connect_timeout', onConnectError)
            socket.on('connect_timeout', onConnectError)

            const onConnectError = () => {
                console.log("connection error");
                reject(false);
            }

        });

    }


    /**
     * @static
     * @summary
     * Logs out the current user by forcefully closing the socket and resetting APISocket.current_user
     *
     */
    static logout() {
        this.socket = false;
        this.current_user = false;
    }

    
    /**
     * @static
     * @async
     * @summary
     * Sends a GET request to the API socket. 
     *
     * @param {String} url      - Url to be passed to socket.io.get()
     * @param {Object} data     - Data to be sent with the request
     *
     * @returns {Promise}       - A promise object that either is resolved
     * with success for sucessful (`2xx`) responses with the body of the response
     * as the first argument. If the request fails (`!= 2xx`), the promise will 
     * be rejected with the body of the response as the first argument, and a 
     * JSON Websocket Response object as the second argument.
     */
    static get(url, data, append_url = true) {
        return APISocket.request('get', url, data, append_url);
    }


    /**
     * @static
     * @async
     * @summary
     * Sends a POST request 
     *
     * @param {String} url      - Url to be passed to socket.io.get()
     * @param {Object} options  - Options object to be passed to socket.io.get()
     * @returns {Promise}       - A promise object that either is resolved
     * with success for sucessful (`2xx`) responses with the body of the response
     * as the first argument. If the request fails (`!= 2xx`), the promise will 
     * be rejected with the body of the response as the first argument.
     */
    static post(url, data, append_url = true) {
        return APISocket.request('post', url, data, append_url);
    }


    /**
     * @static
     * @async
     * @summary
     * Sends a POST request 
     *
     * @param {String} url      - Url to be passed to socket.io.get()
     * @param {Object} options  - Options object to be passed to socket.io.get()
     * @returns {Promise}       - A promise object that either is resolved
     * with success for sucessful (`2xx`) responses with the body of the response
     * as the first argument. If the request fails (`!= 2xx`), the promise will 
     * be rejected with the body of the response as the first argument.
     */
    static patch(url, data, append_url = true) {
        return APISocket.request('patch', url, data, append_url);
    }


    /**
     * @static
     * @async
     * @summary
     * Sends a DELETE request 
     *
     * @param {String} url      - Url to be passed to socket.io.get()
     * @param {Object} options  - Options object to be passed to socket.io.get()
     * @returns {Promise}       - A promise object that either is resolved
     * with success for sucessful (`2xx`) responses with the body of the response
     * as the first argument. If the request fails (`!= 2xx`), the promise will 
     * be rejected with the body of the response as the first argument.
     */
    static delete(url, data, append_url = true) {
        return APISocket.request('delete', url, data, append_url);
    }


    /**
     * @static
     * @async
     * @summary
     * Sends a request with a given HTTP method. Shorthand versions are available
     * as APISocket.get(), post(), patch(), and delete()
     * 
     * @param {String} method   - HTTP Method to be used in the request
     * @param {String} url      - Url to be passed to socket.io.get()
     * @param {Object} options  - Options object to be passed to socket.io.get()
     * @returns {Promise}       - A promise object that either is resolved
     * with success for sucessful (`2xx`) responses with the body of the response
     * as the first argument. If the request fails (`!= 2xx`), the promise will 
     * be rejected with the body of the response as the first argument.
     */
    static request(method, url, data, append_url = true) {

        return new Promise((resolve, reject) => {

            this.socket.emit(method,
                {
                    url: (append_url) ? `${APISocket.api_url}/v3/${url}` : url, 
                    headers: {
                        "Authorization": `Bearer ${this.access_token}`
                    },
                    method,
                    data, 
                },
                async (res) => {
                    if (Math.floor(res.statusCode/100) === 2) { 
                        resolve(res.body, res); 
                    } else {
                        throw new Error(`${res.statusCode} error: ${res.body}`);
                        reject(res.body, res);
                    }
                }
            )
 
        })

    }

    /**
     * @static
     * @summary
     * Listens for socket messages coming into the API socket. 
     *
     * @description
     * The Skrumble API will emit the following types of events: 
     *
     * | Event | Description |
     * | --- | --- |
     * | chat | This is the event about a chat, including new messages, changes to the participant list, or name |
     * | user | Event is about a user that has changed: `state`, `status`, `*_name`, `avatar`, etc | 
     * | teamuser | Event is about a user that has changed: `state`, `status`, `*_name`, `avatar`, etc | 
     * | team | Changes to the team information |
     * | conference | Changes to a group call's status |
     *
     * Because this is a static method, the events above will fire for any activity of that type. For example, `chat` will be triggered on
     * changes to all chats on the current team. To monitor an individual chat, use {@link Chat.on}
     *
     * @param {String} evt          The event type to listen for 
     * @param {Function} callback   Callback to fire when the event occurs
     */
    static on(evt, callback) {
        if (this.socket) {
            this.socket.on(evt, callback);
        } else {
            Logger.warn("Socket not connected");
        }
    }

    
    /**
     * @static
     * @summary
     * Unbinds a listener bound using {@link APISocket.on}
     *
     * @param {String} evt          The event type to unbind
     * @param {function} callback   Callback to unbind from this event
     */
    static off(evt, callback) {
        if (this.socket) {
            this.socket.off(evt, callback);
        } else {
            Logger.warn("Socket not connected");
        }
    }


    /**
     * @static
     * @summary
     * Configures the API socket for use, including the URLs and client tokens
     *
     * @param {Object} opts                 - Configuration options 
     * @param {String} opts.client_id       - Client ID of this application
     * @param {String} opts.client_secret   - Client secret of this application
     * @param {String} opts.api_hostnae     - Hostname for API requests, don't include protocol or port number
     * @param {String} opts.auth_hostname   - Hostname for Auth requests
     */
    static async config(opts) {

        var options = Object.assign({}, {
            client_id: false,
            client_secret: false,
            api_hostname: "app.skrumble.com",
            auth_hostname: "app.skrumble.com"
        }, opts);

        if (options.client_id) { 
            this.client_id = options.client_id;
        } else {
            throw new Error("client_id is required");
        }
        
        if (options.client_secret) { 
            this.client_secret = options.client_secret;
        } else {
            throw new Error("client_id is required");
        }

        if (typeof options.api_hostname == "string" && !options.api_hostname.match(/^\s*$/gm)) {
            this.hostname = removeTrailingSlash(options.api_hostname);
            this.api_url = `https://${this.hostname}`;
        }

        if (typeof options.auth_hostname == "string" && !options.auth_hostname.match(/^\s*$/gm)) {
            this.auth_hostname = removeTrailingSlash(options.auth_hostname); 
        }
        
    }



}
