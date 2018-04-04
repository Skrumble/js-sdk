import "babel-polyfill";
import { APISocket } from "../src/Classes/APISocket";

var assert = require("chai").assert;

describe("APISocket", () => {

    it("can be created", () => {
        assert.typeOf(new APISocket(), "Object")
        assert.equal(new APISocket().constructor.name, "APISocket");
    });

    it("has properties for api credentials", () => {
        var Socket = new APISocket();
        assert.typeOf(Socket.client_id, "string");
        assert.typeOf(Socket.client_secret, "string");
    });

    it("has a path property for the API",() => {
        var Socket = new APISocket();
        assert.property(Socket, "api_url", "api_url property exists on Socket object")
        assert.typeOf(Socket.api_url, "string", "api_url property is of type string");
    });

    it("defaults API path to production", () => {
        var Socket = new APISocket();
        assert.equal(Socket.api_url, "https://app.skrumble.com", "api_url property defaults to the production API url");
    });

    it("has properties for auth and refresh tokens",() => {
        var Socket = new APISocket();
        assert.property(Socket, "auth_token", "auth_token property exists on Socket 'object'");
        assert.property(Socket, "refresh_token", "refresh_token property exists on Socket 'object'");
        assert.typeOf(Socket.auth_token, "string", "auth_token property is of type 'string'");
        assert.typeOf(Socket.refresh_token, "string", "refresh_token property is of type 'string'");
    });

    it("has a property for the socket that defaults to false", () => {
        var Socket = new APISocket();
        assert.property(Socket, "socket", "socket property exists on Socket object")
        assert.typeOf(Socket.socket, "boolean", "socket property is of type boolean");
        assert.isFalse(Socket.socket, "socket property defaults to false");
    });
        
    describe("login(opts)", () => {
        it("is async, returns a promise");
        it("connects the socket and loads the current user");
        it("resolves with the user when successful");
    });

    describe("loadCurUser()", () => {
        describe("is async, returns a promise", () => {
            it("resolves the promise if the result is a 2xx response");
            it("rejects the promise if the result is a !2xx response");
            it("resolves with the body of the response as the first argument");
            it("resolves with the body automatically parsed as JSON");
        })
        it("calls the /me endpoint for the current user's profile information"); 
        it("returns a user object with the information from the endpoint");
    });

    describe("connectSocket()", () => {
        it("is async, retruns a promise");
        it("connects the wss:// socket using the saved tokens");
    });

    describe("get(url, data)", () => {
        it("performs a GET request for a URL");
        describe("is async, returns a promise", () => {
            it("resolves the promise if the result is a 2xx response");
            it("rejects the promise if the result is a !2xx response");
            it("resolves with the body of the response as the first argument");
            it("resolves with the body automatically parsed as JSON");
        })
    });

    describe("post(url, data)", () => {
        it("performs a POST request for a URL");
        describe("is async, returns a promise", () => {
            it("resolves the promise if the result is a 2xx response");
            it("rejects the promise if the result is a !2xx response");
            it("resolves with the body of the response as the first argument");
            it("resolves with the body automatically parsed as JSON");
        })

    });

    describe("patch", () => {
        it("performs a PATCH request for a URL");
        describe("is async, returns a promise", () => {
            it("resolves the promise if the result is a 2xx response");
            it("rejects the promise if the result is a !2xx response");
            it("resolves with the body of the response as the first argument");
            it("resolves with the body automatically parsed as JSON");
        })

    });

    describe("delete", () => {
        it("performs a DELETE request for a URL");
        describe("is async, returns a promise", () => {
            it("resolves the promise if the result is a 2xx response");
            it("rejects the promise if the result is a !2xx response");
            it("resolves with the body of the response as the first argument");
            it("resolves with the body automatically parsed as JSON");
        })

    });

    describe("on", () => {
        it("accepts a string representing an event to listen for");
        it("accepts wildcard strings to listen for all events");
        it("accepts a function to bind as an event listener");
        it("calls the function when the event happens");
        it("calls the function when any event happens, when bound with wildcard");
    })

    describe("off", () => {
        it("accepts a string representing an event to stop listening for");
        it("accepts wildcard strings to unsubscribe all events");
        it("accepts a function to stop binding to an event");
        it("stops calling the function when the event happens"); 
        it("if the function is omitted then stops calling all listeners of the type");
    });

}); 
