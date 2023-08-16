/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'ik.imagekit.io',
            port: '',
            pathname: '/ryanvalle/**',
          },{
            protocol: 'https',
            hostname: 'youtu.be',
            port: '',
            pathname: '/**',
          },
        ],
      },
}

module.exports = nextConfig
