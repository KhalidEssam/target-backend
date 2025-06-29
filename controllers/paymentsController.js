const axios = require('axios');

exports.initiatePayment = async (req, res) => {
  try {
    console.log("initiating");

    const { orderId, amount, orderDescription, customerEmail, customerPhone } = req.body;

    // Step 1: Get auth token
    const authTokenRes = await axios.post('https://accept.paymob.com/api/auth/tokens', {
      api_key: process.env.PAYMOB_API_KEY
    });
    const authToken = authTokenRes.data.token;

    // ✅ Step 2: Create Paymob order (include auth_token in body)
    const orderRes = await axios.post('https://accept.paymob.com/api/ecommerce/orders', {
      auth_token: authToken,
      merchant_order_id: orderId,
      amount_cents: Math.round(amount * 100),
      currency: 'EGP',
      delivery_needed: false,
      items: []
    });

    const paymobOrderId = orderRes.data.id;

    // ✅ Step 3: Create payment key
    const paymentKeyRes = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
      auth_token: authToken,
      amount_cents: Math.round(amount * 100),
      expiration: 3600,
      order_id: paymobOrderId,
      billing_data: {
        apartment: "NA",
        email: customerEmail || "customer@example.com",
        floor: "NA",
        first_name: "Customer",
        last_name: "Name",
        street: "NA",
        building: "NA",
        phone_number: customerPhone || "0123456789",
        shipping_method: "NA",
        postal_code: "NA",
        city: "NA",
        country: "EG",
        state: "NA"
      },
      currency: "EGP",
      integration_id: parseInt(process.env.PAYMOB_INTEGRATION_ID)
    });

    const paymentToken = paymentKeyRes.data.token;

    // ✅ Step 4: Return iframe URL
    const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`;

    res.json({
      success: true,
      paymentUrl
    });

  } catch (error) {
    console.error('❌ Error initiating payment:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Payment initiation failed',
      details: error.response?.data || error.message
    });
  }
};
