import {stripe} from  "./stripe"
export const createCheckoutSession = async (userId: string) => {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
  
      payment_method_types: ["card"],
  
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Pro Plan (Unlimited Email + CV)",
            },
            recurring: {
              interval: "month",
            },
            unit_amount: 1999,
          },
          quantity: 1,
        },
      ],
  
      metadata: {
        userId,
      },
  
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });
  
    return session.url;
  };