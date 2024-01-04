var express = require('express');
var router = express.Router();
const stripe = require('stripe')(
   'sk_test_51Ne6koHuLJwbB1osSpGmVRBIPi4cBFRrGKHPFt7Hu2vXQsE8VN8L1rYfVIEHNQb283arvJrycTYeYNRogCAV2DjP00fr4Jmo9Z'
);

router.post('/intent', async (req, res) => {
   try {
      // create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
         amount: req.body.amount,
         currency: 'vnd',
         automatic_payment_methods: {
            enabled: true,
         },
      });
      // return the secret
      res.json({ paymentIntent: paymentIntent.client_secret });
   } catch (e) {
      res.status(400).json({
         error: e.message,
      });
   }
});

module.exports = router;
