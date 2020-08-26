/**
 {
   "uid": "dfRKlzuntjWuEVHmHtvW7MvOFDF2",
   "email": "avi@gmail.com",
   "emailVerified": false,
   "disabled": false,
   "metadata": {
     "lastSignInTime": "Fri, 14 Aug 2020 00:33:39 GMT",
     "creationTime": "Thu, 13 Aug 2020 23:50:41 GMT"
    },
    "tokensValidAfterTime": "Thu, 13 Aug 2020 23:50:41 GMT",
    "providerData": [
      {
        "uid": "avi@gmail.com",
        "email": "avi@gmail.com",
        "providerId": "password"
      }
    ]
  }
  */

import getUser from '../lib/admin.js';
const validUid = 'dfRKlzuntjWuEVHmHtvW7MvOFDF2';
const invalidUid = 'sadifianbfkhwioefblopashfo';

describe("admin test suite", () => {
  test('valid uid', async () => {
    const actual = await getUser(validUid)
    // console.log(actual);
    expect(actual).toHaveProperty('email')
    expect(actual).toHaveProperty('uid')
    expect(actual).toHaveProperty('disabled')
    expect(actual).toHaveProperty('providerData')
  }),
  test('invalid uid', async () => {
    /** expect a JSON and not Promise Rejection
    { "code": "auth/user-not-found",
      "message": "There is no user record corresponding to the provided identifier."
    }
    */
    const actual = await getUser(invalidUid)
    console.log(JSON.stringify(actual, null, 2));
    expect(actual).toHaveProperty("code", "auth/user-not-found")
    expect(actual).toHaveProperty("message", "There is no user record corresponding to the provided identifier.")
  })
})
