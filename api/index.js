require('dotenv').config();
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

// CORS settings
const corsOptions = {
  origin: ["https://waaxx.webflow.io", "http://localhost:3000"],
  optionsSuccessStatus: 200,
};

module.exports = async (req, res) => {
  // Apply CORS
  cors(corsOptions)(req, res, () => {});

  if (req.method === 'POST' && req.url === '/save-card') {
    try {
      // CREATE customer
      const customer = await stripe.customers.create({
        name: 'Gwen Stacy',
        email: 'gwenstacy101@gmail.com',
        payment_method: req.body.paymentMethodId,
        invoice_settings: {
          default_payment_method: req.body.paymentMethodId
        }
      });

      console.log(customer);

      res.status(201).json({ message: 'Card saved successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  if (req.method === 'POST' && req.url === '/payment') {
    try {
      const amount = req.body.amount;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'usd',
        payment_method_types: ['card'],
        payment_method: req.body.paymentMethodId,
        confirm: true,
        error_on_requires_action: true
      });

      res.json({ message: 'Payment successful' });
      console.log(paymentIntent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
