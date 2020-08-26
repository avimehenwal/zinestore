/**
 * CRUD library using admin-SDK
 *
 * [ ] Able to add products programatically
 * [ ] Able to fetch product info for verification
 *
 * you give it product ids, it spits out product details in stripe API format
 *
 * 1. POST: recieve productIDS
 * 2. verify proces for product IDS from db
 * 3. transform them to strip API format
 * 4. Ask stripe to create a paymentIntent
 * 5. return json to client
 *
 * dDB = default database
 *
 * NOTE triggers
 * database triggers are cloud functionshttps://firebase.google.com/docs/functions/firestore-events
 * https://stackoverflow.com/questions/63022522/can-i-create-triggers-with-admin-sdk-in-my-own-backend
 * https://firebase.google.com/docs/functions/firestore-events
 *
 * Note: Reads and writes performed in Cloud Functions are not controlled by your security rules,
 * they can access any part of your database.
 *
 * TODO idempotent functions
 */

/** FIXME GOOGLE_APPLICATION_CREDENTIALS
 * https://firebase.google.com/docs/admin/setup/
 */


/**
 * NOTE
 * get user info from authentication service
 * print the #arguments passsed to a fn
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
 */
/** SECTION CRUD operations
 *
 * admin return sensetive information like secret key
 * so do NOT return it as it is.
 * https://googleapis.dev/nodejs/firestore/latest/CollectionReference.html#add
 */

/** NOTE reading data
 * https://googleapis.dev/nodejs/firestore/latest/CollectionReference.html#get
 * https://googleapis.dev/nodejs/firestore/latest/QuerySnapshot.html
 *
 * read all records from db
 *
 * NOTE import inside class?
 * https://stackoverflow.com/questions/5262406/import-statement-inside-class-function-definition-is-it-a-good-idea
 */

/**
 * NOTE : QuerySnapshot
 * [+] timing information. TODO: How to explot that info?
 * [ ] get multiple results byId
 *
 * NOTE Object Manupulation
 * - add id to snapshot results.
 * Object.assign to copy Object(target, source)
 * https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot#~id
 *
 * if typeof metadata is undefined, it is not returned
 */
/**
 * collection size
 */

// IIFE Immediately invoked function expression
// (async () => {
  //   const userName = await getUser(testUid)
  //   // functions.logger.info(Object.getOwnPropertyNames(userName));
  //   functions.logger.info(userName);
  // })();

  // module.exports = getUser;


  /**
   * NOTE python dir() alternative?
   * Object.keys()
   * functions.logger.info(typeof userName, Object.getOwnPropertyNames(userName));
 *
 * REVIEW github code sample
 * https://github.com/bartolomej/its-server/blob/9532afd294569b7ffc3a767423d95dafeb85a136/src/modules/admin/firebase.js
 *
 */

import * as serviceAccount from "./certificate.json";
import * as admin from "firebase-admin";

(async (userId = 'dfRKlzuntjWuEVHmHtvW7MvOFDF2') => {
  console.log(arguments.length);
  const userData = (await admin.auth().getUser(userId)).toJSON();
  console.log(userData);
  // return userData
});

/**
 * TODO CRUD Library
 * [x] create
 * [x] read
 * [ ] update
 * [ ] delete
 * [ ] database triggers
 */
class CRUD {
  admin: any;
  collection: string = 'test';
  dummyData: Object = { fname: 'avi', lName: 'mehenwal' };
  db: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;

  constructor(collection: string) {
    this.collection = collection;
    this.admin = admin.initializeApp({
      /** REVIEW supress error, expects type string
       * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html#suppress-errors-in-ts-files-using--ts-ignore-comments
       */
      // @ts-ignore
      credential: admin.credential.cert(serviceAccount),
      // credential: admin.credential.applicationDefault(),
      databaseURL: "https://estore-1597310330087.firebaseio.com"
    });
    console.log(`admin SDK version v${admin.SDK_VERSION} initalized`);
    this.db = admin.firestore().collection(this.collection)
  }

  create = async (document: object = this.dummyData) => {
    const created = await this.db.add(document);
    // [ '_firestore', '_path', '_converter' ]
    // console.log(Object.keys(created));
    // const id = created.id.toString()
    const id = created.id
    // console.log(typeof id + ': ' + id);
    console.log(`Created : ${id}`);
    return id
  }

  read = async (primaryKey: string = '6dXuiXtQeTZsnIcoQR23') => {
    const snapshot = await this.db.doc(primaryKey).get();
    if (!snapshot.exists) {
      console.log('No such document!');
      return { error: 'No such document!'}
    } else {
      const result = snapshot.data();
      Object.assign(result, { id: snapshot.id });
      // ('metadata' in snapshot) ? Object.assign(result, { metadata: snapshot.metadata }) : null;
      console.log('document fetched', result);
      return result
    }
  }

  readAll = async () => {
    const snapshot = await this.db.get();
    let data: any = [];
    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
      data.push(Object.assign({ id: doc.id}, doc.data()))
    });
    console.log('number of documents returned : ' + snapshot.size);
    console.log(data);
    return data
  }

  size = async () => {
    const count = (await this.db.get()).size;
    console.log('collection size : ' + count);
    return count
  }

  trigger = async () => {
    const res = await this.db.onSnapshot
  }

}

/**
 * Algorithm
 * [ ] create a default record and then print it
 *
 * NOTE naming convention
 * suffix C for collections, just like Interfaces, but in reverse
 */

(async() => {
  let testCollection = new CRUD('test');
  const newDoc = await testCollection.create();
  const doc =  await testCollection.read(newDoc);
  console.log(doc);

  // testCollection.readAll();
})();

export = CRUD;

