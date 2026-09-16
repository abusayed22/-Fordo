import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
  remotePatterns: [
    // {
    //   protocol: "https",
    //   hostname: "res.cloudinary.com",
    // },
    {
        protocol: "https",
        hostname: "**",
      },
  ],
},
experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // আপনার প্রয়োজন অনুযায়ী সাইজ সেট করুন (যেমন: 5mb, 10mb)
    },
  },
};

export default nextConfig;
