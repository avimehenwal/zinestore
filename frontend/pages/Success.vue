<template>
  <div>
    <h1>Success</h1>
    <p>{{ this.$route.query }}</p>
    <p>{{ this.$route.params }}</p>
    <nuxt-link to="/" class="button--green">
      Home
    </nuxt-link>
  </div>
</template>

<script>
export default {}
</script>

<style>
</style>
