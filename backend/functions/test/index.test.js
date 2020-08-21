require('dotenv').config()
// 1. initializeonline mode
const test = require('firebase-functions-test')({
  databaseURL: process.env.databaseURL,
  storageBucket: process.env.storageBucket,
  projectId: process.env.projectId,
}, './test/estore-1597310330087-271c0dcec381.json');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const addMessageUrl = functions.config().dev.add_message;

// 2. config mock


// 3. import code modules
// import { jest } from '@jest/globals'
const axios = require('axios');


// 4. test cases

let index, adminStub;

/**
 * Creates a mock function similar to jest.fn but also tracks calls to
 * object[methodName]. Returns a Jest mock function. ::spyOn
 * https://jestjs.io/docs/en/jest-object
 *
 * typescript jest
 * https://basarat.gitbook.io/typescript/intro-1/jest
 *
 * babel transpile
 * https://jestjs.io/docs/en/getting-started#using-babel
 *
 * blog
 * https://medium.com/@h.malik144/jest-testing-for-firebase-functions-a51ce1094d38
 */
beforeAll(() => {
  adminStub = jest.spyOn(admin, 'initializeApp');
  index = require('../src/index.ts')
  return;
});

afterAll(() => {
  adminStub.mockRestore();
  // testEnv.cleanup();
});

async function getCall(text='sometextlikehell') {
  try {
    const res = await axios.get(addMessageUrl,
      { params: { text: text } }
    );
    return res.data
  } catch (err) {
    console.log(err);
    return false
  }
}

describe("Cloud Functions Test Suite", () => {
  it("test basic function returns 6", () => {
    console.log(index);
    expect(index.basicTest()).toBe(6);
  }),
  it("call addMessage with text querystring", async () => {
    const actual = await getCall()
    console.log(actual);
    // { result: 'Message with ID: kqAJ5jlIgHeO0ryU9cLW added.' }
    expect(actual).toHaveProperty('result')
  })
});