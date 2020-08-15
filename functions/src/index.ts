require('dotenv').config()
import * as functions from 'firebase-functions';

// globals
const stripe = require('stripe')(process.env.stripekey)
const cors = require('cors')({ origin: true });
const base = 'http://localhost:3000'

/*
*  [x] Return json
*  [x] deal with POST request
*  [x] use full blown express app
* Advantages
* [ ] routing
* [ ] middleware
* [ ] cors
* Disadvantages
* [ ] Do not get the emulator console
*/

export const helloWorld = functions.https.onRequest((request, response) => {
  const result = {
    body: request.body,
    query: request.query,
    method: request.method,
    rawBody: request.rawBody,
    headers: request.get('User-Agent'),
    data: '',
  }

  // RESTful http verb handler
  switch (request.method) {
    case 'GET': {
      result.data = 'GET handler called'
      break;
    }
    case 'POST': {
      result['data'] = 'POST handler called'
      break;
    }
    default: {
      result['data'] = 'OTHER handler called'
      break;
    }
  }

  functions.logger.debug(result.query)
  // Terminate redirect, end, send
  response.status(200).json(result);
});

/*
  Checkout Sessions expire 24 hours after creation.
  deal with Promises - functions.https.onRequest( async (request, response) => {
  add cors middleware to avoid
  Access to XMLHttpRequest at 'http://---' from origin 'http://192.168.0.106:8080' has been blocked by CORS policy:
  No 'Access-Control-Allow-Origin' header is present on the requested resource.
*/
export const stripebackend = functions.https.onRequest((request, response) => {
  // when trying to use async, await, error
  // Did you mean to mark this function as 'async'?
  cors(request, response, () => {
    stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          // currency: 'usd',
          currency: 'EUR',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 1000,        // in pennies
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: base + '/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: base + '/failure',
    }, function (err: Object, session: Object) {
      response.send(session)
    })
  })
})

/*
{
  "id": "cs_test_TWZ1BYGkSyvKtzTzhCmMEckwoCeK4A0bLZfyP3FURyXLn3tN14xImSpI",
  "object": "checkout.session",
  "allow_promotion_codes": null,
  "amount_subtotal": 2000,
  "amount_total": 2000,
  "billing_address_collection": null,
  "cancel_url": "http://localhost:8080/failure",
  "client_reference_id": null,
  "currency": "eur",
  "customer": null,
  "customer_email": null,
  "livemode": false,
  "locale": null,
  "metadata": {},
  "mode": "payment",
  "payment_intent": "pi_1HGUhND0sxgkGHoQvCwsSTVT",
  "payment_method_types": [
    "card"
  ],
  "setup_intent": null,
  "shipping": null,
  "shipping_address_collection": null,
  "submit_type": null,
  "subscription": null,
  "success_url": "http://localhost:8080/success?session_id={CHECKOUT_SESSION_ID}",
  "total_details": {
    "amount_discount": 0,
    "amount_tax": 0
  }
}
*/
