/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    // Will be available on both server and client
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    INGRESS_ADDRESS: process.env.INGRESS_ADDRESS,
  },
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300
    return config
  },
}
