require('dotenv').config();
module.exports = {
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  cloudApiKey: process.env.CLOUD_API_KEY,
  cloudApiSecret: process.env.CLOUD_API_SECRET,
  googleMailClientId: process.env.GOOGLE_MAIL_CLIENT_ID,
  googleMailClientSecret: process.env.GOOGLE_MAIL_CLIENT_SECRET,
  cookieParserSecret: process.env.COOKIE_PARSER_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
  saltRounds: process.env.SALT_ROUNDS,

  development: {
    databaseUrl: process.env.DATABASE_URL,
    clientOrigin: 'http://localhost:3000' || 'http://localhost:3001',
    port: process.env.PORT || 5000,
    botEmailAddress: process.env.EMAIL_ADDRESS,
    botEmailPassword: process.env.EMAIL_PASSWORD,
  },
  production: {
    databaseUrl: process.env.PROD_DB_URL,
    clientOrigin: 'https://recommendit.netlify.com',
    port: process.env.PORT || 5000,
    botEmailAddress: process.env.EMAIL_ADDRESS,
    botEmailPassword: process.env.EMAIL_PASSWORD,
  },
};
