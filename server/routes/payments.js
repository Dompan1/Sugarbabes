const express = require('express');
const paymentService = require('../services/payment');
const { Payment } = require('../models');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Skapa en checkout session
router.post('/checkout', async (req, res) => {
  try {
    const { productKey, successUrl, cancelUrl } = req.body;
    const userId = req.user.id;
    
    if (!productKey || !successUrl || !cancelUrl) {
      return res.status(400).json({
        success: false,
        message: 'Fan, produktnyckel och URLs krävs'
      });
    }
    
    const checkoutUrl = await paymentService.createCheckoutSession(
      userId, 
      productKey, 
      successUrl, 
      cancelUrl
    );
    
    return res.status(200).json({
      success: true,
      checkoutUrl
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Helvete, kunde inte skapa checkout session'
    });
  }
});

// Avbryt prenumeration
router.post('/cancel-subscription', async (req, res) => {
  try {
    const userId = req.user.id;
    
    await paymentService.cancelSubscription(userId);
    
    return res.status(200).json({
      success: true,
      message: 'Din prenumeration kommer avslutas vid slutet av faktureringsperioden'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Helvete, kunde inte avbryta prenumerationen'
    });
  }
});

// Hämta betalningshistorik
router.get('/history', async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const payments = await Payment.findAndCountAll({
      where: { user_id: userId },
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      totalPayments: payments.count,
      totalPages: Math.ceil(payments.count / limit),
      currentPage: page,
      payments: payments.rows
    });
  } catch (error) {
    console.error('Payment history error:', error);
    return res.status(500).json({
      success: false,
      message: 'Helvete, kunde inte hämta betalningshistorik'
    });
  }
});

// Hämta prenumerationsstatus
router.get('/subscription', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Hitta senaste aktiva prenumerationen
    const subscription = await Payment.findOne({
      where: {
        user_id: userId,
        is_subscription: true,
        status: 'complete'
      },
      order: [['created_at', 'DESC']]
    });
    
    if (!subscription) {
      return res.status(200).json({
        success: true,
        hasSubscription: false
      });
    }
    
    // Om vi har en subscription_id, hämta mer info från Stripe
    let subscriptionDetails = null;
    if (subscription.subscription_id) {
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(
          subscription.subscription_id
        );
        
        subscriptionDetails = {
          status: stripeSubscription.status,
          currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
          cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
          product: subscription.product
        };
      } catch (stripeError) {
        console.error('Stripe subscription retrieval error:', stripeError);
      }
    }
    
    return res.status(200).json({
      success: true,
      hasSubscription: true,
      subscription: {
        id: subscription.id,
        product: subscription.product,
        created_at: subscription.created_at,
        details: subscriptionDetails
      }
    });
  } catch (error) {
    console.error('Subscription status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Helvete, kunde inte hämta prenumerationsstatus'
    });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    
    if (!sig) {
      return res.status(400).send('Signatur saknas');
    }
    
    // Verifiera webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body, 
        sig, 
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification error:', err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Hantera webhook event
    const success = await paymentService.handleWebhookEvent(event);
    
    if (success) {
      return res.status(200).json({ received: true });
    } else {
      return res.status(500).json({ received: false });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).send('Webhook Error');
  }
});

module.exports = router; 