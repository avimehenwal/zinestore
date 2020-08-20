[![Netlify Status](https://api.netlify.com/api/v1/badges/4dafb7aa-ca5b-4002-8c53-9e5597dff425/deploy-status)](https://app.netlify.com/sites/zinestore/deploys)

# zinestore
:shopping_cart: zinestore

```sh
firebase functions:config:set someservice.key="THE API KEY" someservice.id="THE CLIENT ID"
firebase functions:config:get
```

```js
  mounted() {
    // Xpath to test //script[contains(@src, 'stripe')]
    const scripeScript = document.createElement("script");
    scripeScript.setAttribute("src", "https://js.stripe.com/v3/");
    document.head.appendChild(scripeScript);
    scripeScript.onload = () => {
      const msg = "stripe js loaded";
      console.log(msg);
      console.log(scripeScript);
      // tell compiler to use global Stripe Object and avoid compilation error
      // https://stackoverflow.com/questions/43457372/error-stripe-is-not-defined-no-undef
      /* global Stripe */
      this.stripe = Stripe(process.env.VUE_APP_KEY);
    };
    this.getStripeSessionId();
  },
```
## Issues

* How to backup and restore cloud db

## Related Work

* https://github.com/nendonerd/wizardzines
* https://github.com/tildetown/zine

#### :v: Get in touch with me

> I am looking for Jobs ... :sunglasses:

* [Github](https://github.com/avimehenwal/)
* [My Website](https://avimehenwal.in)
* [My Blog v2](https://avimehenwal2.netlify.app/)
* [Twitter Handle](https://twitter.com/avimehenwal)
* [LinkedIn](https://in.linkedin.com/in/avimehenwal)
* [Stackoverflow](https://stackoverflow.com/users/1915935/avi-mehenwal)

<a href="https://www.buymeacoffee.com/F1j07cV" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important;" ></a>

 Spread Love :hearts: and not :no_entry_sign: hatred   [![Twitter Follow](https://img.shields.io/twitter/follow/avimehenwal.svg?style=social)](https://twitter.com/avimehenwal)