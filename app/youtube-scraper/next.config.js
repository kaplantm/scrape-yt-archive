/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  // https://github.com/gregrickaby/nextjs-github-pages
  assetPrefix: isProd ? '/your-github-repo-name/' : '',
  images: {
    unoptimized: true,
  },


  reactStrictMode: true,
  experimental: {
    swcPlugins: [
      [
        "next-superjson-plugin",
        {
          excluded: [],
        },
      ],
    ],
  },
}

module.exports = nextConfig
