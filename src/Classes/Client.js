"use strict";

import { APISocket } from "./APISocket";
import { Logger } from "./Logger";
import axios from "axios";

/**
 * @class
 * @hideconstructor
 * @classdesc
 * The settings and info for clients
 */

export class Client {
  constructor(opts) {
    /**
     * @prop name
     * @type {String}
     * @summary
     * The name of the client
     */
    this.name = "";
  }

  /**
   * @summary
   * Creates a client
   *
   * @description
   * Creates a client by supplying a client name.
   *
   * @param {Object} opts               Options for the request
   * @param {String} opts.client_name   Client's name
   *
   * @returns {Promise} Promise that will resolve with newly created client if the client creation was successful, and be rejected with an error as the first argument if the attempt fails
   *
   * @example
   * Client.create({ client_name: "abc123" })
   *   .then((client) => {
   *     // Handle new client here
   *   })
   */
  static async create(opts) {
    var options = Object.assign(
      {},
      {
        client_name: ""
      },
      opts
    );

    let client;

    // Check for required fields
    if (!options.client_name) {
      throw Error("Client.create requires a client name (opts.client_name)");
    }

    // Type-check fields
    if (typeof options.client_name !== "string") {
      throw TypeError(
        `Client.create client_name must be a string, received ${typeof options.client_name}`
      );
    }

    // Create a client
    try {
      client = await axios.post(`${APISocket.auth_hostname}/v1/client`, {
        name: options.client_name
      });
    } catch (err) {
      throw Error(err);
    }
  }
}
