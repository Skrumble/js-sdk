import "babel-polyfill";
import { Client } from "../src/Classes/Client";

const assert = require("chai").assert;

describe("Client", () => {
  it("can be created");

  describe("properties", () => {
    it("string for client name", () => {
      const client = new Client({ name: "Test" });
      assert.equal(client.name, "Test");
      assert.typeOf(client.name, "string");
    });
  });

  describe("methods", () => {
    it("create", () => {});
  });
});
