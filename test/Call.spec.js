import "babel-polyfill";
import { Call } from "../src/Classes/Call";

var assert = require("chai").assert;

describe("Call", () => {
  it("exists", () => {});

  describe("properties", () => {
    it("chat_id");
    it("direction");
    it("duration");
    it("muted");
    it("participants");
    it("render_options");
    it("sending_video");
    it("session");
    it("started");
    it("state");
    it("to");
  });

  describe("methods", () => {
    it("accept(opts)");
    it("decline()");
    it("hangup()");
    it("loadCallerID()");
    it("on()");
    it("render()");
    it("start()");
    it("startVideo(constraints");
    it("stopVideo()");
    it("toggleMute()");
  });
});
