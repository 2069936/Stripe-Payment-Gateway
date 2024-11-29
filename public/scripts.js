const stripe = Stripe(
  "pk_test_51QPLd8CNuaCYaEC1WYc83vIXoPDWRiXKxPXgne970WzLB32i1cSM01gNiSrkYsrqLakKg8una9P8DJ6IgrCn6PMv00B6UiK5tw"
);
const elements = stripe.elements({
  fonts: [
    {
      cssSrc:
        "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
    },
  ],
});

// const cardElement = elements.create('card',{
//     stye:{
//         base: {
//             color: '#fff',
//             fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
//             fontSmoothing: 'antialiased',
//             fontSize: '16px',
//             '::placeholder': {
//                 color: '#aab7c4'
//             }
//         },
//         invalid: {
//             color: '#fa755a',
//             iconColor: '#fa755a'
//         }
//     }
// });
// cardElement.mount('#card-element');
const cardNumberElement = elements.create("cardNumber", {
  stye: {
    base: {
      color: "#fff",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
});
cardNumberElement.mount("#card-number-element");

const cardExpiryElement = elements.create("cardExpiry", {
  stye: {
    base: {
      color: "#fff",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
});
cardExpiryElement.mount("#card-expiry-element");

const cardCvcElement = elements.create("cardCvc", {
  stye: {
    base: {
      color: "#fff",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
});
cardCvcElement.mount("#card-cvc-element");

const cardButton = document.getElementById("card-button");
const cardResult = document.getElementById("card-result");
const cardTotal = document.getElementById('card-total').textContent;

cardButton.addEventListener("click", async () => {
  cardResult.textContent = "Loading...";
  const { paymentMethod, error } = await stripe.createPaymentMethod({
    type: "card",
    card: cardNumberElement,
  });
  if (error) {
    cardResult.textContent = error.message;
  } else {
    const apiUrl = "/payment";
    //   window.location.hostname === "localhost"
    //     ? "http://localhost:3000/api/payment"
    //     : "https://stripe-payment-gateway-beta.vercel.app/api/payment";
    const response = await fetch(
        apiUrl,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: cardTotal,
        }),
      }
    );
    const data = await response.json();
    cardResult.textContent = data.message;
    cardNumberElement.clear();
    cardExpiryElement.clear();
    cardCvcElement.clear();
  }
});
