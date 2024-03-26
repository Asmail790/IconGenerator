/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/static/*",
      },
      {
        protocol:"https",
        hostname:"*",
        port:"*",
        pathname:"**"
      },
      {
        protocol:"https",
        hostname:"localhost",
        port:"*",
        pathname:"**"
      },
      {
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
      },
      {
        hostname:"ep-white-sky-a2myts0k-pooler.eu-central-1.aws.neon.tech"
      }
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
