import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cavgwdyjejeujqaulrvk.supabase.co',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.glb$/,
      type: 'asset/resource',
    });
    config.module.rules.push({
      test: /\.gltf$/,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;
