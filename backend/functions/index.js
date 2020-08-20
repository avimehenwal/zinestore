require('dotenv').config()
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const os = require('os');
const cors = require('cors')({ origin: true });
const stripe = require('stripe')(process.env.stripekey)
functions.logger.info(process.env.stripekey);
const base = (os.hostname().match(/dynac/)) ? 'http://localhost:3000' : 'https://zinestore.netlify.app/'
functions.logger.info('Using RootURL : ' + base)
admin.initializeApp();
const axios = require('axios');

exports.addMessage = functions.https.onRequest(async (req, res) => {
  const original = req.query.text;
  const writeResult = await admin.firestore().collection('messages').add({ original: original });
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore.document('/messages/{documentId}').onCreate((snap, context) => {
  // get original property of Object
  const original = snap.data().original;

  // Access the parameter `{documentId}` with `context.params`
  functions.logger.log('Uppercasing', context.params.documentId, original);

  const uppercase = original.toUpperCase();

  const emailerURL = process.env.emailerURL
  // Make a request for a user with a given ID
  axios.get(emailerURL)
  .then((response) => {
    const result = response.data
    console.log(result);
    return snap.ref.set({
       email: result,
       overwrite: uppercase
    }, { merge: true })
   })
  .catch((error) => {
    return snap.ref.set({email: error }, { merge: true })
  })
})