/** @type {import('next').NextConfig} */
const nextConfig = {
  images:
  {  remotePatterns:[
    {
      protocol: 'https',
      hostname: "ycisqu7oivakhiyf.public.blob.vercel-storage.com"
    }
  ]
  }
};

export default nextConfig;
