<template>
  <div>
    <h1>Product</h1>
    <!-- Add to card -->
    <button id="checkout-button" @click="checkout" class="button--grey">Checkout</button>
    <p>{{ product }}</p>
    <img :src="product.image" :alt="product.name" >
    <p>{{ session }}</p>
    <p>{{ stripe }}</p>
    <p>{{ backend }}</p>
    <p>Secret : {{ secret }}</p>
    <p>{{ $config.apiSecret }}</p>
    <nuxt-link to="/" class="button--green">
      Home
    </nuxt-link>
  </div>
</template>

<script>
// in nuxtjs document and window are not available due to server side rendering

export default {
  data: () => ({
    product: {
      name: 'T-shirt',
      unitAmount: 2000,
      quantity: 1,
      image: 'https://picsum.photos/200/300',
    },
    // secret: this.$config.apiSecret,
    stripe: null,
    session: null
  }),
  mounted () {
    this.getStripeSessionId()
    /* global Stripe */
    this.stripe = Stripe(this.$config.apiSecret)
  },
  methods: {
    async getStripeSessionId () {
      const data = await this.$axios.$get(this.$config.backend)
      this.session = data.id
    },
    checkout () {
      this.stripe
        .redirectToCheckout({
          sessionId: this.session
        })
        .then(function (result) {
          console.log(result)
        })
      console.log('success')
    }
  }
}
</script>

<style>
</style>
