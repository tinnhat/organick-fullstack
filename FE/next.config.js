module.exports = {
  env: {
    HOST_BE: process.env.HOST_BE,
    HOST_FE: process.env.HOST_FE,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ]
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  reactStrictMode: false,
}
