import "babel-polyfill";
import { Chat } from "../src/Classes/Chat";

var assert = require("chai").assert

describe("Chat", () => {

    it("exists", () => {

    });


    describe("properties", () => {
        it("avatar");
        it("files");
        it("id");
        it("links");
        it("locked");
        it("messages");
        it("name");
        it("pin");
        it("purpose");
        it("roomNumber");
        it("type");
        it("unread");
        it("url");
        it("users");
        it("created_at");
        it("updated_at");
        it("last_seen");
        it("last_message_time");
        it("do_not_disturb");
        it("favourite");
    });

    describe("methods", () => {
        it("create()")
        it("get(opts)")
        it("getAll()")
        it("on(evt, callback)");
        it("sendFile(fileObj)");
        it("sendMessage()");
    });

});
