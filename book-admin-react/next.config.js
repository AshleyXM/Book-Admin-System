/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // destination: "https://apifoxmock.com/m1/4562274-4210740-default/api/:path*",
        destination: "http://localhost:3005/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
