/**
 * STUB webhooks
 * use them wisely as they can easily cause cyclic/circular dependency
 * https://en.wikipedia.org/wiki/Circular_dependency
 *
 * use the same collection as CRUD
 */
import * as functions from 'firebase-functions';
import { collection } from './common';

const trigger = functions.firestore.document(collection + '/{documentId}');

/**
 * Triggered when a document is written to for the first time.
 * TODO
 * [ ] send welcome email to new new users
 * [ ] send tutorials, how to use
 */
const onCreated = trigger.onCreate(async (snap, context) => {
  const original = snap.data();
  console.log('TRIGGER onCreate for: ', context.params.documentId);
  const result = { one: 1}
  return snap.ref.set(result, { merge: true })
});

/**
 * Triggered when a document already exists and has any value changed.
 * [ ] document update diff
 * [ ] realtime update notifications
 */
const onUpdated = trigger.onUpdate(async (snap, context) => {
  console.log('TRIGGER onUpdate ', context.params.documentId);
  const before = snap.before.data();
  const after = snap.after.data();
  console.log('before\t', before);
  console.log('after\t', after);
  return 'Updated trigger'
});

/**
 * Triggered when onCreate, onUpdate or onDelete is triggered.
 * respond to any change in data.
 * use it with caution
 */
const onWritten = trigger.onWrite(async (snap, context) => {
  console.log('TRIGGER onWrite ', context.params.documentId);
  const before = snap.before.data();
  const after = snap.after.data();
  console.log('before\t', before);
  console.log('after\t', after);
  return 'Document written hook'
});

/**
 * Triggered when a document with data is deleted.
 * TODO
 * [ ] sorry to let you go email. Action to join back
 */
const onDeleted = trigger.onDelete(async (snap, context) => {
  console.log('TRIGGER onDelete ', context.params.documentId);
  const original = snap.data();
  console.log(original);
  return 'Document deleted'
});


export {
  onCreated as documentCreated,
  onUpdated as documentUpdated,
  // onWritten as documentWritten,
  onDeleted as documentDeleted,
};