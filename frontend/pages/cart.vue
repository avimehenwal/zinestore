<template>
  <div>
    <app-cart-steps />
    <hr />
    <h1 class="center">Your Cart</h1>

    <section v-if="cartUIStatus === 'idle'">
      <app-cart-display />
    </section>

    <section v-else-if="cartUIStatus === 'loading'" class="loader">
      <app-loader />
    </section>

    <section v-else-if="cartUIStatus === 'success'" class="success">
      <h2>Success!</h2>
      <p>Thank you for your purchase. You'll be receiving your items in 4 business days.</p>
      <p>Forgot something?</p>
      <button class="pay-with-stripe">
        <nuxt-link exact to="/">Back to Home</nuxt-link>
      </button>
    </section>


    <section v-else-if="cartUIStatus === 'failure'">
      <p>Oops, something went wrong. Redirecting you to your cart to try again.</p>
    </section>

    <button @click="checkout">Checkout</button>

    <app-sales-boxes />
  </div>
</template>

<script>
import AppLoader from "~/components/AppLoader.vue";
import AppCartSteps from "~/components/AppCartSteps.vue";
import AppSalesBoxes from "~/components/AppSalesBoxes.vue";
import AppCartDisplay from "~/components/AppCartDisplay.vue";
import { mapState, mapActions } from "vuex";


export default {
  components: {
    AppCartDisplay,
    AppSalesBoxes,
    AppCartSteps,
    AppLoader
  },
  computed: {
    ...mapState(["cartUIStatus", 'clientSecret']),
  },
  mounted () {
    this.stripe = Stripe(this.$config.clientToken)
  },
  data: () => ({
    stripe: null,
  }),
  methods: {
    checkout () {
      this.callPaymentIntent()
      this.stripe.redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as argument here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.

        sessionId: this.clientSecret
      }).then(function (result) {
        console.log('Success')
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
        console.log(result.error.message)
      })
    },
    callPaymentIntent () {
        // create a PaymentIntent on Stripe with order information
        this.$store.dispatch("createPaymentIntent");
    }
  },
  computed: {
    ...mapState([
      "clientSecret",
      "cartUIStatus"
    ]),
  },

};
</script>

<style lang="scss" scoped>
.loader {
  display: flex;
  justify-content: center;
}

.success {
  text-align: center;
}
</style>