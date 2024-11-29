require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const express = require('express');
const app = express();
const corsOptions = {
  origin: ["https://stripe-payment-gateway-five.vercel.app"], 
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions)); 
app.use(express.json());

app.post('/api/payment', async (req, res) => {
  try {
    const { amount, paymentMethodId } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      payment_method_types: ['card'],
      payment_method: paymentMethodId,
      confirm: true,
      error_on_requires_action: true,
    });

    res.json({ message: 'Payment successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = app;
