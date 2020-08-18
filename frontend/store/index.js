import axios from "axios";
import data from "~/static/storedata.json";


export const state = () => ({
  cartUIStatus: "idle",
  storedata: data,
  env: process.env.NODE_ENV,
  dev: process.env.NODE_ENV !== 'production',
  endpoint: (process.env.NODE_ENV === 'production') ? process.env.prodURI : process.env.devURI,
  cart: [],
  // Required to initiate the payment from the client
  clientSecret: ""
});

export const getters = {
  featuredProducts: state => state.storedata.slice(0, 3),
  women: state => state.storedata.filter(el => el.gender === "Female"),
  men: state => state.storedata.filter(el => el.gender === "Male"),
  cartCount: state => {
    if (!state.cart.length) return 0;
    return state.cart.reduce((ac, next) => ac + next.quantity, 0);
  },
  cartTotal: state => {
    if (!state.cart.length) return 0;
    return state.cart.reduce((ac, next) => ac + next.quantity * next.price, 0);
  },
  cartItems: state => {
    if (!state.cart.length) return [];
    return state.cart.map(item => {
      return {
        id: item.id,
        quantity: item.quantity
      };
    });
  },
  clientSecret: state => state.clientSecret
};

export const mutations = {
  updateCartUI: (state, payload) => {
    state.cartUIStatus = payload;
  },
  clearCart: state => {
    //this clears the cart
    (state.cart = []), (state.cartUIStatus = "idle");
  },
  addToCart: (state, payload) => {
    let itemfound = state.cart.find(el => el.id === payload.id);
    itemfound
      ? (itemfound.quantity += payload.quantity)
      : state.cart.push(payload)
  },
   setClientSecret: (state, payload) => {
    state.clientSecret = payload;
   },
  addOneToCart: (state, payload) => {
    let itemfound = state.cart.find(el => el.id === payload.id)
    itemfound ? itemfound.quantity++ : state.cart.push(payload)
  },
  removeOneFromCart: (state, payload) => {
    let index = state.cart.findIndex(el => el.id === payload.id)
    state.cart[index].quantity
      ? state.cart[index].quantity--
      : state.cart.splice(index, 1)
  },
  removeAllFromCart: (state, payload) => {
    state.cart = state.cart.filter(el => el.id !== payload.id)
  }
};

export const actions = {
  async createPaymentIntent({ getters, commit, state }) {
    try {
      // Create a PaymentIntent with the information about the order
      console.log(state.endpoint)
      const result = await this.$axios.$post(
        // this.$config.backend,
        state.endpoint,
        {
          items: getters.cartItems
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Request-Method": "*",
            "Access-Control-Request-Headers": "*",
          }
        }
      );
      console.log(result.stripe.id)
      if (result.stripe.id) {
        // Store a reference to the client secret created by the PaymentIntent
        // This secret will be used to finalize the payment from the client
        commit("setClientSecret", result.stripe.id);
      }
    } catch (e) {
      console.log("error", e);
    }
  }
};
