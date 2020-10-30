/**
 * Business Logic / Algorithm built on top of library functions
 *
 * [ ] create a default record and then print it
 *
 */

import CRUD from './admin';
import { collection } from './common';

let app = new CRUD(collection);

(async() => {
  console.log('from business logic');

  const newDoc = await app.create();
  const doc = await app.read(newDoc);
  console.log(doc);
  // testCollection.readAll();
})();

/**
 * FIXME
 * do not export anything from this file
 * ⚠  functions: Maximum call stack size exceeded
 */