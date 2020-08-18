require('dotenv').config()
import * as functions from 'firebase-functions';
import os = require('os');
import products from './database.json'
import * as cors from 'cors'
// const corsHandler = cors({ origin: true });
const cors = require('cors')({ origin: true });
// app.use(cors);

// globals
const stripe = require('stripe')(process.env.stripekey)
const base = (os.hostname().match(/dynac/)) ? 'http://localhost:3000' : 'https://zinestore.netlify.app/'
functions.logger.info('Using RootURL : ' + base)
const result: object = {}


function getProductById(id: string): object {
  let product: object = products.find((item) => item.id === id)
  if (product === undefined) {
    // no match found
    product = {
      id: id,
      msg: 'ID does not exist'
    }
  }
  console.log(product)
  return product
}

function getHandler(querystring: object): object {
  result['handler'] = 'GET'
  result['queryString'] = querystring
  result['code'] = 200
  return result
}

/*  shape
    {"id":"9d436e98-1dc9-4f21-9587-76d4c0255e33","quantity":1}
*/
function postHandler(req) {
  result['handler'] = 'POST'
  if (req.hasOwnProperty('query')) {
    result['queryString'] = req.query
  }
  if (req.hasOwnProperty('body')) {
    result['arguments'] = req.body
    if ('items' in req.body) {
      // get product details from DB
      result['productData'] = getProductById(req.body.items[0])
      result['code'] = 200
    } else {
      result['error'] = {
        msg: 'No productID found in body',
        status: 'Bad Request',
        desc: `server cannot or will not process the request due to something that
        is perceived to be a client error (e.g., malformed request syntax, invalid request
          message framing, or deceptive request routing).`
      }
      result['code'] = 400
    }
  }
  return result
}

function otherHandler(rawBody): object {
  result['handler'] = 'OTHERS'
  result['arguments'] = rawBody
  result['code'] = 400
  return result
}

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
  const resultO = {
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
      resultO.data = 'GET handler called'
      break;
    }
    case 'POST': {
      resultO['data'] = 'POST handler called'
      break;
    }
    default: {
      resultO['data'] = 'OTHER handler called'
      break;
    }
  }

  functions.logger.debug(resultO.query)
  // Terminate redirect, end, send
  response.status(200).json(resultO);
});



/*
  Checkout Sessions expire 24 hours after creation.
  deal with Promises - functions.https.onRequest( async (request, response) => {
  add cors middleware to avoid
  Access to XMLHttpRequest at 'http://---' from origin 'http://192.168.0.106:8080' has been blocked by CORS policy:
  No 'Access-Control-Allow-Origin' header is present on the requested resource.
*/
export const createPaymentIntent = functions.https.onRequest((request, response) => {
  // when trying to use async, await, error
  // Did you mean to mark this function as 'async'?

  /* Loose firebase logging! very bad */
  /* Accept CORS */
  response.set('Access-Control-Allow-Origin', '*');
  response.set("Access-Control-Allow-Methods", "*")
  response.set("Access-Control-Allow-Headers", "*")
  cors(request, response, () => {


    /* Fresh Object, else reuses the old global object */
    let res: object = {}

    switch (request.method) {
      case 'GET': {
        res = getHandler(request.query)
        break;
      }
      case 'POST': {
        res = postHandler(request)
        break;
      }
      default: {
        res = otherHandler(request)
        break;
      }
    }

    try {
      stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              // currency: 'EUR',
              product_data: {
                // name: res['productData'].name,
                name: 'Bernie Gledhill',
              },
              // in pennies
              // unit_amount: Number(res['productData'].price),
              unit_amount: 1200,
            },
            // quantity: Number(request.body.quantity),
            quantity: 1
          }
        ],
        mode: 'payment',
        // success_url: base + '/success?session_id={CHECKOUT_SESSION_ID}',
        success_url: base + '/',
        cancel_url: base + '/failure',
      }).then(session => {
        res['stripe'] = session
      })
    } catch (err) {
      // TypeError: failed to fetch
      functions.logger.error(err)
      res['code'] = 400
      res['error'] = err
    }
    /* ISSUE
    send a req with productID and then without productID => both will contain product info
    and vice versa
    */
    functions.logger.warn(res['stripe'])
    if (res.hasOwnProperty('error')) {
      response.status(res['code']).json(res)
    } else {
      response.status(res['code']).json(res)
    }
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

