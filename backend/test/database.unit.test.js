require('dotenv').config()
import {
  initializeTestApp,
  initializeAdminApp,
  clearFirestoreData,
  assertSucceeds,
  assertFails
} from "@firebase/testing";

/**
 * Test database rules
 * Simulating requests with a auth
 * Bypassing security rules using firebase-admin
*/

const myId = "user_abc";
const theirId = "user_xyz"
const myAuth = { uid: myId, email: 'abc@xyz.com' }
const ProjectID = process.env.projectId
console.log('ProjectId = ' + ProjectID);

/* create client test app */
function getFirestore(auth) {
  return initializeTestApp({ projectId: ProjectID, auth: auth }).firestore();
}

/* Bypass security rules */
function getAdminFirestore() {
  return initializeAdminApp({ projectId: ProjectID }).firestore();
}

async function clearDatabase() {
  await clearFirestoreData({ projectId: ProjectID });
}

/* test setup and teardown fixtures */
beforeEach(async () => {
  await clearDatabase()
});

afterAll(async () => {
  await clearDatabase()
});

/**
 * for user collection
    gogole auth provides an ID for each authenticated user
    we create new use document in app using authenticated ID

    request Object contains auth information

    If its coming from client how can we trust it?

    IDToken is generated by google auth server, passed along with all client request
    + key signed by google private key
    Database rules servers verifies this token against public key

    All tests should pass and pass with the right reasons
*/

/* Test suite */
describe("our Social app", () => {
  test("sample addition test 2+2=4", () => {
    expect(2 + 2).toBe(4)
  });
  test("can read from read-only database", async () => {
    const db = getFirestore(null);
    // console.log(db);
    const testDoc = db.collection("readonly").doc("testDoc");
    // console.log(testDoc);
    // debugger;
    await assertSucceeds(testDoc.get());
    /* but document is not there?
        test passes because we get a empty snapshot
    */
  })
  test("can't write in readonly database", async () => {
    const db = getFirestore(null);
    const testDoc = db.collection("readonly").doc("testDoc");
    await assertFails(testDoc.set({
      foo: 'bar'
    }));
  })
  test("can write a document with same ID as user", async () => {
    const db = getFirestore(myAuth);
    /* FirebaseError: 7 PERMISSION_DENIED: */
    const testDoc = db.collection("users").doc(myId);
    await assertSucceeds(testDoc.set({ foo: 'bar' }));
  })
  test("can't write a document with different ID as user", async () => {
    const db = getFirestore(myAuth);
    const testDoc = db.collection("users").doc(theirId);
    await assertFails(testDoc.set({ foo: 'bar' }));
  })
  test("can read posts marked public", async () => {
    const db = getFirestore(null);                       /* not signed in user */
    const testQuery = db.collection("posts").where("visibility", "==", "public")
    await assertSucceeds(testQuery.get());
  })
  /**
   * How does it passes? we dont even have a post collection yet!
   * Would rules allow this query no matter of underlying data?
   */
  test("can query personal posts", async () => {
    const db = getFirestore(myAuth);                       /* not signed in user */
    const testQuery = db.collection("posts").where("authorId", "==", myId)
    await assertSucceeds(testQuery.get());
  })
  test("can query all posts", async () => {
    const db = getFirestore(null);
    const testQuery = db.collection("posts");
    await assertFails(testQuery.get());
  })
  test("can read a single public post", async () => {
    const docId = "public_post"
    const admin = getAdminFirestore()
    /* access as admin */
    const testDoc = admin.collection("posts").doc(docId);
    await testDoc.set({ authorId: theirId, visibility: 'public' })

    const db = getFirestore(null);
    /* access as client or user */
    const testRead = db.collection('posts').doc(docId)
    await assertSucceeds(testRead.get());
  })
})