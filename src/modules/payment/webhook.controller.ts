import { Request, Response } from "express";
import Stripe from "stripe";

import { User } from "../../models/user.model";
import { stripe } from "./stripe";
// console.log("🚨 WEBHOOK ROUTE ENTERED");
export const stripeWebhookController = async (

    req: Request,
    res: Response
) => {
    // console.log("🔥 WEBHOOK HIT");
    const sig = req.headers["stripe-signature"] as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        return res.status(400).send(
            `Webhook Error: ${err.message}`
        );
    }
    // console.log("EVENT TYPE:", event.type);

    // payment success
    if (
        event.type === "checkout.session.completed" ||
        event.type === "invoice.paid" ||
        event.type === "customer.subscription.created"
    ) {
        const session = event.data.object as any;

        const userId = session.metadata?.userId;

        if (userId) {
            await User.findByIdAndUpdate(userId, {
                plan: "pro",
                planExpiresAt: new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000
                ),
            });
        }

        // console.log("🔥 PAYMENT SUCCESS WEBHOOK TRIGGERED");
        // console.log("EVENT TYPE:", event.type);
        // console.log("USER ID:", userId);
    }

    res.json({
        received: true,
    });
    // console.log("🔥 WEBHOOK HIT");
    // console.log("event type:", event.type);
};