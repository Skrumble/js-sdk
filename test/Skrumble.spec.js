import "babel-polyfill";
import {
  isDialstring,
  isExtension,
  isPSTN,
  isVoicemail,
  forceTrailingSlash,
  removeSelf
} from "../src/Skrumble";

import { APISocket } from "../src/Classes/APISocket";
import { User } from "../src/Classes/User";

var assert = require("chai").assert;

var test_numbers = {
  local_na: "6472422102",
  local_7: "2422102",
  colombia_ICC: "+15715087326",
  uk_ICC: "",
  separator: "6472422102;123;4",
  extension: {
    digits_1: "1",
    digits_2: "52",
    digits_3: "812",
    digits_4: "9104",
    digits_5: "19602",
    digits_6: "831041"
  }
};

describe("Skrumble", () => {
  it("exists", () => {});

  describe("properties", () => {});

  describe("methods", () => {
    describe("isDialstring(str)", () => {
      it("accepts a string", () => {
        assert.isDefined(isDialstring(""));
      });

      it("returns false for non-strings", () => {
        assert.strictEqual(isDialstring([]), false);
        assert.strictEqual(isDialstring(true), false);
        assert.strictEqual(isDialstring(-Infinity), false);
        assert.strictEqual(isDialstring(NaN), false);
        assert.strictEqual(isDialstring(undefined), false);
        assert.strictEqual(isDialstring(null), false);
      });

      it("returns a boolean", () => {
        for (let [key, num] of Object.entries(test_numbers)) {
          assert.typeOf(isDialstring(num), "boolean");
        }
      });

      it("returns true for local North American PSTN numbers", () => {
        var res = isDialstring(test_numbers.local_na);
        assert.isDefined(res);
        assert.strictEqual(res, true);
      });

      it("returns true for local 7-digit PSTN numbers", () => {
        var res = isDialstring(test_numbers.local_7);
        assert.isDefined(res);
        assert.strictEqual(res, true);
      });

      it("returns true for Colombian PSTN numbers with ICC", () => {
        var res = isDialstring(test_numbers.colombia_ICC);
        assert.isDefined(res);
        assert.strictEqual(res, true);
      });

      it("returns true for UK PSTN numbers with ICC");

      it("returns true for numbers with ; separators");
      it("returns true for extensions");
      it("returns true for voicemails");
      it("returns false for formatted numbers");
      it("returns false for blank numbers");
    });

    describe("isExtension(str)", () => {
      it("accepts a string", () => {
        assert.isDefined(isExtension(""));
      });

      it("returns a boolean", () => {
        for (let [key, num] of Object.entries(test_numbers)) {
          assert.typeOf(isExtension(num), "boolean");
        }
      });

      it("returns false for non-strings", () => {
        assert.strictEqual(isExtension([]), false);
        assert.strictEqual(isExtension(true), false);
        assert.strictEqual(isExtension(-Infinity), false);
        assert.strictEqual(isExtension(NaN), false);
        assert.strictEqual(isExtension(undefined), false);
        assert.strictEqual(isExtension(null), false);
      });

      it("returns false for local North American PSTN numbers", () => {
        var res = isExtension(test_numbers.local_na);
        assert.isDefined(res);
        assert.strictEqual(res, false);
      });

      it("returns false for local 7-digit PSTN numbers", () => {
        var res = isExtension(test_numbers.local_7);
        assert.isDefined(res);
        assert.strictEqual(res, false);
      });

      it("returns false for Colombian PSTN numbers with ICC", () => {
        var res = isExtension(test_numbers.colombia_ICC);
        assert.isDefined(res);
        assert.strictEqual(res, false);
      });

      it("returns false for UK PSTN numbers with ICC", () => {
        var res = isExtension(test_numbers.uk_ICC);
        assert.isDefined(res);
        assert.strictEqual(res, false);
      });

      it("returns false for 1-digit non-extensions", () => {
        var res = isExtension(test_numbers.extension.digits_1);
        assert.isDefined(res);
        assert.strictEqual(res, false);
      });

      it("returns true for 2-digit extensions", () => {
        var res = isExtension(test_numbers.extension.digits_2);
        assert.isDefined(res);
        assert.strictEqual(res, true);
      });

      it("returns true for 3-digit extensions", () => {
        var res = isExtension(test_numbers.extension.digits_3);
        assert.isDefined(res);
        assert.strictEqual(res, true);
      });

      it("returns true for 4-digit extensions", () => {
        var res = isExtension(test_numbers.extension.digits_4);
        assert.isDefined(res);
        assert.strictEqual(res, true);
      });

      it("returns true for 5-digit extensions", () => {
        var res = isExtension(test_numbers.extension.digits_5);
        assert.isDefined(res);
        assert.strictEqual(res, true);
      });

      it("returns false for 6-digit non-extensions", () => {
        var res = isExtension(test_numbers.extension.digits_6);
        assert.isDefined(res);
        assert.strictEqual(res, false);
      });
    });

    describe("isPSTN(str)", () => {
      it("accepts a string", () => {
        assert.isDefined(isPSTN(""));
      });

      it("returns a boolean", () => {
        for (let [key, num] of Object.entries(test_numbers)) {
          assert.typeOf(isPSTN(num), "boolean");
        }
      });

      it("returns false for non-strings", () => {
        assert.strictEqual(isPSTN([]), false);
        assert.strictEqual(isPSTN(true), false);
        assert.strictEqual(isPSTN(-Infinity), false);
        assert.strictEqual(isPSTN(NaN), false);
        assert.strictEqual(isPSTN(undefined), false);
        assert.strictEqual(isPSTN(null), false);
      });

      it("returns true for local North American PSTN numbers", () => {
        var res = isPSTN(test_numbers.local_na);
        assert.isDefined(res);
        assert.strictEqual(res, true);
      });

      it("returns true for local 7-digit PSTN numbers", () => {
        var res = isPSTN(test_numbers.local_7);
        assert.isDefined(res);
        assert.strictEqual(res, true);
      });

      it("returns true for Colombian PSTN numbers with ICC", () => {
        var res = isPSTN(test_numbers.colombia_ICC);
        assert.isDefined(res);
        assert.strictEqual(res, true);
      });

      it("returns true for UK PSTN numbers with ICC");

      it("returns true for numbers with ; separators", () => {
        var res = isPSTN(test_numbers.separator);
        assert.isDefined(res);
        assert.strictEqual(res, true);
      });

      it("returns false for extensions", () => {});
    });

    describe("isVoicemail(str)", () => {
      it("accepts a string", () => {
        assert.isDefined(isVoicemail(""));
      });

      it("returns false for non-strings", () => {
        assert.strictEqual(isVoicemail([]), false);
        assert.strictEqual(isVoicemail(true), false);
        assert.strictEqual(isVoicemail(-Infinity), false);
        assert.strictEqual(isVoicemail(NaN), false);
        assert.strictEqual(isVoicemail(undefined), false);
        assert.strictEqual(isVoicemail(null), false);
      });

      it("returns a boolean", () => {
        for (let [key, num] of Object.entries(test_numbers)) {
          assert.typeOf(isVoicemail(num), "boolean");
        }
      });

      it("returns false for local North American PSTN numbers");
      it("returns false for local 7-digit PSTN numbers");
      it("returns false for Colombian PSTN numbers with ICC");
      it("returns false for UK PSTN numbers with ICC");
      it("returns false for numbers with ; separators");
      it("returns false for extensions");
      it("returns true if the string is exactly `*97`");
    });

    describe("forceTrailingSlash", () => {
      it("accepts a string", () => {
        assert.isDefined(forceTrailingSlash(""));
      });

      it("returns false for non-strings", () => {
        assert.strictEqual(forceTrailingSlash([]), false);
        assert.strictEqual(forceTrailingSlash(true), false);
        assert.strictEqual(forceTrailingSlash(-Infinity), false);
        assert.strictEqual(forceTrailingSlash(NaN), false);
        assert.strictEqual(forceTrailingSlash(undefined), false);
        assert.strictEqual(forceTrailingSlash(null), false);
      });
    });

    describe("removeSelf", () => {
      it("accepts an array", () => {
        assert.isDefined(removeSelf(""));
      });

      it("returns false when supplied a non-array", () => {
        assert.strictEqual(removeSelf({}), false);
        assert.strictEqual(removeSelf(true), false);
        assert.strictEqual(removeSelf(-Infinity), false);
        assert.strictEqual(removeSelf(NaN), false);
        assert.strictEqual(removeSelf(undefined), false);
        assert.strictEqual(removeSelf(null), false);
      });

      it("returns an array when supplied an array", () => {
        var user_arr = [1, 2];
        var res = removeSelf(user_arr);
        assert.typeOf(res, "array");
      });

      it("returns the original array when there is no APISocket.current_user", () => {
        var user1 = new User({
          first_name: "test",
          last_name: "user",
          id: "123"
        });

        var user2 = new User({
          first_name: "second test",
          last_name: "user",
          id: "456"
        });

        var res = removeSelf(user1, user2);

        assert.isDefined(res);
        assert.strictEqual(res, false);
      });

      it("removes APISocket.current_user from a list", () => {
        var users = new User({
          id: "123",
          first_name: "test_user"
        });
      });
    });

    describe("setAPICredentials(opts)", () => {});

    describe("setAPIBasepath(basepath)", () => {});
  });
});
