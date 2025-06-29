const axios = require('axios');

exports.getPaymobToken = async (req, res) => {
    console.log("hiiiiiiii");
  try {
    console.log("PAYMOB_API_KEY",process.env.PAYMOB_API_KEY);
    const response = await axios.post('https://accept.paymob.com/api/auth/tokens', {
      api_key: process.env.PAYMOB_API_KEY
    });

    res.json({
      success: true,
      token: response.data.token
    });
  } catch (error) {
    console.error('Error getting Paymob token:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get Paymob token'
    });
  }
};
