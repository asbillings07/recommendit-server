module.exports = {
  env: process.env.NODE_ENV,
  CLIENT_ORIGIN: 'https://recommendit.netlify.com',
  PORT: process.env.PORT || 5000,
  botEmailAddress: process.env.EMAIL_ADDRESS,
  botEmailPassword: process.env.EMAIL_PASSWORD,
  jwtSecret: process.env.JWT_SECRET,
  cloudApiKey: process.env.CLOUD_API_KEY,
  cloudApiSecret: process.env.CLOUD_API_SECRET,
  googleMailClientId: process.env.GOOGLE_MAIL_CLIENT_ID,
  googleMailClientSecret: process.env.GOOGLE_MAIL_CLIENT_SECRET,
  cookieParserSecret: process.env.COOKIE_PARSER_SECRET
}
