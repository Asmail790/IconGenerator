/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '3000',
            pathname: '/api',
          },
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '3000',
            pathname: '/static/*',
          },
          {
            hostname:"oaidalleapiprodscus.blob.core.windows.net"

          }
        ],
        
      },
  async redirects(){
    return [
      {
        source: '/',
        destination: '/home',
        permanent:true
      },
    ]
  },
}

module.exports = nextConfig