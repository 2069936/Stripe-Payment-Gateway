require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');  // Import CORS


const corsOptions = {
  origin: ["https://waaxx.webflow.io", "http://localhost:3000"], // Ganti dengan domain yang sesuai
  optionsSuccessStatus: 200,
};

module.exports = async (req, res) => {
  cors(corsOptions)(req, res, async() => {
    if (req.method === 'POST') {
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
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  });
};
