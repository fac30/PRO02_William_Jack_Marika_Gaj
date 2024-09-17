// to run all tests, run the command npm test in your terminal
// to run a test file, run the command npm test:single your_file_path  (eg: npm test:single './sum.test.js)

// import the function you want to test
import sum from "./sum.js";
// import Node's test and assert modules
import { test, describe } from "node:test";
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
});
