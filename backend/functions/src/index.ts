require('dotenv').config()
import functions = require('firebase-functions');
import os = require('os');
import axios from 'axios'
const base = (os.hostname().match(/dynac/)) ? 'http://localhost:3000' : 'https://zinestore.netlify.app/'
// const cors = require('cors')({ origin: true });
// const stripe = require('stripe')(functions.config().stripe.key)
functions.logger.info('Using RootURL : ' + base)
import admin = require('firebase-admin');
admin.initializeApp();

exports.addMessage = functions.https.onRequest(async (req, res) => {
  const original = req.query.text;
  const writeResult = await admin.firestore().collection('messages').add({ original: original });
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore.document('/messages/{documentId}').onCreate(async (snap, context) => {
  // get original property of Object
  const original = snap.data().original;

  // Access the parameter `{documentId}` with `context.params`
  functions.logger.log('Uppercasing', context.params.documentId, original);

  const uppercase = original.toUpperCase();

  // Make a request for a user with a given ID
  const result = await axios.get(String(process.env.emailerURL))
  console.log(result);
  return snap.ref.set({
      email: result,
      overwrite: uppercase
  }, { merge: true })
})

exports.basicTest = function() {
  const a = 1;
  const b = 5;
  return a + b;
}