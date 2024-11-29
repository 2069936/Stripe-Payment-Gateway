const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors"); 
const app = express();

const corsOptions = {
  origin: ["https://waaxx.webflow.io", "http://localhost:3000"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.post("/api/payment", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 499 * 100,
      currency: "usd",
      payment_method_types: ["card"],
      payment_method: req.body.paymentMethodId,
      confirm: true,
      error_on_requires_action: true,
    });
    res.json({ message: "Payment successful" });
    console.log(paymentIntent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = app;
