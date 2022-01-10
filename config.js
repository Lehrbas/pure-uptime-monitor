//Create and export config variables

const environments = {};

environments.development = {
  'port': 3000,
  'envName': 'development'
};

environments.production = {
  'port': 5000,
  'envName': 'production'
};

//Check which env was passed to cmd line argument
let currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//If NODE_ENV has a not listed environment defaults to development
let environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.development;

module.exports = environmentToExport;
