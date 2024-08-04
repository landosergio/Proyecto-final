import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT,
  mongoURL: process.env.MONGO_URL,
  privateKey: process.env.PRIVATE_KEY,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  gmailAppName: process.env.GMAIL_APP_NAME,
  gmailPassword: process.env.GMAIL_PASSWORD,
};
