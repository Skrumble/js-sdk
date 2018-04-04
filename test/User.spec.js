import "babel-polyfill";
import { User } from "../src/Classes/User";


var assert = require("chai").assert;


describe("User", () => {

    it("can be created");
    describe("properties", () => {

        it("string for id");

        it("string for first name", () => {
            var user = new User({ first_name: "Test"});
            assert.equal(user.first_name, "Test");
            assert.typeOf(user.first_name, "string");
        });

        it("string for last name", () => {
            var user = new User({ last_name: "Test"});
            assert.equal(user.last_name, "Test");
            assert.typeOf(user.last_name, "string");
        });

        it("string for position", () => {
            var user = new User({ position: "Test"});
            assert.equal(user.position, "Test");
            assert.typeOf(user.position, "string");
        });

        it("string for email", () => {
            var user = new User({ email: "Test@example.com"});
            assert.equal(user.email, "Test@example.com");
            assert.typeOf(user.email, "string");
        });

        it("string for avatar", () => {
            var user = new User({ avatar: "Test"});
            assert.equal(user.avatar, "Test");
            assert.typeOf(user.avatar, "string");
        });

        it("string for state", () => {
            var user = new User({ state: "online" });
            assert.equal(user.state, "online");
            assert.typeOf(user.state, "string");
        });

        it("string for status", () => {
            var user = new User({ state: "online" });
            assert.equal(user.state, "online");
            assert.typeOf(user.state, "string");
        });

        it("string for role", () => {
            var user = new User({ role: "admin" });
            assert.equal(user.role, "admin");
            assert.typeOf(user.role, "string");
        });

        it("string for plan", () => {
            var user = new User({ plan: "unlimited" });
            assert.equal(user.plan, "unlimited");
            assert.typeOf(user.plan, "string");
        });

        it("string for language", () => {
            var user = new User({ language: "en" });
            assert.equal(user.language, "en");
            assert.typeOf(user.language, "string");
        });

        it("string for timezone", () => {
            var user = new User({ timezone: "UTC-05:00" });
            assert.equal(user.timezone, "UTC-05:00");
            assert.typeOf(user.language, "string");
        });

        it("string for timeformat", () => {
            var user = new User({ timeformat: "24-hour" });
            assert.equal(user.timeformat, "24-hour");
            assert.typeOf(user.timeformat, "string");
        });

        it("string for dateformat", () => {
            var user = new User({ dateformat: "YYYY-MM-DD" });
            assert.equal(user.dateformat, "YYYY-MM-DD");
            assert.typeOf(user.dateformat, "string");
        });

        it("string for tooltips", () => {
            var user = new User({ tooltips: false });
            assert.isFalse(user.tooltips, "tooltips property should be false");
            assert.typeOf(user.tooltips, "boolean", "tooltips should be of boolean type");
        });  

        it("string for created_at", () => {
            var user = new User({ dateformat: "YYYY-MM-DD" });
            assert.equal(user.dateformat, "YYYY-MM-DD");
            assert.typeOf(user.dateformat, "string");
        });

        it("array for extensions", () => {
            var user = new User({});
            assert.property(user, "extension");
            assert.typeOf(user.extension, "array");
        });

        it("string for extensionSecret", () => {
            var user = new User({ extension_secret: "q1twbt" });
            assert.equal(user.extension_secret, "q1twbt");
            assert.typeOf(user.extension_secret, "string");
        });

        it("array for teams", () => {
            var user = new User({});
            assert.property(user, "teams");
            assert.typeOf(user.teams, "array");
        });

    })


    describe("save()", () => {
        
        describe("is async", () => {
            it("returns a promise");
            it("resolves the promise if the new details can be saved");
            it("resolves with the saved user object as the first argument");
            it("rejects the promise if the new details cannot be saved");
        });

        it("isn't static, requires an instance");
        it("requires authentication to update a user's own details");
        it("requires admin authentication to update another user's details");

    })


    describe("deactivate()", () => {
        
        describe("is async", () => {
            it("returns a promise");
            it("resolves if the user could be deactivated");
            it("rejects if the user cannot be deactivated");
        });

        it("isn't static, requires an instance");

    });


    describe("registerDevice()", () => {

    });


    describe("updateDeviceRegistration()", () => {

    });


    describe("sendDeviceNotification()", () => {

    });


    describe("unregisterDevice()", () => {

    });

    
    describe("getAll()", () => {

        describe("is async, returns a promise", () => {
            it("resolves the promise if the list of users can be loaded");
            it("resolves with the array of users as the first argument");
            it("rejects the promise if the list of users cannot be loaded");
        });
        it("is static, works without an instance");
        it("requires authentication");

    });


    describe("get(opts)", () => {

        describe("is async, returns a promise", () => {
            it("resolves if the user can be loaded");
            it("resolves with the user as the first argument");
            it("rejects if the user cannot be loaded");
        });
        it("is static, works without an instance");
        it("requires authentication");

    });


    describe("create(opts)", () => {

        describe("is async, returns a promise", () => {
            it("resolves if the user was created");
            it("resolves with the created user as the first argument");
            it("rejects if the user cannot be created");
        });

        it("is static, works without an instance");
        it("requires admin authentication");

    });


    describe("invite(opts)", () => {

    });

});
