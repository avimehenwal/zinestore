const functions = require('firebase-functions');
// firebase functions:config:get > runtimeconfig.json
const ENV = require('./runtimeconfig.json')
const axios = require('axios')

console.log(ENV.dev.add_message.url);

const header = {
  'X-Custom-Header': 'foobar'
}

const queryString = {
  params:
    { text: 'sometext' }
}

const endpoint = axios.create({
  baseURL: ENV.dev.add_message.url,
  timeout: 10000,
  headers: header
});

describe("Cloud Function /addMessage", () => {
  test("GET with querystring", async () => {
    const response = (await endpoint.get('/', queryString))
    // console.log(Object.keys(response));
    // console.log(response.status);
    // console.log(response.statusText);
    // console.log(response.headers);
    // console.log(response.data);
    // console.log(Object.keys(response.request));
    // console.log(response.request._header);  // string
    expect(response.status).toBe(200)
    expect(response.statusText).toBe("OK")
    expect(response.request._headers).toHaveProperty("x-custom-header", "foobar")
    expect(response.data).toHaveProperty('result')
  }),
  test("GET without querystring", async () => {
    const response = (await endpoint.get('/', queryString));
    console.log(response.statusText);
    // expect(response.status).toBe(200)
    // expect(response.statusText).toBe("OK")
    // expect(response.request._headers).toHaveProperty("x-custom-header", "foobar")
    // expect(response.data).toHaveProperty('result')
  })
})

/**
 * Object.keys(axios.response)
 * [ 'status', 'statusText', 'headers', 'config', 'request', 'data' ]
 */