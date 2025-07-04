/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      MONGODB_URI: process.env.MONGODB_URI,
      CASHFREE_APP_ID: process.env.CASHFREE_APP_ID,
        CASHFREE_SECRET_KEY: process.env.CASHFREE_SECRET_KEY,
    },
    
  };
  
  export default nextConfig;
  