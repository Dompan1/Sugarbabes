const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { User, Payment } = require('../models');

/**
 * Payment Service för Stripe integration
 * Hanterar alla betalningsrelaterade funktioner
 */
class PaymentService {
  constructor() {
    this.products = {
      premium_monthly: {
        id: 'price_premium_monthly',
        name: 'Sugarbabes Premium (Månadsvis)',
        price: 99,
        interval: 'month',
        currency: 'sek'
      },
      premium_yearly: {
        id: 'price_premium_yearly',
        name: 'Sugarbabes Premium (Årsvis)',
        price: 999,
        interval: 'year',
        currency: 'sek'
      },
      boost_small: {
        id: 'price_boost_small',
        name: 'Profil Boost (Liten)',
        price: 49,
        currency: 'sek'
      },
      boost_large: {
        id: 'price_boost_large',
        name: 'Profil Boost (Stor)',
        price: 99,
        currency: 'sek'
      }
    };
  }

  /**
   * Skapa en Stripe checkout session för en produkt
   * @param {string} userId - Användarens ID
   * @param {string} productKey - Produktnyckel (t.ex. premium_monthly)
   * @param {string} successUrl - URL att redirecta till vid lyckad betalning
   * @param {string} cancelUrl - URL att redirecta till vid avbruten betalning
   * @returns {Promise<string>} Checkout session URL
   */
  async createCheckoutSession(userId, productKey, successUrl, cancelUrl) {
    try {
      if (!this.products[productKey]) {
        throw new Error(`Produkten ${productKey} finns inte`);
      }

      const product = this.products[productKey];
      const isSubscription = !!product.interval;
      
      // Hämta användaren för att visa namn i checkout
      const user = await User.findByIdSafe(userId);
      if (!user) {
        throw new Error('Användaren hittades inte');
      }

      // Skapa Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: user.email,
        client_reference_id: userId,
        line_items: [
          {
            price_data: {
              currency: product.currency,
              product_data: {
                name: product.name,
                description: isSubscription 
                  ? `Prenumeration, debiteras ${product.interval}svis` 
                  : 'Engångsbetalning'
              },
              unit_amount: product.price * 100, // Öre istället för kronor
              recurring: isSubscription ? { interval: product.interval } : null
            },
            quantity: 1
          }
        ],
        mode: isSubscription ? 'subscription' : 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId,
          productKey
        }
      });

      // Spara betalningsinformation i vår databas
      await Payment.create({
        user_id: userId,
        amount: product.price,
        product: product.name,
        payment_provider: 'stripe',
        transaction_id: session.id,
        status: 'pending',
        is_subscription: isSubscription
      });

      return session.url;
    } catch (error) {
      console.error('Stripe checkout error:', error);
      throw new Error('Kunde inte skapa checkout session: ' + error.message);
    }
  }

  /**
   * Hantera webhook events från Stripe
   * @param {object} event - Stripe webhook event objekt
   * @returns {Promise<boolean>} Indikerar om hanteringen lyckades
   */
  async handleWebhookEvent(event) {
    try {
      const { type, data } = event;

      // Olika event typer att hantera
      switch (type) {
        case 'checkout.session.completed': {
          const session = data.object;
          
          // Hämta betalning från vår databas
          const payment = await Payment.findOne({
            where: { transaction_id: session.id }
          });
          
          if (payment) {
            // Uppdatera betalningsstatus
            payment.status = 'complete';
            payment.completed_at = new Date();
            
            if (session.subscription) {
              payment.subscription_id = session.subscription;
            }
            
            await payment.save();
            
            // Aktivera premium för användaren
            const user = await User.findByPk(payment.user_id);
            if (user) {
              user.is_premium = true;
              await user.save();
            }
          }
          break;
        }
        
        case 'invoice.payment_succeeded': {
          // Hantera återkommande betalningar
          const invoice = data.object;
          
          // Hitta användaren via subscription ID
          const payment = await Payment.findOne({
            where: { subscription_id: invoice.subscription }
          });
          
          if (payment) {
            // Skapa ny betalningspost för denna fakturering
            await Payment.create({
              user_id: payment.user_id,
              amount: invoice.amount_paid / 100, // Konvertera från öre till kronor
              product: payment.product,
              payment_provider: 'stripe',
              transaction_id: invoice.id,
              status: 'complete',
              is_subscription: true,
              subscription_id: invoice.subscription,
              completed_at: new Date()
            });
            
            // Säkerställ att användaren fortfarande har premium
            const user = await User.findByPk(payment.user_id);
            if (user && !user.is_premium) {
              user.is_premium = true;
              await user.save();
            }
          }
          break;
        }
        
        case 'customer.subscription.deleted': {
          // Hantera när en prenumeration avslutas
          const subscription = data.object;
          
          // Hitta betalning med detta subscription ID
          const payment = await Payment.findOne({
            where: { subscription_id: subscription.id }
          });
          
          if (payment) {
            // Ta bort premium från användaren
            const user = await User.findByPk(payment.user_id);
            if (user) {
              user.is_premium = false;
              await user.save();
            }
          }
          break;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Webhook handling error:', error);
      return false;
    }
  }

  /**
   * Avbryt en prenumeration
   * @param {string} userId - Användarens ID
   * @returns {Promise<boolean>} Indikerar om annulleringen lyckades
   */
  async cancelSubscription(userId) {
    try {
      // Hitta aktiv prenumeration för användaren
      const payment = await Payment.findOne({
        where: {
          user_id: userId,
          is_subscription: true,
          subscription_id: { [Op.ne]: null }
        },
        order: [['created_at', 'DESC']]
      });
      
      if (!payment || !payment.subscription_id) {
        throw new Error('Ingen aktiv prenumeration hittades');
      }
      
      // Avbryt prenumeration i Stripe
      await stripe.subscriptions.del(payment.subscription_id);
      
      // Användaren behåller premium till slutet av faktureringsperioden
      // så vi uppdaterar inte user.is_premium här
      
      return true;
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw new Error('Kunde inte avbryta prenumerationen: ' + error.message);
    }
  }
}

module.exports = new PaymentService(); 