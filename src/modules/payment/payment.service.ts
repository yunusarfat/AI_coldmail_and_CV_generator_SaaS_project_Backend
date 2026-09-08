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
  
      success_url: "https://careerforge-jrrea7va3-arfats-projects-78e9fab8.vercel.app/success",
      cancel_url: "https://careerforge-jrrea7va3-arfats-projects-78e9fab8.vercel.app/cancel",
    });
  
    return session.url;
  };