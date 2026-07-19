import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,

  mongodbUri: process.env.MONGODB_URI,
  dbName: process.env.DB_NAME,

  clientUrl: process.env.CLIENT_URL,

  jwt: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    accessExpiry: process.env.ACCESS_TOKEN_EXPIRY,

    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshExpiry: process.env.REFRESH_TOKEN_EXPIRY,
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};