const Razorpay = require('razorpay');
const crypto = require('crypto');
const pool = require('../config/db');
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { planId, amount, currency = 'INR', clinicAdminId } = req.body;

    if (!amount || !clinicAdminId) {
      return res.status(400).json({ status: 'error', message: 'Amount and clinicAdminId are required' });
    }

    const options = {
      amount: amount * 100, // Razorpay works in paise/smallest currency unit
      currency,
      receipt: `receipt_${Date.now()}_${clinicAdminId}`,
    };

    const order = await razorpay.orders.create(options);

    // Initial log of payment as pending
    const paymentId = crypto.randomUUID();
    await pool.query(
      `INSERT INTO saas_payments (id, clinic_admin_id, amount, status, currency, razorpay_order_id, plan_id) 
       VALUES (?, ?, ?, 'Pending', ?, ?, ?)`,
      [paymentId, clinicAdminId, amount, currency, order.id, planId]
    );

    res.status(200).json({
      status: 'success',
      data: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.RAZORPAY_KEY_ID,
        internal_payment_id: paymentId
      }
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create order' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, clinicAdminId, planId, amount } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment successful
      const invoiceNumber = `INV-${Date.now()}`;
      
      // Update Payment
      await pool.query(
        `UPDATE saas_payments SET 
          status = 'Successful', 
          razorpay_payment_id = ?, 
          razorpay_signature = ?, 
          invoice_number = ?, 
          payment_method = 'Razorpay' 
        WHERE razorpay_order_id = ?`,
        [razorpay_payment_id, razorpay_signature, invoiceNumber, razorpay_order_id]
      );

      // Create or update subscription
      const subId = crypto.randomUUID();
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription
      
      await pool.query(
        `INSERT INTO saas_subscriptions (id, clinic_admin_id, plan_id, status, start_date, end_date, razorpay_payment_id) 
         VALUES (?, ?, ?, 'Active', ?, ?, ?)
         ON DUPLICATE KEY UPDATE status = 'Active', end_date = ?, razorpay_payment_id = ?`,
        [subId, clinicAdminId, planId, startDate, endDate, razorpay_payment_id, endDate, razorpay_payment_id]
      );

      // Optional: update users table if they are clinic admin to set is_subscribed = true or similar if that exists.

      res.status(200).json({
        status: 'success',
        message: 'Payment verified and subscription activated successfully',
        data: { invoiceNumber }
      });
    } else {
      // Payment failed/tampered
      await pool.query(
        `UPDATE saas_payments SET status = 'Failed' WHERE razorpay_order_id = ?`,
        [razorpay_order_id]
      );

      res.status(400).json({ status: 'error', message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error during verification' });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const [payments] = await pool.query(
      `SELECT p.*, u.email as user_email, u.first_name, u.last_name 
       FROM saas_payments p 
       JOIN users u ON p.clinic_admin_id = u.id 
       ORDER BY p.payment_date DESC`
    );
    res.status(200).json({ status: 'success', data: payments });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch payment history' });
  }
};
