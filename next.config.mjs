/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bbwzkqhwmnkifvlgmgqf.supabase.co",
      },
    ],
  },
};

export default nextConfig;
