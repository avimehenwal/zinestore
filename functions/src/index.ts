require('dotenv').config()
import * as functions from 'firebase-functions';
import os = require('os');
import products from './database.json'
import * as cors from 'cors'
// const corsHandler = cors({ origin: true });
// const cors = require('cors')({origin: true});
// app.use(cors);

// globals
const stripe = require('stripe')(process.env.stripekey)
let base = (os.hostname().match(/dynac/)) ? 'http://localhost:3000' : 'https://zinestore.netlify.app/'
functions.logger.info('Using RootURL : ' + base)
let result: object = {}


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

function postHandler(req) {
  result['handler'] = 'POST'
  if (req.hasOwnProperty('query')) {
    result['queryString'] = req.query
  }
  if (req.hasOwnProperty('body')) {
    result['arguments'] = req.body
    if ('productId' in req.body) {
      // get product details from DB
      result['productData'] = getProductById(req.body.productId)
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
export const createPaymentIntent = functions.https.onRequest(async (request, response) => {
  // when trying to use async, await, error
  // Did you mean to mark this function as 'async'?

  /* Loose firebase logging! very bad */
  // corsHandler(request, response, () => {})
  /* Accept CORS */
  response.set('Access-Control-Allow-Origin', '*');

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

  const session: object = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        // currency: 'EUR',
        product_data: {
          name: res['productData'].name,
        },
        // in pennies
        unit_amount: Number(res['productData'].price),
      },
      quantity: Number(request.body.quantity),
    }],
    mode: 'payment',
    success_url: base + '/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: base + '/failure',
  })

  res['stripe'] = session
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

