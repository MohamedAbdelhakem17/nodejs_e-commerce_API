module.exports = {
  environment: process.env.NODE_ENV,
  connectionString: process.env.DB_URI,
  serverPort: process.env.PORT,
  host: process.env.BASE_USRL,
  tokenSecretKey: process.env.JWT_SECRET_KEY,
  email: process.env.USEREMAIL,
  emailService : process.env.SERVICE,
  password: process.env.USERPASSWORD,
  emailHost: process.env.HOST,
  emailPort: process.env.PORT,
};
