// to run all tests, run the command npm test in your terminal
// to run a test file, run the command npm test:single your_file_path  (eg: npm test:single './sum.test.js)

// import the function you want to test
import sum from "./sum.js";
// import Node's test and assert modules
import { test, describe, it } from "node:test";
import assert from "assert";

// create a describe block to group your tests
describe("sum function should return the sum of the arguements", () => {
  // test case 1: example test
  test("1 + 2 should return 3", () => {
    assert.strictEqual(sum(1, 2), 3);
  });

  // Test case 2: Zero as an argument
  test("should return 5 when adding 5 and 0", () => {
    const input = sum(5, 0);
    const output = 5;
    assert.strictEqual(input, output);
  });
  // it behaves the same way as test
  it("should return 3 when adding 4 and -1", () => {
    assert.strictEqual(sum(4, -1), 3);
  });
});

// how to run tests in a hierarchy
describe("run tests in a specific order", () => {
  test("sum testing order", async (t) => {
    // subtest 1 runs first
    await t.test("return 0 when adding 1 and -1", () => {
      console.log("this runs first");
      assert.strictEqual(sum(1, -1), 0);
    });

    // subtest 2 runs second
    await t.test("return 5 when adding 2 and 3", () => {
      console.log("this runs second");
      assert.strictEqual(sum(2, 3), 5);
    });
  });
});

// how to skip tests
describe("skipping tests", () => {
  // using skip option
  test("skip option", { skip: true }, (t) => {
    console.log("You won't see this message");
  });
  // using skip option with a message
  test("skip option with message", { skip: "this is also skipped" }, (t) => {
    console.log('you won"t see this either');
  });
  // using skip() method
  test("skipping with method", (t) => {
    t.skip();
  });
  // using skip() with a message
  test("skipping with message in the method", (t) => {
    t.skip("this is also skipped");
  });
});
