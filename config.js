//Create and export config variables

const environments = {};

environments.development = {
  'httpPort': 3000,
  'httpsPort': 3001,
  'envName': 'development'
};

environments.production = {
  'httpPort': 5000,
  'httpsPort': 5001,
  'envName': 'production'
};

//Check which env was passed to cmd line argument
let currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//If NODE_ENV has a not listed environment defaults to development
let environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.development;

module.exports = environmentToExport;
