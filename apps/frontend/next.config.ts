import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
};

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: "./src/i18n/messages/en.json",
  },
});

export default withNextIntl(nextConfig);
