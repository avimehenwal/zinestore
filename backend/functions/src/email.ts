const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// admin.initializeApp();

/**
 * Function to add new User and set its associated actions
 * [ ] Entertain only post requests
 * [ ] Add some form of authentication mechanism, to void D-DOS
 * [ ] capture new user info, schema?
 * [ ] choice to send or not to send welcome email
 * [ ] email on every new user account creation onCreate() event trigger
 *
 */
exports.addUser = functions.https.onRequest(async (req: any, res: { json: (arg0: { result: string; }) => void; }) => {
  console.log(req)

  // Push the new message into Cloud Firestore using the Firebase Admin SDK.
  // const writeResult = await admin.firestore().collection('messages').add({original: original});
  // Send back a message that we've succesfully written the message
  // res.json({result: `Message with ID: ${writeResult.id} added.`});
  res.json({result: 'Server Response'})
});







