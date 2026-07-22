import createNextIntlPlugin from 'next-intl/plugin';

// This automatically looks for your i18n/request.ts file
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tbbwppqtevvozqngsejp.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

// Export the config wrapped with the next-intl plugin!
export default withNextIntl(nextConfig);
