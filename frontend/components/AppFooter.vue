<template>
  <footer>
    <section class="callout">
      <h2>"The surprising styles of {{ $config.storeName }} are advanced for all seasons."</h2>
      <p>Hansel Andersen</p>
    </section>

    <app-footer-links />
    <div class="sarahstuff">
      <p>
        This project is made with love
      </p>
    </div>
  </footer>
</template>

<script>
import AppFooterLinks from "~/components/AppFooterLinks.vue";

export default {
  components: {
    AppFooterLinks
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/main.scss';

.callout {
  width: 100%;
  height: 280px;

/*
  color, image, origin and size, or repeat method.
  https://www.w3schools.com/cssref/css3_pr_background-origin.asp
*/
  // background: url("/callout.jpg") center center no-repeat;
  // background: content-box linear-gradient($brandprimary, $brandsecondary);
  // background: border-box linear-gradient($brandprimary, $brandsecondary);
  background: border-box $brandprimary;

/*
    Inline SVG in CSS property
    https://stackoverflow.com/questions/10768451/inline-svg-in-css
  background-image:
        url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><linearGradient id='gradient'><stop offset='10%' stop-color='%23F00'/><stop offset='90%' stop-color='%23fcc'/> </linearGradient><rect fill='url(%23gradient)' x='0' y='0' width='100%' height='100%'/></svg>");

    Repeatable SVG patterns
    https://webdesign.tutsplus.com/tutorials/how-to-use-svg-patterns-as-backgrounds--cms-31507
*/

  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  h2 {
    padding: 0 30px;
    text-align: center;
  }
}

.sarahstuff {
  background: black;
  width: 100%;
  padding: 10px 30px;
  color: white;
  text-align: center;
}

a,
a:visited,
a:active {
  color: #c4c3ec;
  font-weight: bold;
}
</style>