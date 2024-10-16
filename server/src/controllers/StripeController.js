const stripe = require('stripe')('sk_test_51Q5nEfP49DsSP07KB3DrsPomYktyU7QtJCOlqKzJr8oOVSRVQla6LkSk4yHiwHiwRgAMcTqDtuJcM7fE1aT1JlLi00OphnqkFr');
const Order = require('../models/orderModel');

const PaymentStripe = async (req, res) => {
    const { orderId, customerEmail, firstName, paymentMethodId } = req.body;

    try {
        const order = await Order.findById(orderId)
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product',
                }
            });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }


        const totalAmount = order.orderItems.reduce((acc, item) => {
            return acc + Math.round(item.discountedPrice * 100) * item.quantity; // Convert to cents
        }, 0);

        let customer;
        const existingCustomers = await stripe.customers.list({
            email: customerEmail,
            limit: 1
        });

        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
        } else {
            customer = await stripe.customers.create({
                email: customerEmail,
                name: firstName,
            });
        }


        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount, // Use the dynamically calculated total amount
            currency: 'inr',
            payment_method: paymentMethodId,
            customer: customer.id,
            payment_method_types: ['card'],
            confirm: true,
        });


        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer: customer.id,
            line_items: order.orderItems.map(item => ({
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: item.product.title,
                    },
                    unit_amount: Math.round(item.discountedPrice * 100), // Convert to cents
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `http://localhost:5173/success`,
            cancel_url: `http://localhost:5173/cart`,
        });

        if (paymentIntent.status === 'succeeded') {
            order.paymentDetails = {
                paymentMethod: 'Card',
                transactionId: paymentIntent.id,
                paymentId: paymentIntent.id,
                paymentStatus: 'COMPLETED', // Set the status to "COMPLETED" if the payment succeeded
            };
            order.orderStatus = 'CONFIRMED';
            await order.save();
        } else {
            // If payment failed, set status to "PENDING"
            order.paymentDetails = {
                paymentMethod: 'Card',
                transactionId: paymentIntent.id,
                paymentId: paymentIntent.id,
                paymentStatus: 'PENDING',
            };
            order.orderStatus = 'PENDING';
            await order.save();
        }


        res.json({ id: session.id });
    } catch (error) {
        console.error("Error creating Stripe checkout session:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    PaymentStripe
};
