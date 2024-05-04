/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["embold.s3.ap-south-1.amazonaws.com", "images.dog.ceo"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/feneel",
        destination: "https:www.feneelpatel.com",
        permanent: false,
        basePath: false,
      },
      {
        source: "/instagram",
        destination: "https:www.instagram.com/emboldthebold",
        permanent: false,
        basePath: false,
      },
    ];
  },
};

module.exports = nextConfig;
