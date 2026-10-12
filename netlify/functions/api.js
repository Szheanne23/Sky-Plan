const serverless = require('serverless-http');
const app = require('../../server/src/app');

// Wrap Express app as a serverless Netlify Function
const handler = serverless(app);

module.exports.handler = async (event, context) => {
  // Make sure database queries don't hang serverless execution
  context.callbackWaitsForEmptyEventLoop = false;
  return handler(event, context);
};
