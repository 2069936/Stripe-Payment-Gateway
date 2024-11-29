require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');  // Import CORS

module.exports = async (req, res) => {
  // Apply CORS middleware
  cors({
    origin: ["https://waaxx.webflow.io", "http://localhost:3000", "https://stripe-payment-gateway-five.vercel.app"], // Sesuaikan dengan domain frontend Anda
    optionsSuccessStatus: 200,
  })(req, res, () => {});

  if (req.method === 'POST' && req.url === '/payment') {
    try {
      const amount = req.body.amount;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,  // Convert to cents
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

  if (req.method === 'POST' && req.url === '/save-card') {
    try {
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
};
