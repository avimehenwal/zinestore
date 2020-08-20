require('dotenv').config()
import {
  initializeTestApp,
  initializeAdminApp,
  clearFirestoreData,
  assertSucceeds,
  assertFails
} from "@firebase/testing";

const myId = "user_abc";
const theirId = "user_xyz"
const myAuth = { uid: myId, email: 'abc@xyz.com' }
const ProjectID = process.env.projectId
const testCollection = 'testCollection'
const csvFile = 'products.csv'
const products = require('./products.json')

const sampleDoc = { fname: 'avi', lname: 'mehenwal' }
const data = { name: 'Los Angeles', state: 'CA', country: 'USA' }

/* create client test app */
function getFirestore(auth) {
  return initializeTestApp({ projectId: ProjectID, auth: auth }).firestore();
}

async function addDataById(id, data) {
  const db = getFirestore(null)
  return await db.collection(testCollection).doc(id).set(data)
}

async function addJson(data) {
  const db = getFirestore(null)
  return await db.collection(testCollection).doc().set(data)
}

async function getDataById(id) {
  const db = getFirestore(null)
  return await db.collection(testCollection).doc(id).get()
}

async function readAll() {
  const db = getFirestore(null)
  const events = await db.collection(testCollection).get()
    .then(snapshot => snapshot.docs.map(doc => doc.data()))
  // console.log(events)
  console.log(events.length)
  return events
}

describe("Database experiment", () => {
  test("in progress", async () => {
    // console.log(products);
    // console.log(products.length)
    products.forEach(item => addDataById(item.ID, item))
    const items = await readAll()
    // console.log(`from db ${items}`)
    console.log(items)
  });
  test("set single json record to database", async () => {
    const result = addDataById('AL', data)
    await result
      .then(() => console.log('success'),
        () => console.log('Failure'),
      )
  });
  test("read data from db by ID", async () => {
    addJson(data)
    addDataById('LA', data)
    const snap = await assertSucceeds(getDataById('LA'))
    console.log(snap.data());
    expect(snap.data()).toMatchObject(data)
  });
})