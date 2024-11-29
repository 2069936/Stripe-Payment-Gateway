require('dotenv').config()
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const app = express()
app.use(express.json())

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname})
})

app.post('/save-card', async (req, res) => {
    try {
       //CREATE customer
       const customer = await stripe.customers.create({
        name:'Gwen Stacy',
        email:'gwenstacy101@gmail.com',
        payment_method: req.body.paymentMethodId,
        invoice_settings: {
            default_payment_method: req.body.paymentMethodId
        }
       })
       console.log(customer);
       //END create customer

       //IF Customer already Exist
       /*
       await stripe.paymentMethods.attach(
           req.body.paymentMethodId, {customer: 'cus_RIehVLIHs4FcwM'}
       )
       await stripe.customers.update('cus_RIehVLIHs4FcwM', {
           invoice_settings: {
               default_payment_method: req.body.paymentMethodId
           }
       })
       */
       //END If Customer already Exist

       res.status(201).json({message: 'Card saved successfully'});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post('/payment', async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 499 * 100,
            currency: 'usd',
            payment_method_types: ['card'],
            payment_method: req.body.paymentMethodId,
            confirm: true,
            error_on_requires_action: true
        })
        res.json({message: 'Payment successful'})
        console.log(paymentIntent);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})