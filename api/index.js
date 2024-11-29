require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const express = require('express');

const app = express();

// Menggunakan CORS sebagai middleware
const corsOptions = {
  origin: ["https://waaxx.webflow.io", "http://localhost:3000"], // Ganti dengan domain yang sesuai
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));  // Apply CORS di sini, untuk semua request

app.use(express.json()); // Memungkinkan parsing JSON body

// API untuk menangani pembayaran
app.post('/api/payment', async (req, res) => {
  try {
    const { amount, paymentMethodId } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Konversi ke cents
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
