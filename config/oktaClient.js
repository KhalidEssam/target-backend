// oktaClient.js
const { Client } = require('@okta/okta-sdk-nodejs');

const oktaClient = new Client({
  orgUrl: `https://${process.env.OKTA_DOMAIN}`, // Replace with your Okta domain
  token: process.env.OKTA_READ_API_TOKEN,       // Replace with your Okta API token
});

module.exports = oktaClient;