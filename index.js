require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());

// You no longer need to serve static files in serverless functions
// Vercel will automatically serve files from the public directory
app.use(express.static('public')); // Serve the public directory (index.html included)

// API routes for handling payments
app.post('/save-card', async (req, res) => {
    try {
        // Create customer logic
        const customer = await stripe.customers.create({
            name: 'Gwen Stacy',
            email: 'gwenstacy101@gmail.com',
            payment_method: req.body.paymentMethodId,
            invoice_settings: { default_payment_method: req.body.paymentMethodId }
        });

        console.log(customer);

        res.status(201).json({ message: 'Card saved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/payment', async (req, res) => {
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
});

module.exports = app;
